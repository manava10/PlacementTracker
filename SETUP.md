# Setup Guide — Placement Management System (from ZIP / fresh clone)

> The downloaded ZIP / cloned repo does **not** include `node_modules/` or the `.env` files
> (they are gitignored). You must install dependencies and create the `.env` files yourself.

## 0. Prerequisites (install once)
| Tool | Why | Check with |
|---|---|---|
| **Node.js ≥ 18** | runs backend & frontend | `node -v` |
| **npm** | installs packages (comes with Node) | `npm -v` |
| **MongoDB** | the database | `mongod --version` |

**Install MongoDB (pick one):**
- **Local (macOS):** `brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community`
- **Local (Windows):** install MongoDB Community Server from mongodb.com; it runs as a Windows service on port `27017`.
- **Cloud (no install):** create a free cluster at **MongoDB Atlas** → you'll get a connection string like
  `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/placement-db`.

After unzipping you should have:
```
CAPSTONE PROJECT/
├── placement-backend/
└── placement-frontend/
```

---

## 1. Backend setup

```bash
cd placement-backend
npm install
```

**Create the `.env` file** (it is NOT in the ZIP). In `placement-backend/`:
```bash
cp .env.example .env
```
Open `.env` and put:
```env
PORT=5002
NODE_ENV=development

# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/placement-db
# OR MongoDB Atlas (replace with your string):
# MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/placement-db

JWT_SECRET=any_long_random_string_change_me
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```
> `JWT_SECRET` can be any long random text. The database (`placement-db`) is created
> automatically by MongoDB on first write — you don't create it manually.

**Load the demo data (creates + fills the database):**
```bash
npm run seed
```
Expected output:
```
✓ MongoDB Connected: localhost
✓ Database reset complete.
✓ Seed completed successfully.
```

**Start the backend:**
```bash
npm run dev
```
Leave this terminal running → `✓ Server running on http://localhost:5002`

---

## 2. Frontend setup

Open a **second terminal**:
```bash
cd placement-frontend
npm install
```

**Create the frontend `.env`** (also not in the ZIP). In `placement-frontend/`, create a file
named `.env` containing exactly:
```env
VITE_API_URL=http://localhost:5002/api
```
> This must match the backend's `PORT` (5002). If you changed the backend port, change it here too.

**Start the frontend:**
```bash
npm run dev
```
→ opens at **http://localhost:5173**

---

## 3. Run order (every time you use it)
1. Make sure **MongoDB** is running (`brew services start mongodb-community`, or the Atlas cluster is online).
2. Terminal A: `cd placement-backend && npm run dev`
3. Terminal B: `cd placement-frontend && npm run dev`
4. Open http://localhost:5173 and log in.

> You only run `npm install` and `npm run seed` **once**. After that, just `npm run dev` in both folders.

---

## 4. What data goes in (from `npm run seed`)
The seed script populates MongoDB with a ready-to-use demo:

| Collection | Seeded |
|---|---|
| Users | 1 admin, 1 TPO head, 5 students, 6 companies (13 total) |
| Companies | ABC Technologies, Tech Solutions, Infosys, Deloitte, Wipro, TCS |
| Placement Drives | 6 (mix of upcoming / ongoing / completed) |
| Applications | 9 (some already shortlisted/selected → drives placement stats) |
| Interviews | 3 |

**Login credentials created by the seed:**
| Role | Email | Password |
|---|---|---|
| Admin | `admin@placement.com` | `admin123` |
| **TPO Head** | `tpohead@placement.com` | `tpohead123` |
| Student | `prajwal@student.com` (also aditya@, sneha@, rahul@, ananya@student.com) | `student123` |
| Company | `careers@abctech.com` (also jobs@techsolutions.com, campus@infosys.com, careers@deloitte.com, careers@wipro.com, careers@tcs.com) | `company123` |

**You don't have to seed** — if you skip `npm run seed`, the app still works with an empty
database; you'd just register your own student/company accounts from the signup page
(admin & TPO accounts, however, only come from the seed).

---

## 5. Common problems
| Symptom | Fix |
|---|---|
| `MongoNetworkError` / `connect ECONNREFUSED 127.0.0.1:27017` | MongoDB isn't running — start it (or check your Atlas URI/IP whitelist). |
| Frontend loads but login fails / network error | Backend not running, or `VITE_API_URL` port ≠ backend `PORT`. |
| `EADDRINUSE: port 5002` | Another process is on 5002 — kill it or change `PORT` in both `.env` files. |
| CORS error in browser | Backend `CLIENT_URL` must equal the frontend URL (`http://localhost:5173`). |
| `npm run seed` hangs / times out | MongoDB isn't reachable — same as first row. |
| 404 on `/api/...` | Confirm backend printed `Server running on http://localhost:5002`. |
