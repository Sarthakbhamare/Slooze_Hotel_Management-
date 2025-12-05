# Food Ordering Application - Full Stack RBAC System

A complete full-stack food ordering application demonstrating Role-Based Access Control (RBAC) with country-based data segregation.

## 🚀 Live Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Prisma Studio**: http://localhost:51212

## ✅ Completed Features

### Backend (NestJS)
✅ Role-Based Access Control with 3 roles (ADMIN, MANAGER, MEMBER)
✅ Country-based data segregation (INDIA, AMERICA)
✅ JWT Authentication with Passport
✅ Complete REST API with 4 modules
✅ PostgreSQL database via Prisma Postgres cloud
✅ Database seeding with 6 test users
✅ RBAC Guards and Decorators
✅ API testing scripts (PowerShell & HTTP Client)

### Frontend (Next.js)
✅ Login page with quick-login buttons
✅ Protected dashboard with role-based UI
✅ Restaurants page with country filtering
✅ Menu browsing and cart functionality
✅ Orders page with cancel permissions
✅ Authentication context with JWT storage
✅ Responsive design with Tailwind CSS

## 📋 Access Control Matrix

| Function | ADMIN | MANAGER | MEMBER |
|----------|-------|---------|--------|
| View Restaurants & Menu Items | ✓ (All countries) | ✓ (Own country) | ✓ (Own country) |
| Create Order (Add Items) | ✓ | ✓ | ✓ |
| Place Order (Checkout & Pay) | ✓ | ✓ | ✓ |
| Cancel Order | ✓ | ✓ | ✗ |
| Update Payment Method | ✓ | ✗ | ✗ |

## 👥 Test Users

All users have the same password: **Password123!**

| Name | Email | Role | Country | Access Level |
|------|-------|------|---------|--------------|
| Nick Fury | nick.fury@shield.com | ADMIN | INDIA | Full access, all countries |
| Captain Marvel | carol.danvers@shield.com | MANAGER | INDIA | Can cancel orders, India only |
| Captain America | steve.rogers@shield.com | MANAGER | AMERICA | Can cancel orders, America only |
| Thanos | thanos@shield.com | MEMBER | INDIA | View & order only, India |
| Thor | thor@shield.com | MEMBER | INDIA | View & order only, India |
| Travis | travis@shield.com | MEMBER | AMERICA | View & order only, America |

## 🏗️ Technology Stack

### Backend
- **Framework**: NestJS v11 (TypeScript)
- **Database**: PostgreSQL via Prisma Postgres cloud
- **ORM**: Prisma 7.1.0 with @prisma/adapter-pg
- **Authentication**: JWT with Passport, bcrypt
- **Validation**: class-validator, class-transformer
- **Port**: 3001 (API prefix: /api)

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React Context API
- **HTTP Client**: Fetch API
- **Port**: 3000

## 📁 Project Structure

```
f:\Slooz Assignment\
├── backend/
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── restaurants/       # Restaurants with country filtering
│   │   ├── orders/            # Orders with RBAC
│   │   ├── payment-methods/   # Admin-only payment methods
│   │   ├── common/
│   │   │   ├── guards/        # RolesGuard for RBAC
│   │   │   └── decorators/    # @Roles, @CurrentUser
│   │   └── prisma/            # Prisma service
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema (6 models)
│   │   ├── prisma.config.ts   # Database connection config
│   │   └── seed.ts            # Database seeder
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Login page with quick-login
│   │   ├── layout.tsx         # Root layout with AuthProvider
│   │   └── dashboard/
│   │       ├── page.tsx       # Dashboard with permissions
│   │       ├── restaurants/   # Browse & order
│   │       └── orders/        # Order history & cancel
│   ├── contexts/
│   │   └── AuthContext.tsx    # Authentication state
│   ├── lib/
│   │   └── api.ts             # API client
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── package.json
├── ARCHITECTURE.md
├── README.md
└── API_TESTING_GUIDE.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL connection (Prisma Postgres cloud already configured)

### 1. Install Dependencies

```powershell
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 2. Setup Backend Database

```powershell
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database with test data
npx prisma db seed
```

### 3. Start Backend Server

```powershell
cd backend
npm run start:dev
```

Backend will be available at: **http://localhost:3001/api**

### 4. Start Frontend (New Terminal)

```powershell
cd frontend
npm run dev
```

Frontend will be available at: **http://localhost:3000**

### 5. Test the Application

1. **Open Frontend**: Navigate to http://localhost:3000
2. **Quick Login**: Click any test user button (e.g., "Nick Fury" for Admin)
3. **Test Features**:
   - Browse restaurants (note country filtering)
   - View menu and add items to cart
   - Place an order
   - View orders page
   - Try to cancel an order (test RBAC permissions)

## 🧪 Testing RBAC Features

### Test Country-Based Filtering

1. **Login as Captain Marvel** (Manager, India):
   - Go to Restaurants → Should see only 2 Indian restaurants
   - Orders page → Should see only Indian orders

2. **Login as Captain America** (Manager, America):
   - Go to Restaurants → Should see only 2 American restaurants
   - Orders page → Should see only American orders

3. **Login as Nick Fury** (Admin):
   - Go to Restaurants → Should see all 4 restaurants (2 India + 2 America)
   - Orders page → Should see all orders

### Test Cancel Order Permissions

1. **Login as Thanos** (Member, India):
   - Create an order
   - Go to Orders page
   - Notice "Cancel Order" button is NOT available
   - See message: "You don't have permission to cancel orders"

2. **Login as Captain Marvel** (Manager, India):
   - Go to Orders page
   - Should see "Cancel Order" button on pending orders
   - Click to cancel → Should succeed

3. **Login as Nick Fury** (Admin):
   - Can cancel any order from any country

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get current user profile (requires JWT)

### Restaurants
- `GET /api/restaurants` - List restaurants (country-filtered)
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/:id/menu` - Get menu items

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - List orders (filtered by role & country)
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/cancel` - Cancel order (Admin/Manager only)

### Payment Methods (Admin Only)
- `GET /api/payment-methods` - List payment methods
- `POST /api/payment-methods` - Create payment method (Admin only)
- `PATCH /api/payment-methods/:id` - Update payment method (Admin only)

## 🗄️ Database Schema

### Models
- **User** - Authentication & authorization (role, country)
- **Restaurant** - Restaurant details with country
- **MenuItem** - Food items linked to restaurants
- **Order** - Customer orders with status
- **OrderItem** - Line items for orders
- **PaymentMethod** - Payment options (Admin managed)

### Enums
- **Role**: ADMIN, MANAGER, MEMBER
- **Country**: INDIA, AMERICA
- **OrderStatus**: PENDING, CONFIRMED, DELIVERED, CANCELLED

## 🎨 Frontend Features

### Pages Implemented
1. **Login Page** (`/`)
   - Email/password form
   - 6 quick-login buttons for test users
   - Role and country badges
   - Access level information

2. **Dashboard** (`/dashboard`)
   - User information display
   - Navigation cards
   - Permissions checklist
   - Role-based messaging

3. **Restaurants** (`/dashboard/restaurants`)
   - Restaurant list (country-filtered)
   - Menu viewer
   - Add to cart functionality
   - Checkout with order summary

4. **Orders** (`/dashboard/orders`)
   - Order history
   - Order details with items
   - Cancel button (role-based)
   - Status badges

## 📊 Database Viewer

Open Prisma Studio to view and manage database:

```powershell
cd backend
npx prisma studio
```

Access at: http://localhost:51212

## 🧪 API Testing

### Using PowerShell Script

```powershell
cd backend
.\test-api.ps1
```

### Using VS Code REST Client

Open `api-tests.http` in VS Code with REST Client extension installed.

## 🎯 RBAC Implementation Details

### Guards
- `JwtAuthGuard` - Validates JWT token
- `RolesGuard` - Checks user role permissions

### Decorators
- `@Roles(...roles)` - Specify required roles for endpoint
- `@CurrentUser()` - Inject authenticated user into controller

### Example Usage

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
@Patch(':id/cancel')
async cancelOrder(@Param('id') id: string, @CurrentUser() user: User) {
  return this.ordersService.cancel(+id, user);
}
```

## 🌍 Country-Based Filtering

Implemented in all services:
- Restaurants filtered by user's country (except Admin)
- Orders filtered by country (except Admin)
- Menu items inherit restaurant's country

```typescript
const restaurants = await this.prisma.restaurant.findMany({
  where: user.role === Role.ADMIN ? {} : { country: user.country },
});
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT tokens with 1-day expiration
- ✅ Role-based route protection
- ✅ Country-based data isolation
- ✅ Input validation with class-validator
- ✅ CORS enabled for localhost

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgres://..."
JWT_SECRET="your-secret-key-change-this-in-production"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🎯 Project Requirements Checklist

### Core Requirements ✅
- [x] Role-Based Access Control (ADMIN, MANAGER, MEMBER)
- [x] View Restaurants (All roles)
- [x] Create Orders (All roles)
- [x] Place Orders (All roles)
- [x] Cancel Orders (Admin & Manager only)
- [x] Update Payment Methods (Admin only)

### Bonus Features ✅
- [x] Country-based data segregation (INDIA, AMERICA)
- [x] Managers & Members limited to their country
- [x] Admin unrestricted access to all countries

### Additional Features ✅
- [x] Complete authentication system
- [x] Protected frontend routes
- [x] Cart functionality
- [x] Order history
- [x] Role-based UI elements
- [x] Responsive design

## 🚀 Next Steps (Future Enhancements)

- [ ] Payment gateway integration
- [ ] Real-time order tracking
- [ ] Email notifications
- [ ] Admin dashboard for user management
- [ ] Restaurant ratings & reviews
- [ ] Order delivery tracking
- [ ] Multi-language support

## 📞 Support & Documentation

- **Architecture**: See `ARCHITECTURE.md`
- **API Testing**: See `API_TESTING_GUIDE.md`
- **Backend Details**: Check `backend/README.md`

## 📄 License

This project is created for educational and demonstration purposes.

---

**Built with ❤️ using NestJS, Next.js, Prisma, and PostgreSQL**
