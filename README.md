# DROPZONE — Frontend

The frontend of **DROPZONE**, an Esports Tournament Management & Analytics System built to manage competitive gaming tournaments and visualize esports statistics.

Built with **Next.js, React, TypeScript, and Tailwind CSS**, the application provides an interface for exploring tournaments, teams, players, leaderboards, and tournament analytics.

## Tech Stack

- **Framework:** Next.js 16
- **Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend Integration:** REST API
- **HTTP Requests:** Fetch API
- **Deployment:** Vercel

## Features

- **Dashboard** — Overview of tournaments, teams, players, and matches.
- **Tournaments** — Browse tournaments, prize pools, schedules, and statuses.
- **Tournament Details** — View tournament-specific information.
- **Teams** — Explore participating esports teams and their rosters.
- **Players** — Browse players and their game profiles.
- **Leaderboards** — View top players based on kills, damage, and assists.
- **Analytics** — Explore tournament and match statistics.

## Project Structure

```text
src/
├── app/
│   ├── analytics/
│   ├── leaderboard/
│   ├── players/
│   ├── teams/
│   ├── tournaments/
│   ├── page.tsx
│   └── layout.tsx
│
├── components/
│   ├── layout/
│   └── ui/
│
└── lib/
    └── api.ts
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Backend server running locally or deployed

### 1. Clone the Repository

```bash
git clone <your-frontend-repository-url>
cd esports-tournament-management-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Make sure the URL matches the base URL configured by your backend.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint checks |

## Backend Integration

The frontend communicates with the Spring Boot backend through REST APIs.

The API configuration is centralized in:

```text
src/lib/api.ts
```

The backend must be running and accessible through the configured `NEXT_PUBLIC_API_URL` for live data to load correctly.

## Production Build

To verify and generate the production build:

```bash
npm run build
```

To run the production build locally:

```bash
npm run start
```

## Related Repository

- **Backend:** Spring Boot + MySQL

---

**DROPZONE** — Compete. Conquer. Dominate.

Built as part of an Esports Tournament Management & Analytics System.
