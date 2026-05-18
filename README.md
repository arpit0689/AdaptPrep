# AdaptPrep

AdaptPrep is a production-structured MERN application for adaptive exam preparation and consistency management. It is built for Indian competitive and academic exams such as JEE, NEET, UPSC, GATE, SSC, CUET, CAT, and Board Exams.

The app is more than a planner: it generates topic-wise roadmaps from an exam syllabus engine, tracks attendance and streaks, schedules spaced revisions, classifies weak areas, and activates gentle recovery plans when consistency breaks.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Framer Motion, Recharts, Zustand, Lucide React
- Backend: Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcryptjs, node-cron, express-validator, dotenv
- Deployment: Vercel frontend, Render backend, MongoDB Atlas database


## Adaptive Services

- `syllabusEngineService`: maps exams to subjects, chapters, topics, and roadmap templates.
- `roadmapService`: generates topic-wise daily plans with buffers, mock tests, and recovery tasks.
- `revisionService`: creates 1-day, 7-day, and 30-day spaced repetition tasks without duplicates.
- `attendanceService`: supports manual and automatic attendance from completed study time.
- `streakService`: tracks current and longest streak with grace handling.
- `recoveryService`: redistributes overdue work gradually instead of dumping backlog into one day.
- `weakAreaService`: classifies Strong, Average, Weak, and Critical topics.
- `analyticsService`: produces readiness, backlog, completion, revision, and consistency metrics.
