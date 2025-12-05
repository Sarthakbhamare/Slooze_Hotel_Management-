# Food Ordering App with Role-Based Access Control (RBAC)

A full-stack food ordering application with comprehensive Role-Based Access Control and country-based data segregation.

## 🎯 Features

### Role-Based Access Control
- **Admin**: Full access to all restaurants, orders, and management features across all countries
- **Manager**: Manage restaurants and menus in their country, view and update orders
- **Member**: Browse restaurants, create orders, place orders in their country

### Key Functionalities
1. **View Restaurants** - All roles can view restaurants (filtered by country for Managers/Members)
2. **Create Orders** - All roles can add items to cart and create orders
3. **Place Orders** - All roles can checkout and place orders with payment methods
4. **Cancel Orders** - Admin and Manager can cancel orders
5. **Update Payment Methods** - All authenticated users can manage payment methods

### Additional Features
- Country-based data segregation (India & America)
- Order lifecycle management (PENDING → CONFIRMED → DELIVERED)
- Restaurant and menu management for Admins/Managers
- Payment method management
- Real-time order status updates

## 🏗️ Tech Stack

### Backend
- **Framework**: NestJS 11
- **Database**: PostgreSQL (Prisma Cloud)
- **ORM**: Prisma 7.1.0
- **Authentication**: JWT with Passport
- **Password Hashing**: bcrypt

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional) - [Download here](https://git-scm.com/)

## 🚀 Quick Start Guide for Beginners

### Step 1: Get the Project Files

1. Download the project folder or clone from repository
2. Extract if downloaded as ZIP
3. Open your terminal/command prompt

### Step 2: Setup Backend

```bash
# Navigate to the backend folder
cd "path/to/Slooz Assignment/backend"

# For example, if on Windows:
cd "f:\Slooz Assignment\backend"

# Install all required packages (this may take a few minutes)
# This automatically sets up Prisma and the database
npm install

# Start the backend server
npm run start:dev
```

✅ **Backend is ready when you see**: `Application is running on: http://localhost:3001/api`

**Keep this terminal window open!** The backend must keep running.

**Note**: First time running may take longer as it sets up the database. If you see any Prisma errors, run: `npx prisma generate` then restart.

### Step 3: Setup Frontend (Open a NEW Terminal Window)

```bash
# Navigate to the frontend folder (from project root)
cd "f:\Slooz Assignment\frontend"

# Install all required packages
npm install

# Start the frontend development server
npm run dev
```

✅ **Frontend is ready when you see**: `Ready in XXXms`

**Keep this terminal window open too!**

### Step 4: Open the Application

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: **http://localhost:3000**
3. You should see a login page!

## 👥 Test Users (Login Credentials)

All users have the same password: **Password123!**

Click on any user card to quick login, or type credentials manually:

| Name | Email | Password | Role | Country | What They Can Do |
|------|-------|----------|------|---------|------------------|
| Nick Fury | nick.fury@shield.com | Password123! | ADMIN | All | Everything - manage all restaurants and orders |
| Captain Marvel | captain.marvel@avengers.com | Password123! | MANAGER | INDIA | Manage India restaurants, view India orders |
| Captain America | steve.rogers@avengers.com | Password123! | MANAGER | AMERICA | Manage America restaurants, view America orders |
| Thanos | thanos@shield.com | Password123! | MEMBER | INDIA | Browse and order from India restaurants |
| Thor | thor@shield.com | Password123! | MEMBER | INDIA | Browse and order from India restaurants |
| Travis | travis@shield.com | Password123! | MEMBER | AMERICA | Browse and order from America restaurants |

## 🎮 How to Test the Application

### Test as a Member (e.g., Thanos)

1. **Login**: Click on "Thanos" card or enter `thanos@shield.com`
2. **Browse Restaurants**: Click "Restaurants" - you'll see only Indian restaurants
   - Spice Garden
   - Curry House
3. **Add to Cart**: 
   - Click on a restaurant
   - Click "Add to Cart" on menu items (e.g., Butter Chicken ₹350)
4. **Checkout**:
   - View your cart (items appear on right side)
   - Select payment method from dropdown (CREDIT_CARD - Default)
   - Click "Checkout"
   - See confirmation message!
5. **View Orders**: Click "Orders" to see your order with status "PENDING"

### Test as a Manager (e.g., Captain Marvel)

1. **Login**: Click "Captain Marvel" or enter `captain.marvel@avengers.com`
2. **View Orders**: Click "Orders"
   - See all orders from India
   - Update order status using dropdown (Pending → Confirmed → Delivered)
3. **Manage Restaurants**: Click "Manage"
   - Add new restaurant (name, description, select India)
   - Add menu items (name, description, price, category)
   - Delete restaurants or menu items

### Test as Admin (Nick Fury)

1. **Login**: Click "Nick Fury" or enter `nick.fury@shield.com`
2. **See Everything**:
   - View all restaurants from both countries
   - Manage all orders
   - Create restaurants in any country
   - Full access to all features

### Test Country Segregation

1. Login as **Thanos** (India) → See 2 India restaurants
2. Logout and login as **Travis** (America) → See 2 America restaurants
3. Login as **Nick Fury** (Admin) → See all 4 restaurants!

## 📁 Project Structure

```
Slooz Assignment/
├── README.md                    # This file - complete guide
├── API_DOCUMENTATION.md         # All API endpoints
├── ARCHITECTURE.md              # System design and architecture
│
├── backend/                     # Backend application
│   ├── src/
│   │   ├── auth/               # Login, JWT authentication
│   │   ├── restaurants/        # Restaurant & menu CRUD
│   │   ├── orders/             # Order management
│   │   ├── payment-methods/    # Payment handling
│   │   └── prisma/             # Database service
│   ├── prisma/
│   │   ├── schema.prisma       # Database structure
│   │   └── seed.ts             # Test data
│   ├── package.json
│   └── .env (auto-generated)
│
├── frontend/                    # Frontend application
│   ├── app/
│   │   ├── page.tsx            # Login page
│   │   ├── dashboard/          # Main app pages
│   │   │   ├── page.tsx        # Dashboard home
│   │   │   ├── restaurants/    # Browse & order
│   │   │   ├── orders/         # Order history
│   │   │   └── manage/         # Admin/Manager tools
│   │   └── layout.tsx          # App layout
│   ├── contexts/
│   │   └── AuthContext.tsx     # User authentication state
│   ├── lib/
│   │   └── api.ts              # API calls to backend
│   ├── package.json
│   └── .env.local
│
└── postman_collection.json      # API testing collection
```

## 🔑 API Endpoints Overview

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Create new user
- `GET /api/auth/profile` - Get logged-in user info

### Restaurants
- `GET /api/restaurants` - List restaurants (filtered by country)
- `GET /api/restaurants/:id/menu` - Get menu items
- `POST /api/restaurants` - Create restaurant (Admin/Manager only)
- `DELETE /api/restaurants/:id` - Delete restaurant

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `PATCH /api/orders/:id/status` - Update order status (Manager/Admin)
- `PATCH /api/orders/:id/cancel` - Cancel order (Manager/Admin)

### Payment Methods
- `GET /api/payment-methods` - List payment methods
- `POST /api/payment-methods` - Add payment method

📄 **For complete API documentation, see `API_DOCUMENTATION.md`**

## 🗄️ Database Schema

### Tables
- **users** - User accounts with role and country
- **restaurants** - Restaurant details
- **menu_items** - Food items with prices
- **orders** - Customer orders with status
- **order_items** - Items in each order
- **payment_methods** - User payment cards

### Sample Data (Auto-created by seed)
- 6 test users (2 admins, 2 managers, 2 members)
- 4 restaurants (2 in India, 2 in America)
- 16 menu items
- 6 payment methods (one per user)

## 🛠️ Development Tools

### Prisma Studio - View Database Visually

```bash
# Open in new terminal
cd backend
npx prisma studio --port 51212
```

Then open: http://localhost:51212

You can see all tables, data, edit records, etc.

### View Application Logs

- **Backend logs**: Check the terminal where `npm run start:dev` is running
- **Frontend logs**: Check browser console (F12 → Console tab)

## 🐛 Troubleshooting

### ❌ "Port already in use" error

```bash
# Windows - Kill all Node processes
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Then restart backend and frontend
```

### ❌ Backend won't start

```bash
cd backend
rm -rf node_modules
npm install
npm run start:dev
```

If still having issues:
```bash
npx prisma generate
npx prisma db seed
npm run start:dev
```

### ❌ Frontend shows errors

```bash
cd frontend
npm install
npm run dev
```

### ❌ No payment methods in dropdown

```bash
cd backend
npx prisma db seed
```

### ❌ Can't see restaurants

1. Check backend is running (http://localhost:3001/api should work)
2. Check browser console for errors (F12)
3. Try re-seeding database

## 📊 Access Control Matrix

| Function | Admin | Manager | Member |
|----------|-------|---------|--------|
| View All Restaurants | ✅ All Countries | ✅ Own Country | ✅ Own Country |
| Create Order | ✅ | ✅ | ✅ |
| Place Order | ✅ | ✅ | ✅ |
| Cancel Order | ✅ | ✅ | ❌ |
| Update Order Status | ✅ | ✅ | ❌ |
| Create Restaurant | ✅ Any Country | ✅ Own Country | ❌ |
| Delete Restaurant | ✅ | ✅ | ❌ |
| Manage Menu Items | ✅ | ✅ | ❌ |
| Update Payment Methods | ✅ | ✅ | ✅ |

## 🎥 Demo Workflow

### Complete User Journey

1. **Login** as Thanos (Member, India)
2. **Browse** Restaurants → See "Spice Garden" and "Curry House"
3. **Add Items**:
   - Butter Chicken (₹350)
   - Paneer Tikka (₹280)
   - Garlic Naan (₹60)
4. **View Cart** → Total: ₹690
5. **Select Payment** → "CREDIT_CARD (Default)"
6. **Checkout** → Success! Order placed
7. **View Orders** → Status: 🟡 PENDING
8. **Logout**

9. **Login** as Captain Marvel (Manager, India)
10. **View Orders** → See Thanos's order
11. **Update Status** → Change to "🔵 CONFIRMED"
12. **Update Status** → Change to "🟢 DELIVERED"
13. **Go to Manage** page
14. **Add Restaurant**:
    - Name: "Mumbai Delights"
    - Description: "Authentic street food"
    - Country: India
15. **Add Menu Item**:
    - Name: "Vada Pav"
    - Price: ₹40
    - Category: "Snacks"

## 📦 Technology Versions

- Node.js: 18+
- NestJS: 11.0.1
- Next.js: 14.0.0
- Prisma: 7.1.0
- TypeScript: 5.x
- React: 18.x

## 🔐 Security Features

✅ Password hashing with bcrypt (10 salt rounds)  
✅ JWT token authentication  
✅ Role-based access guards  
✅ Country-based data filtering  
✅ Input validation on all endpoints  
✅ Protected routes on frontend  

## 📞 Support & Issues

### Common Issues

**Q: Can't install packages (npm install fails)**  
A: Make sure you have Node.js v18+ installed. Download from nodejs.org

**Q: Database connection error**  
A: The database is already configured on Prisma Cloud. Connection string is in `backend/prisma/schema.prisma`

**Q: Frontend shows blank page**  
A: Check both terminals are running. Backend must be on 3001, frontend on 3000

**Q: Login not working**  
A: Make sure you ran `npx prisma db seed` in backend folder

## 📤 Submission Checklist

For your assignment submission, include:

✅ **Code Repository**
- GitHub/GitLab link with all code
- Or ZIP file with complete project

✅ **Documentation** (all included in this repo)
- README.md (this file)
- API_DOCUMENTATION.md (API endpoints)
- ARCHITECTURE.md (system design)
- Postman collection (API testing)

✅ **Demo Video**
- Screen recording showing:
  - Login as different roles
  - Country-based filtering
  - Creating orders
  - Managing restaurants
  - Order status updates

✅ **Datasets**
- Seed data is in `backend/prisma/seed.ts`
- Includes 6 users, 4 restaurants, 16 menu items

## 🎓 For Complete Beginners

### Never Used Terminal Before?

**Windows:**
1. Press `Windows Key + R`
2. Type `powershell` and press Enter
3. You now have a terminal!

**Mac:**
1. Press `Cmd + Space`
2. Type `terminal` and press Enter

**Linux:**
1. Press `Ctrl + Alt + T`

### Terminal Commands Explained

- `cd` = Change Directory (move to a folder)
- `npm install` = Download and install packages
- `npm run` = Run a script
- Keep terminal open = Process keeps running

### Need Help?

1. Read error messages carefully - they often tell you what's wrong
2. Make sure you're in the correct folder (`cd` to the right place)
3. Check Node.js is installed: type `node --version` in terminal
4. Try restarting: Close terminals, reopen, run commands again

---

## 📜 License

This project is for educational/assignment purposes.

---

**Built with ❤️ using NestJS, Next.js, Prisma, and TypeScript**

**Happy Coding! 🚀**
