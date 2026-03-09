# 🌊 WishEcho Vibe Logs

> This document tracks the high-level prompts and "vibes" used to generate the current state of the project.

---

## 📅 [2026-03-09] The "Architect" Prompt
**Prompt**: > I want to build a web app called WishEcho. The core vibe is "nostalgic, reflective, and actionable." It helps users rediscover forgotten dreams by showing them wishes from people in younger life stages.

Tech Stack: Next.js 14 (App Router), TypeScript, Prisma, PostgreSQL, and Tailwind CSS.

Task:

Design a Prisma schema that includes User, Wish (with ageRange, category, and status), and Goal (tracking a selected wish).

Create the project folder structure following Next.js 14 best practices.

Write a Server Action to submit a new wish.

Create a utility function that calculates the "Echo Filter"—logic that ensures a user only sees wishes from age groups strictly younger than their own.

Please keep the code modular and use TypeScript interfaces for everything.

---

## 📅 [2026-03-09] The "UI/UX Aesthetic" Prompt
**Prompt**: > I am building the frontend for WishEcho. The UI should feel like a "gentle ripple in time." I want a clean, minimalist aesthetic with soft gradients and subtle animations.

Task:

Create a React component for a "Wish Card." It should display the wish text, the age range of the person who made it, and a "Pursue this today" button.

Build the main "Echo Feed" page. Use Framer Motion to make the wishes fade in or float slightly, as if they are echoes from the past.

Implement a filter sidebar where users can toggle categories like "Adventure," "Self-care," or "Skill."

Use Tailwind CSS for styling. Focus on high-quality typography and a color palette that feels reflective (e.g., deep indigos, soft violets, or warm sunsets).

---

## 📅 [2026-03-09] The "Feature Logic" Prompt
**Prompt**: > I need to implement the Goal Selection feature in WishEcho. When a user selects a wish as a "Current Goal," the app should provide immediate, actionable advice.

Task:

Create a dynamic "Goal Dashboard" page.

Write a function (or an API route) that takes the selected wish text and uses a structured prompt to generate 3 small, immediate steps the user can take today.

Example: If the wish is "Start working out," suggest a 10-minute home routine, a local park, or a beginner-friendly YouTube creator.

Ensure the state updates in the PostgreSQL database via Prisma when a goal is marked as "Completed."

---
