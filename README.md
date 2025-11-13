# WishEcho
Rediscover your younger dreams. Choose a meaningful goal for today.

## Overview
WishEcho is a relective and motivational web app that helps users reconnect with dreams they may have forgotten.
Users input the "I will definitely do it after ..." thing, and WishEcho displays what younger age groups or people in earlier life stages wish for, creating a unique emotional "echo" that helps users rediscover past desires and choose an approachable goal to pursue today.

## Features
### 1. Submit Your Current Wish
Users submit:
- What they want to do but cannot do it right now
- Their current age range
- Optional category (skill / adventure / relationship / self-care ...)
Stored in a PostgreSQL database via Prisma.
### 2. View Wishes from Younger Users
Browse wishes submitted by users who are younger than you for in an earlier life stage than you

Example: 
If you are 20 and in college, you'll see wishes from ages 10-19 who are in middle schools.

This helps reveal:
- forgotten interests.
- echoes of past stages of life.
- some goals that are too difficult in a younger age, but approachable for you right now.
### 3. Basic Goal Selection
Users can choose one wish and mark it as a "current goal" to keep track of.

Advices can be given according to the goal selected.
Example:
If "start to workout regularly" is chosen, the app would suggest gyms, meal, influencers, etc.

## Tech Stack
### Frontend
Next.js 14 (App Router)
React 18
### Backend
Next.js API routes
Prisma ORM
### Database
PostgreSQL
### Dev Tools
TypeScript
ESLint
Node.js

