import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const db = new Database('wishecho.db');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-dev';

// Initialize DB schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    ageRange TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS wishes (
    id TEXT PRIMARY KEY,
    content TEXT,
    ageRange TEXT,
    category TEXT,
    status TEXT DEFAULT 'ACTIVE',
    authorId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (authorId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    userId TEXT,
    wishId TEXT,
    status TEXT DEFAULT 'IN_PROGRESS',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (wishId) REFERENCES wishes(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Auth Middleware ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- Auth Routes ---
  app.post('/api/auth/signup', async (req, res) => {
    const { email, password, name, ageRange } = req.body;
    if (!email || !password || !name || !ageRange) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const id = uuidv4();
      
      db.prepare('INSERT INTO users (id, email, password, name, ageRange) VALUES (?, ?, ?, ?, ?)')
        .run(id, email, hashedPassword, name, ageRange);

      const token = jwt.sign({ id, email, name, ageRange }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({ token, user: { id, email, name, ageRange } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    try {
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, name: user.name, ageRange: user.ageRange }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, email: user.email, name: user.name, ageRange: user.ageRange } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to log in' });
    }
  });

  app.get('/api/me', authenticateToken, (req: any, res: any) => {
    try {
      const user = db.prepare('SELECT id, email, name, ageRange, createdAt FROM users WHERE id = ?').get(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

  // --- API Routes ---
  
  // Get all wishes
  app.get('/api/wishes', (req, res) => {
    try {
      const wishes = db.prepare('SELECT * FROM wishes ORDER BY createdAt DESC').all();
      res.json(wishes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch wishes' });
    }
  });

  // Submit a new wish
  app.post('/api/wishes', authenticateToken, (req: any, res: any) => {
    const { content, ageRange, category } = req.body;
    const authorId = req.user.id;
    
    if (!content || !ageRange || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();
    const stmt = db.prepare('INSERT INTO wishes (id, content, ageRange, category, authorId) VALUES (?, ?, ?, ?, ?)');
    
    try {
      stmt.run(id, content, ageRange, category, authorId);
      const newWish = db.prepare('SELECT * FROM wishes WHERE id = ?').get(id);
      res.status(201).json(newWish);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create wish' });
    }
  });

  // --- Goal Routes ---
  
  // Get user's goals
  app.get('/api/goals', authenticateToken, (req: any, res: any) => {
    try {
      const goals = db.prepare(`
        SELECT g.*, w.content as wishContent, w.category as wishCategory 
        FROM goals g 
        JOIN wishes w ON g.wishId = w.id 
        WHERE g.userId = ? 
        ORDER BY g.createdAt DESC
      `).all(req.user.id);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch goals' });
    }
  });

  // Create a goal from a wish
  app.post('/api/goals', authenticateToken, (req: any, res: any) => {
    const { wishId } = req.body;
    const userId = req.user.id;
    
    if (!wishId) {
      return res.status(400).json({ error: 'Missing wishId' });
    }

    const id = uuidv4();
    
    try {
      // Check if goal already exists
      const existing = db.prepare('SELECT * FROM goals WHERE userId = ? AND wishId = ?').get(userId, wishId);
      if (existing) {
        return res.status(400).json({ error: 'Goal already exists for this wish' });
      }

      db.prepare('INSERT INTO goals (id, userId, wishId) VALUES (?, ?, ?)')
        .run(id, userId, wishId);
        
      const newGoal = db.prepare(`
        SELECT g.*, w.content as wishContent, w.category as wishCategory 
        FROM goals g 
        JOIN wishes w ON g.wishId = w.id 
        WHERE g.id = ?
      `).get(id);
      
      res.status(201).json(newGoal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create goal' });
    }
  });

  // Update goal status
  app.patch('/api/goals/:id', authenticateToken, (req: any, res: any) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status) {
      return res.status(400).json({ error: 'Missing status' });
    }

    try {
      const result = db.prepare('UPDATE goals SET status = ? WHERE id = ? AND userId = ?')
        .run(status, id, userId);
        
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Goal not found or unauthorized' });
      }
      
      const updatedGoal = db.prepare('SELECT * FROM goals WHERE id = ?').get(id);
      res.json(updatedGoal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update goal' });
    }
  });

  // Generate steps using Gemini
  app.post('/api/generate-steps', authenticateToken, async (req: any, res: any) => {
    const { wishContent } = req.body;
    
    if (!wishContent) {
      return res.status(400).json({ error: 'Missing wish content' });
    }

    try {
      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 3 small, immediate, actionable steps a person can take TODAY to start pursuing this wish: "${wishContent}". Keep them short and practical.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
            description: "An array of exactly 3 strings, each representing a small actionable step.",
          },
        },
      });

      const steps = JSON.parse(response.text || '[]');
      res.json({ steps });
    } catch (error) {
      console.error('Failed to generate steps:', error);
      res.status(500).json({ error: 'Failed to generate steps' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
