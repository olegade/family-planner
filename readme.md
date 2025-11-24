# 📘 Family Planner  
A personal full-stack project I'm building to create a better overview of everyday life for my family — and at the same time a place where I can sharpen my skills with modern web development.

The project started with a simple idea:  
> *“Why isn’t there a single place that shows all our schedules, appointments, notes, and daily information?”*

So I decided to build it myself — from scratch.

---

## 🧱 Tech Stack  
I’ve chosen a modern, realistic stack that reflects what many engineering teams use in 2025:

### Backend  
- **Fastify**  
- **Node.js (ESM)**  
- **Prisma 7** (with the official pg adapter)  
- **PostgreSQL** (running locally via Docker)  
- **pnpm workspaces**  
- **TypeScript**  
- Clean domain-driven structure (routes → services → db)

### Frontend  
- **React 18**  
- **Vite**  
- **TypeScript**  
- Minimal UI for now — functionality first

### Dev & Infrastructure  
- Monorepo powered by pnpm  
- Docker for database  
- GitHub for version control  
- (Coming later: CI/CD, linting, tests, Pulumi, AWS)

---

## 🚀 Current Status  
It’s still early, but the core foundation is solid:

### ✔ Backend  
- Fastify server running  
- PostgreSQL (via Docker)  
- Prisma 7 configured with pg adapter  
- CRUD for Family Members  
  - `GET /family-members`  
  - `POST /family-members`  
  - `DELETE /family-members/:id`  
- CORS configured for local development

### ✔ Frontend  
- React + Vite running  
- Fetch family members from API  
- Create a family member  
- Delete a family member  
- Simple state handling

---

## 🔮 Roadmap  
This is not meant to be a “finished product” right away — the goal is to build it slowly, feature by feature, in a way that actually fits how my own family works.

### Next areas I want to explore  
- Visual improvements  
- Color badges for family members  
- Calendar feed import (AULA, ForældreIntra, etc.)  
- Weekly overview: school, work, activities  
- Local weather + live Midttrafik departures  
- “Weekly digest” view  
- Authentication (simple login or magic links)  
- Long-term: mobile app with React Native

---

## 🔧 Local Development

### Install dependencies
```bash
pnpm install
```

### Start backend
```bash
pnpm dev:api
```

### Start frontend
```bash
pnpm dev:web
```

### Start database
```bash
docker compose up -d
```

---

## 🧠 Why I Built This  
I wanted a project where I could:

- work with the technologies modern teams actually use  
- train full-stack architecture from scratch  
- build something useful for my own daily life  
- show my development process, decisions, and patterns

This is not a school project — it’s a long-term personal tool and a learning playground.

---

## 🧑‍💻 Contact  
If you want to follow the project or discuss architecture/tech:

**Ole Gade**  
GitHub: [@olegade](https://github.com/olegade)
