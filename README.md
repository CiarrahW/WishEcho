# WishEcho 🕰️✨

> *Listen to the echoes of yesterday. Share your dreams with the future.*

WishEcho is a reflective, nostalgic web application where users can leave wishes for their future selves or others, and read "echoes" (wishes) from people in life stages they've already passed. It bridges the gap between past dreams and present actions, allowing users to adopt past wishes as current goals and receive AI-powered actionable steps to pursue them today.

## 🌟 Features

*   **The Echo Filter**: A unique chronological filter. Users only see wishes submitted by people in life stages *strictly younger* than their current stage (e.g., someone in their 30s sees wishes from Childhood, Teens, and 20s).
*   **Leave an Echo**: Share your dreams, categorized by themes like Career, Adventure, Personal Growth, and Relationships.
*   **Goal Dashboard**: Found a wish that resonates? Click "Pursue this today" to add it to your personal Goal Dashboard.
*   **AI-Powered Action Steps**: Using the Gemini API, WishEcho generates 3 small, immediate, and practical steps you can take *today* to start working towards your selected goal.
*   **Goal Tracking**: Mark goals as "Completed" or "In Progress" as you journey towards fulfilling them.
*   **Secure Authentication**: JWT-based user authentication to keep your wishes and goals private and personalized.
*   **Nostalgic UI**: A warm, paper-inspired aesthetic with sepia tones, elegant serif typography, and smooth Framer Motion animations.

## 🛠️ Tech Stack

*   **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide React
*   **Backend**: Express.js (Full-stack Vite integration)
*   **Database**: SQLite (`better-sqlite3`) for lightweight, robust local storage
*   **Authentication**: JSON Web Tokens (JWT) & bcrypt
*   **AI**: Google Gemini API (`@google/genai`)

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   A Google Gemini API Key

### Installation

1.  **Clone the repository** (if applicable) or download the source code.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env` file in the root directory and add the following:
    ```env
    # Required for AI-powered actionable steps
    GEMINI_API_KEY=your_gemini_api_key_here
    
    # Optional: Custom secret for JWT signing (defaults to a fallback in dev)
    JWT_SECRET=your_super_secret_jwt_key
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:3000`.

## 📂 Project Structure

*   `/server.ts`: The Express backend entry point, containing API routes for auth, wishes, goals, and Gemini AI integration.
*   `/src/components/`: React components including the `GoalDashboard`, `WishCard`, `AuthForm`, and `SubmitWishForm`.
*   `/src/utils/echoFilter.ts`: The core logic for filtering wishes based on the user's life stage.
*   `/src/types/index.ts`: TypeScript interfaces for Users, Wishes, Goals, and Enums.
*   `/src/index.css`: Global Tailwind CSS configuration and custom theme variables (warm paper/sepia aesthetic).

## 🎨 Design Philosophy

WishEcho is designed to feel like a "gentle ripple in time." The UI avoids harsh colors and sharp edges, opting instead for soft shadows, rounded corners, and a color palette inspired by old journals and warm sunsets. It encourages reflection rather than doom-scrolling.
