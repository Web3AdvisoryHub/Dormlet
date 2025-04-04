# Dormlet Deployment Configuration

This file contains the configuration for deploying the Dormlet application.

## Environment Variables

```
# Frontend
NEXT_PUBLIC_BACKEND_URL=https://api.dormlet.app
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here

# Backend
PORT=3001
MONGODB_URI=mongodb://localhost:27017/dormlet
JWT_SECRET=your_jwt_secret_here
```

## Build Commands

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

## Deployment Type

The application will be deployed as a static website using the Next.js static export.
