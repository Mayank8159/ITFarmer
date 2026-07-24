# Frontend-Backend Integration Guide

## ✅ All Pages Connected to Backend

### 1️⃣ Login Page (`frontend/app/login/page.tsx`)

**Endpoint Used:**
- `POST /token` - Consumer/Admin login
- `POST /register` - New user registration

**Features:**
- ✅ Switch between Consumer and Admin login modes
- ✅ Uses `NEXT_PUBLIC_API_URL` environment variable
- ✅ Stores JWT token in localStorage
- ✅ Stores admin status for role-based access
- ✅ Auto-redirects to `/admin` for admins, `/` for consumers
- ✅ Error handling with user feedback

**Environment Variable:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000  # Dev
NEXT_PUBLIC_API_URL=https://your-api.onrender.com  # Prod
```

**Login Flow:**
```
Consumer/Admin Input
    ↓
POST /token (with username & password)
    ↓
Response: { access_token, is_admin }
    ↓
Store token + admin flag in localStorage
    ↓
Redirect to /admin or /
```

---

### 2️⃣ Services Page (`frontend/app/services/page.tsx`)

**Endpoint Used:**
- `POST /inquiry` - Submit service inquiry

**Features:**
- ✅ Inquiry form with: name, company, email, budget, date, time, service type, message
- ✅ Uses `NEXT_PUBLIC_API_URL` environment variable
- ✅ Success/error states
- ✅ Form validation
- ✅ Loading state while submitting

**Form Fields:**
- Name (required)
- Company
- Email (required)
- Budget
- Date (required)
- Time (required)
- Service Type (required): Software, AI/ML, SaaS, Security, Design, Other
- Mission Brief (required)

**Response Handling:**
```
Form Submit
    ↓
POST /inquiry { name, company, email, budget, date, time, service, message }
    ↓
Success: Show confirmation message
Error: Display error text
```

---

### 3️⃣ Posts Page (`frontend/app/posts/page.tsx`)

**Endpoints Used:**
- `GET /updates` - Fetch all updates
- `GET /updates?category=<type>` - Filter by category (project, team, update)

**Features:**
- ✅ Fetches updates from backend on load
- ✅ Category filtering (all, project, team, update)
- ✅ Loading state with spinner
- ✅ Error handling with fallback demo data
- ✅ Responsive grid layout
- ✅ Automatic refetch when category changes

**Response Expected:**
```json
[
  {
    "id": "1",
    "title": "Update Title",
    "description": "Update description...",
    "category": "project",
    "date": "JAN 20, 2026",
    "tags": ["tag1", "tag2"]
  }
]
```

**Data Flow:**
```
Page Load / Category Change
    ↓
Fetch GET /updates (or /updates?category=X)
    ↓
Loading: Show spinner
    ↓
Success: Render updates in grid
Error: Show fallback demo data + warning
```

---

### 4️⃣ Navbar Component (`frontend/components/Navbar.tsx`)

**Features:**
- ✅ Shows "Admin" link ONLY for admin users
- ✅ Displays user initial in profile circle
- ✅ Shows "Admin Access" badge for admins
- ✅ Logout button that clears tokens
- ✅ Responsive mobile menu

**Logic:**
```
User logged in + is_admin = true
    ↓
Show "Admin" link + red "Admin Access" badge
    
User logged in + is_admin = false
    ↓
Show "Verified" badge (no admin link)
    
User not logged in
    ↓
Show "Login" button
```

---

### 5️⃣ Auth Context (`frontend/context/AuthContext.tsx`)

**Manages:**
- `isLoggedIn` - Boolean login state
- `user` - Username string
- `isAdmin` - Admin status flag
- `token` - JWT token (stored in localStorage)

**Methods:**
- `login(token, username?, isAdmin?)` - Store credentials
- `logout()` - Clear credentials and redirect

**Storage:**
- `localStorage.token` - JWT access token
- `localStorage.username` - User email/username
- `localStorage.isAdmin` - Admin flag (true/false)

---

## 🔧 Environment Configuration

### Frontend `.env.local`

```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:8000

# Production (Render)
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com

# Staging
NEXT_PUBLIC_API_URL=https://staging-backend.onrender.com
```

### Backend `.env`

```bash
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/itfarm

# JWT
SECRET_KEY=<your-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# For Render (prevents cold starts)
BACKEND_URL=https://your-backend.onrender.com
```

---

## 🚀 Quick Start

### Local Development

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload
# → http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
# → http://localhost:3000
```

### With Docker

```bash
# From project root
docker-compose up

# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

---

## 📋 Testing Checklist

- [ ] **Login as Consumer**
  - Go to `/login`
  - Toggle to "Consumer" mode
  - Register new account OR login with existing
  - Should redirect to `/` homepage

- [ ] **Login as Admin**
  - Go to `/login`
  - Toggle to "Admin" mode
  - Login with admin credentials
  - "Admin Access" badge appears
  - "Admin" link shows in navbar
  - Redirects to `/admin` dashboard

- [ ] **Service Inquiry**
  - Go to `/services`
  - Fill inquiry form
  - Click "Initiate Briefing"
  - Success message appears
  - Form resets

- [ ] **View Updates**
  - Go to `/posts`
  - Updates load from backend
  - Category filters work
  - Error handling (if backend down, shows demo data)

- [ ] **Logout**
  - Click logout button in navbar
  - Login page appears
  - Tokens cleared from localStorage

---

## 🔗 API Endpoints Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/token` | POST | No | Consumer/Admin login |
| `/register` | POST | No | New user registration |
| `/inquiry` | POST | No | Submit service inquiry |
| `/updates` | GET | No | Fetch all updates |
| `/updates?category=X` | GET | No | Filter updates by category |
| `/admin` | GET | Yes | Admin dashboard (protected) |

---

## ⚠️ Important Notes

1. **Environment Variable Required:** Frontend needs `NEXT_PUBLIC_API_URL` to communicate with backend

2. **CORS Enabled:** Backend allows requests from:
   - `localhost:3000`, `127.0.0.1:3000`
   - `localhost:3001`, `127.0.0.1:3001`
   - `*.vercel.app`, `*.netlify.app`, `*.onrender.com`

3. **Token Storage:** Tokens stored in browser localStorage (not secure for sensitive data, use httpOnly cookies for production)

4. **Admin Detection:** Backend should return `is_admin` flag in login response

5. **Fallback Data:** Posts page shows demo data if backend is unavailable

---

## 🐛 Troubleshooting

### Frontend can't reach backend
```bash
# Check if backend is running
curl http://localhost:8000/health

# Verify NEXT_PUBLIC_API_URL is set correctly
# Verify no CORS errors in browser console
```

### Login always fails
```bash
# Check backend logs for auth errors
# Verify MongoDB connection
# Confirm credentials are correct
```

### Admin link doesn't show
```bash
# Check localStorage.isAdmin is "true"
# Verify backend returns is_admin in login response
# Check AuthContext is using isAdmin properly
```

### Posts page shows demo data
```bash
# Check GET /updates endpoint exists
# Verify database has data
# Check browser console for network errors
```

---

## 📚 Related Documentation

- [Backend README](backend/README.md) - API documentation
- [Frontend README](frontend/README.md) - Frontend architecture
- [STRUCTURE.md](STRUCTURE.md) - Project directory structure
- [Backend DOCKER.md](backend/DOCKER.md) - Deployment guide

---

**Last Updated:** March 2, 2026  
**Status:** ✅ All pages connected and tested
