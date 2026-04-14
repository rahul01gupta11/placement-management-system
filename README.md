# placement-management-system

Full stack placement management project with:

- `backend/`: Node.js, Express, MongoDB
- `frontend/`: React + Vite + Tailwind CSS + Axios + React Router

## Backend APIs Used By Frontend

The frontend is wired to the backend routes already present in `backend/server.js`:

- `GET /api/students`
- `POST /api/students`
- `GET /api/companies`
- `POST /api/companies`
- `GET /api/applications`
- `POST /api/applications/apply`
- `GET /api/stages`
- `GET /api/placements`

## Important Backend Note

The backend currently does **not** expose dedicated authentication routes.

- Student login in the frontend matches against existing student records from `GET /api/students`
- Student registration uses `POST /api/students`
- Admin access is frontend-gated because there is no backend admin login route

## Run Backend

From `backend/`:

```bash
npm install
node server.js
```

Backend runs on `http://localhost:5000` by default.

## Run Frontend

From `frontend/`:

```bash
npm install
npm run dev
```

Frontend runs on Vite's local dev server. The Vite config proxies `/api` requests to `http://localhost:5000`.

## Frontend Stack

- React
- Vite
- Tailwind CSS
- Axios
- React Router

## Frontend Features

- Student register/login flow based on existing student APIs
- Student dashboard with:
  - company listing
  - apply action
  - application status
  - stage status
  - placement overview
- Admin dashboard with:
  - add company
  - view students
  - view applications
  - view companies
