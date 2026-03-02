# IT FARM Frontend

Next.js 16 frontend for IT FARM Global Delivery Network.

## Features

- 🎨 Modern UI with Tailwind CSS v4 + Framer Motion
- 🔐 JWT Authentication (login/register)
- 💬 ORBIT AI Chatbot interface
- 👥 Admin Dashboard with real-time updates
- 📝 Service inquiry forms
- 🔔 WebSocket notifications
- 📱 Fully responsive design

## Tech Stack

- Next.js 16.1.4 (App Router)
- React 19.2.3
- TypeScript (strict mode)
- Tailwind CSS v4
- Framer Motion 12
- Lenis smooth scroll

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── login/            # Auth pages
│   ├── admin/            # Admin dashboard
│   ├── services/         # Service inquiry
│   └── posts/            # Updates/blog
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Footer.tsx
│   └── orbit/            # Chat widget
└── context/
    ├── AuthContext.tsx   # JWT auth state
    └── BackendContext.tsx # Backend health check
```

## Key Components

### ORBIT Chat
AI chatbot with terminal-style UI and persistent chat history.

### Admin Dashboard
- User management
- Inquiry tracking
- Real-time notifications via WebSocket
- Broadcast updates

### Backend Context
Global backend availability check that prevents app usage when backend is offline.

## Deployment

### Vercel (Recommended)

1. Connect GitHub repo to Vercel
2. Set environment variable: `NEXT_PUBLIC_API_URL`
3. Deploy

### Docker

```bash
docker build -t itfarm-frontend .
docker run -p 3000:3000 itfarm-frontend
```

## Notes

- Uses webpack mode (`next dev --webpack`) to avoid Turbopack issues
- Backend must be running for full functionality
- WebSocket connection required for notifications

## License

MIT
