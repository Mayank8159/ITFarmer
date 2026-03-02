# Test Credentials

## Admin Account

Use these credentials to login as an admin and access the `/admin` dashboard:

**Email:** `admin@itfarm.io`  
**Password:** `AdminSecure123!`  
**Access Level:** Admin (requires toggle in login page)

### How to Login as Admin

1. Go to `/login` page
2. Click the "Admin" button (red button with shield icon)
3. Enter the email and password above
4. Click "Establish Connection"
5. You'll be redirected to `/admin` dashboard

## Consumer Account (For Testing)

You can also register new consumer accounts:

1. Go to `/login` page
2. Keep "Consumer" button selected (blue button)
3. Click "Request Register Protocol" to switch to registration
4. Fill in: Name, Email, Password
5. Click "Confirm Identity"
6. Login with those credentials to access consumer features

## Features by Role

### Admin Access
- View all inquiries from clients
- View registered users/operators
- Real-time notifications for new inquiries
- Broadcast system updates to consumers
- Live WebSocket connection for notifications

### Consumer Access
- Submit service inquiries
- View system updates and announcements
- View IT Farm information

## Protected Routes

- `/admin` - **Admin only** (redirects to login if not authenticated as admin)
- `/services` - Public (no auth required)
- `/posts` - Public (no auth required)
- `/login` - Public (auth page)

## Notes

- The test admin account is **auto-created** when the backend starts
- Only users with `is_admin: true` flag can access `/admin`
- Passwords are securely hashed with bcrypt
- Admin credentials are printed in backend console on startup
- All credentials are case-sensitive
