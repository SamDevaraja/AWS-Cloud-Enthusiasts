# AWS Cloud Enthusiasts Frontend

This is the React/Vite frontend for the AWS Cloud Enthusiasts Event Management platform.

## Technical Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Styling:** Vanilla CSS + Tailwind-like Utility Classes
- **API Requests:** Axios

## Getting Started

### 1. Installation
Install the project dependencies locally:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `frontend` folder if you need to point to a production API:
```ini
VITE_API_URL=http://localhost:5000/api
```
*(If running locally, the Vite dev server proxy in `vite.config.js` will automatically route `/api` to your local `http://localhost:5000` backend).*

### 3. Start Development Server
Run the Vite development server:
```bash
npm run dev
```
The app will be accessible at `http://localhost:5173`.

### 4. Build for Production
To build the app for production (Vercel deployment):
```bash
npm run build
```
