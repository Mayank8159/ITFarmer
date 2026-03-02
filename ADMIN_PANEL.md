# Admin Panel - Complete Feature Overview

## 🔒 Access Control
- **Protected Route:** `/admin` only accessible to admin users
- **Authentication:** Requires `isAdmin: true` flag from backend
- **Redirect:** Non-admin users automatically redirected to login

---

## 📊 Dashboard Stats (Header)

Real-time statistics automatically updated from backend:

| Metric | Source | Updates |
|--------|--------|---------|
| **Total Inquiries** | Count from `/inquiry` endpoint | Refreshes on load and manual refresh |
| **Live Alerts** | WebSocket notifications | Real-time as consumers submit inquiries |
| **Operators** | Count from `/users` endpoint | Refreshes on load and manual refresh |

---

## 🎯 Three Main Tabs

### Tab 1: **New Broadcast** (Post Updates)

**Purpose:** Create and distribute system updates to all consumers

**Connected Endpoint:** `POST /updates`

**Form Fields:**
- **Category** (dropdown)
  - Project Deployment
  - Personnel Update
  - System Patch
- **Title** (required, text input)
- **Description** (required, textarea)

**Data Sent to Backend:**
```json
{
  "title": "Update Title",
  "description": "Full description text",
  "category": "project|team|update",
  "tags": ["category-name"]
}
```

**Real-Time Features:**
- ✅ Success confirmation message (auto-hides after 3 seconds)
- ✅ Error display with backend message
- ✅ Loading state while broadcasting
- ✅ Form validation (title and description required)
- ✅ Updates immediately visible on `/posts` page

**Consumer Experience:**
- Updates appear on `/posts` page with filters
- Category-based filtering available
- All consumers see broadcasts in real-time

---

### Tab 2: **Manage Feed** (View Inquiries)

**Purpose:** Monitor and manage all consumer service requests

**Connected Endpoint:** `GET /inquiry`

**Data Displayed:**
- **Consumer Name**
- **Email Address**
- **Company** (if provided)
- **Service Type** (Software, AI/ML, SaaS, Security, Design, Other)
- **Scheduled Date & Time**
- **Budget Intent** (if provided)
- **Detailed Message/Brief**

**Search & Filter Controls:**
1. **Text Search Box**
   - Searches across: name, email, company, message
   - Case-insensitive
   - Real-time filtering

2. **Service Type Filter**
   - Filters by selected service category
   - Auto-generated from available inquiries
   - "All" option to see all inquiries

**Real-Time Features:**
- ✅ Live inquiry count in dashboard stats
- ✅ WebSocket notifications for new inquiries
- ✅ Auto-refresh button to reload data
- ✅ Error display if backend unavailable

**UI Elements Per Inquiry:**
```
┌─ Consumer Name (+ Email)
│  Company Info (if available)
├─ [Service Type Badge] → Date | Time
├─ Full Message/Brief
└─ Budget Intent (if available)
```

---

### Tab 3: **Operator List** (User Management)

**Purpose:** View all registered operators and administrators

**Connected Endpoints:**
- `GET /users` (requires auth token)
- Real-time notifications via WebSocket

**Operator Information Displayed:**
- **Full Name or Username**
- **Email Address**
- **Role** (admin, user, operator)
- **Join Date**

**Live Notification Feed:**
- Real-time alerts for new inquiries
- **Notification Details:**
  - Notification title
  - Consumer name and service requested
  - Timestamp
  - New inquiry badge

**WebSocket Connection:**
- Auto-connects to `WS /notifications/admin`
- Receives: `{ type: "new_inquiry", data: {...} }`
- Maintains keep-alive ping every 20 seconds
- Auto-reconnects if disconnected

---

## 🔄 Real-Time Features

### WebSocket Notifications
```javascript
// Admin receives when consumer submits inquiry
{
  type: "new_inquiry",
  data: {
    id: "...",
    name: "Consumer Name",
    email: "...",
    service: "Software",
    message: "..."
  }
}
```

### Live Updates
- New inquiries appear instantly in **Manage Feed** tab
- Notification appears in **Operator List** tab
- Stats update automatically
- No page refresh required

---

## 🎨 UI/UX Design

### Responsive Layout
- **Desktop:** 3-column sidebar navigation + content (max-width: 6xl)
- **Tablet/Mobile:** Stacked navigation above content
- **Smooth animations:** Tab transitions with Framer Motion

### Visual Feedback
- ✅ **Success states** - Green success banner (auto-hide 3s)
- ⚠️ **Error states** - Red error banner with message
- ⏳ **Loading states** - Spinner animation
- 🔄 **Active indicator** - Blue highlight + checkmark icon

### Theme
- Dark mode (matching app design)
- Blue accent color for interactions
- White/zinc hierarchy for secondary info
- Monospace font for technical data

---

## 🔌 API Integration

### Base URL Configuration
```env
NEXT_PUBLIC_API_URL=http://localhost:8000  # Dev
NEXT_PUBLIC_API_URL=https://api.itfarm.io    # Prod
```

### Endpoints Used
| Action | Method | Endpoint | Auth Required |
|--------|--------|----------|---------------|
| View Inquiries | GET | `/inquiry` | No |
| Send Update | POST | `/updates` | Yes (Bearer Token) |
| View Operators | GET | `/users` | Yes (Bearer Token) |
| Notifications | WS | `/notifications/admin` | No |

### Authentication
```javascript
// Token automatically retrieved from localStorage
const token = localStorage.getItem("token");
// Sent in Authorization header for protected endpoints
headers: { "Authorization": `Bearer ${token}` }
```

---

## 📋 Admin Workflow

### Creating an Update (5 steps)
1. Navigate to `/admin` dashboard
2. Stay on "New Broadcast" tab
3. Select update category
4. Enter descriptive title
5. Write detailed description
6. Click "Transmit Update"

**Result:** 
- Update saved to database
- Instantly visible on `/posts` page
- All consumers can see and filter

### Reviewing Inquiries (4 steps)
1. Click "Manage Feed" tab
2. Use search to find specific inquiries
3. Use filter to narrow by service type
4. Click inquiry card to view full details

**Result:**
- See all consumer needs
- Prioritize by service type or date
- Plan resource allocation

### Monitoring Operators (3 steps)
1. Click "Operator List" tab
2. View all registered operators
3. Watch live notification feed for new inquiries

**Result:**
- Team visibility
- Real-time activity monitoring
- Quick response to new requests

---

## 🚨 Error Handling

| Scenario | Behavior |
|----------|----------|
| Backend unavailable | Display error message, keep UI functional |
| Auth token expired | Show "Login required" message |
| Network error | Display error banner with retry option |
| Invalid form data | Show validation errors, disable submit |
| Update already exists | Display duplicate warning (backend) |

---

## 📱 Mobile Responsiveness

- ✅ Sidebar collapses on mobile
- ✅ Search/filter controls responsive
- ✅ Inquiry cards stack vertically
- ✅ Touch-friendly button sizes
- ✅ Notification feed scrollable

---

## 🔐 Security Features

- ✅ Admin-only route protection
- ✅ JWT token validation
- ✅ CORS-enabled endpoints
- ✅ Secure password hashing (bcrypt)
- ✅ No sensitive data in localStorage (only token)

---

## 🎯 Use Cases

### Use Case 1: Daily Status Updates
1. Admin posts project milestone update
2. Consumers see it on `/posts` page
3. Builds company awareness

### Use Case 2: Managing Service Requests
1. Consumer submits inquiry on `/services`
2. Admin sees in "Manage Feed" tab
3. Admin can plan  resources and respond
4. Real-time notification alerts admin

### Use Case 3: Team Communication
1. Admin posts personnel update
2. All users see on `/posts`
3. Team stays informed

---

## 📊 Data Flow Diagram

```
Consumer Actions
├─ Submit Inquiry (/services)
│  └─ POST /inquiry → Visible in Admin "Manage Feed"
│                   → WebSocket notification
│
├─ View Updates (/posts)
│  └─ GET /updates (filtered by category)
│     ← Admin broadcasts from "New Broadcast" tab
│
└─ See Team Info
   └─ Displayed on home page + About

Admin Actions
├─ Post Broadcast
│  ├─ POST /updates
│  └─ Results visible on /posts page instantly
│
├─ Review Inquiries
│  ├─ GET /inquiry (auto-loaded)
│  ├─ Search/Filter in UI
│  └─ WebSocket alerts for new inquiries
│
└─ Monitor Team
   ├─ GET /users
   └─ See real-time notifications
```

---

## ✅ Testing Checklist

- [ ] Login as admin (`admin@itfarm.io` / `AdminSecure123!`)
- [ ] Verify redirect to `/admin` dashboard
- [ ] Load initial data (inquiries, users, notifications)
- [ ] Click "Refresh Data" button
- [ ] Post a new broadcast update
- [ ] Search for inquiries
- [ ] Filter inquiries by service type
- [ ] View live notification feed
- [ ] Check `/posts` page for new update
- [ ] Test mobile responsive layout
- [ ] Verify WebSocket connection (browser DevTools)

---

## 🚀 Deployment Notes

1. **Backend must be running** for admin panel to load data
2. **Environment variable required:** `NEXT_PUBLIC_API_URL`
3. **WebSocket requires SSL** in production (wss://)
4. **Auth tokens expire** after 24 hours (see backend config)
5. **Database collection:** `updates` stores all broadcasts

---

**Last Updated:** March 2, 2026  
**Status:** ✅ Fully Functional - No Dummy Data
