# 🚀 QUICK START GUIDE

## Everything is Ready! Just Open and Test

### ✅ Current Status
- **Backend**: ✅ Running at http://localhost:3001/api
- **Frontend**: ✅ Running at http://localhost:3000
- **Database**: ✅ PostgreSQL with 6 test users seeded

---

## 🎯 Test in 60 Seconds

### 1️⃣ Open Frontend (5 seconds)
```
Open your browser: http://localhost:3000
```

### 2️⃣ Quick Login (5 seconds)
- You'll see 6 colorful user cards
- Click **"Nick Fury"** (Admin - Red badge)
- Instantly logged in!

### 3️⃣ Test Admin Powers (20 seconds)
- Dashboard shows your full permissions
- Click **"Browse Restaurants"**
- Should see **4 restaurants** (2 India + 2 America)
- Admin sees ALL countries! ✅

### 4️⃣ Create an Order (15 seconds)
- Click any restaurant (e.g., "Taj Mahal Restaurant")
- See menu items
- Click "Add to Cart" on a few items
- Scroll down
- Click **"Place Order"**
- ✅ Order created!

### 5️⃣ Test Cancel Permission (10 seconds)
- Redirected to Orders page
- See your order
- Click **"Cancel Order"**
- ✅ Success! (Admin can cancel)

### 6️⃣ Test Member Restrictions (15 seconds)
- Click **"Logout"** (top-right)
- Click **"Thanos"** (Member - Green badge)
- Go to **"Browse Restaurants"**
- Should see only **2 restaurants** (India only)
- Create an order (follow step 4)
- Go to **"My Orders"**
- ❌ **NO** Cancel button! (Members can't cancel)
- ✅ RBAC working perfectly!

---

## 🧪 Full Test Scenarios

### Scenario 1: Country-Based Filtering (2 minutes)

**Test India Manager:**
1. Logout → Login as **"Captain Marvel"** (Manager, India)
2. Browse Restaurants → See 2 Indian restaurants only
3. Info: "You're viewing restaurants available in INDIA"

**Test America Manager:**
1. Logout → Login as **"Captain America"** (Manager, America)
2. Browse Restaurants → See 2 American restaurants only
3. Info: "You're viewing restaurants available in AMERICA"

**Test Admin:**
1. Logout → Login as **"Nick Fury"** (Admin)
2. Browse Restaurants → See all 4 restaurants
3. Info: "As an Admin, you can see all restaurants from all countries"

✅ **Result**: Country filtering works!

---

### Scenario 2: Cancel Order RBAC (3 minutes)

**Member Cannot Cancel:**
1. Login as **"Thor"** (Member, India)
2. Create an order
3. Go to Orders
4. ❌ No "Cancel Order" button
5. See warning: "You don't have permission to cancel orders"

**Manager Can Cancel:**
1. Logout → Login as **"Captain Marvel"** (Manager, India)
2. Go to Orders (or create one)
3. ✅ See "Cancel Order" button
4. Click → Confirms cancellation
5. Order status → CANCELLED (red badge)

**Admin Can Cancel:**
1. Logout → Login as **"Nick Fury"** (Admin)
2. Go to Orders
3. See ALL orders (from all users and countries)
4. ✅ Can cancel any order

✅ **Result**: RBAC permissions enforced correctly!

---

## 👥 All Test Users

| Quick Click | Name | Role | Country | What They See |
|-------------|------|------|---------|---------------|
| **Nick Fury** | Nick Fury | ADMIN | India | All 4 restaurants, can cancel |
| **Captain Marvel** | Captain Marvel | MANAGER | India | 2 Indian restaurants, can cancel |
| **Captain America** | Captain America | MANAGER | America | 2 American restaurants, can cancel |
| **Thanos** | Thanos | MEMBER | India | 2 Indian restaurants, NO cancel |
| **Thor** | Thor | MEMBER | India | 2 Indian restaurants, NO cancel |
| **Travis** | Travis | MEMBER | America | 2 American restaurants, NO cancel |

**Password for all**: `Password123!` (already pre-filled in quick-login)

---

## 📊 What to Expect

### Login Page
![Login Features]
- 6 user cards with role badges
- Role colors: Red=Admin, Yellow=Manager, Green=Member
- One-click login buttons
- Or manual email/password form

### Dashboard
![Dashboard Features]
- Welcome message with your name
- User details (email, role, country, ID)
- 2 navigation cards (Restaurants, Orders)
- Permissions checklist with checkmarks/X marks
- Logout button

### Restaurants Page
![Restaurants Features]
- Info banner showing country access
- Restaurant count
- Restaurant cards with country badges
- Click restaurant → View menu
- Menu items with prices and categories
- Add to cart (+/- buttons)
- Cart summary (top-right)
- Order summary section
- "Place Order" button

### Orders Page
![Orders Features]
- Info banner showing your access level
- Order cards with:
  - Order number and status badge
  - Restaurant details
  - Order items list
  - Total amount
  - User information
  - Timestamps
  - **"Cancel Order" button** (if permitted)
- Warning if you're a Member
- Empty state if no orders

---

## 🎨 Visual Indicators

### Role Badges
- 🔴 **ADMIN** - Red badge - Full access
- 🟡 **MANAGER** - Yellow badge - Cancel + Country filter
- 🟢 **MEMBER** - Green badge - View & order only

### Status Badges
- 🟡 **PENDING** - Yellow - Can be cancelled
- 🔵 **CONFIRMED** - Blue - In progress
- 🟢 **DELIVERED** - Green - Completed
- 🔴 **CANCELLED** - Red - Cancelled

### Permissions Checklist
- ✅ Green checkmark - You have this permission
- ❌ Red X - You don't have this permission
- ⚠️ Yellow warning - Limited access

---

## 🔍 Things to Look For

### Country Filtering Working:
- [ ] Admin sees 4 restaurants
- [ ] India users see 2 restaurants (Taj Mahal, Mumbai Spice)
- [ ] America users see 2 restaurants (American Diner, NY Pizza)
- [ ] Info banners show correct country

### RBAC Working:
- [ ] Members don't see "Cancel Order" button
- [ ] Managers see "Cancel Order" button
- [ ] Admin sees "Cancel Order" button
- [ ] Dashboard permissions checklist accurate
- [ ] Warning shown to Members about cancel

### Order Flow Working:
- [ ] Can add items to cart
- [ ] Cart counter updates
- [ ] Order summary shows correct total
- [ ] "Place Order" creates order
- [ ] Redirects to Orders page
- [ ] Order appears in list immediately

### Authentication Working:
- [ ] Quick-login works
- [ ] Manual login works
- [ ] Logout clears session
- [ ] Protected pages redirect if not logged in
- [ ] User info persists on refresh

---

## 🐛 If Something Doesn't Work

### Frontend Not Loading?
```powershell
cd frontend
npm run dev
# Then open: http://localhost:3000
```

### Backend Not Responding?
```powershell
cd backend
npm run start:dev
# Then check: http://localhost:3001/api
```

### Login Not Working?
- Check browser console (F12)
- Verify backend is running
- Try: `localStorage.clear()` in console
- Refresh page

### Can't See Restaurants?
- Verify you're logged in
- Check which user you are (role/country)
- Members/Managers only see their country

### Orders Not Showing?
- Create an order first
- Login as different user (Members see own, Admin sees all)
- Check country (India vs America users)

---

## 📚 More Information

- **Full Documentation**: `COMPLETE_PROJECT_README.md`
- **Step-by-Step Testing**: `TESTING_GUIDE.md`
- **API Testing**: `API_TESTING_GUIDE.md`
- **Project Status**: `PROJECT_COMPLETION_SUMMARY.md`

---

## 🎯 Success Checklist

After testing, you should have verified:

- ✅ All 6 users can login
- ✅ Quick-login buttons work
- ✅ Admin sees all restaurants (4)
- ✅ Managers see only their country (2)
- ✅ Members see only their country (2)
- ✅ Can browse menus
- ✅ Can add items to cart
- ✅ Can place orders
- ✅ Members CANNOT cancel orders
- ✅ Managers CAN cancel orders
- ✅ Admin CAN cancel orders
- ✅ Dashboard shows correct permissions
- ✅ Country filtering works
- ✅ Logout works

If all items checked → **🎉 Application fully functional!**

---

## 🚀 Ready to Start?

**Just click here**: [http://localhost:3000](http://localhost:3000)

**Click any user card and start testing!**

---

**Built with ❤️ - Enjoy testing the RBAC system!**
