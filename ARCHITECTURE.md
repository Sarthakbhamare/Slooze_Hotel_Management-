# System Architecture & Design

## 📐 Overview

The Food Ordering Application follows a modern **three-tier architecture** with clear separation of concerns:

1. **Presentation Layer** (Frontend - Next.js)
2. **Application Layer** (Backend - NestJS)
3. **Data Layer** (PostgreSQL via Prisma)

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│                     (React/Next.js App)                      │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/HTTPS
                            │ REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend Server                          │
│                  (NestJS Application)                        │
│  ┌─────────────┬──────────────┬────────────┬─────────────┐  │
│  │ Auth Module │ Restaurants  │   Orders   │  Payments   │  │
│  │             │   Module     │   Module   │   Module    │  │
│  └─────────────┴──────────────┴────────────┴─────────────┘  │
│                            │                                 │
│                    ┌───────┴────────┐                        │
│                    │  Prisma ORM    │                        │
│                    └───────┬────────┘                        │
└────────────────────────────┼─────────────────────────────────┘
                             │ SQL Queries
                             ▼
                  ┌─────────────────────┐
                  │   PostgreSQL DB     │
                  │   (Prisma Cloud)    │
                  └─────────────────────┘
```

---

## 🎨 Frontend Architecture (Next.js 14)

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom wrapper

### Directory Structure

```
frontend/
├── app/
│   ├── layout.tsx                 # Root layout with auth provider
│   ├── page.tsx                   # Login page
│   └── dashboard/
│       ├── layout.tsx             # Dashboard layout with navigation
│       ├── page.tsx               # Dashboard home
│       ├── restaurants/
│       │   └── page.tsx           # Browse restaurants & place orders
│       ├── orders/
│       │   └── page.tsx           # View order history & status
│       └── manage/
│           └── page.tsx           # Restaurant management (Admin/Manager)
│
├── contexts/
│   └── AuthContext.tsx            # Global auth state & user info
│
├── lib/
│   └── api.ts                     # Centralized API client
│
└── public/                        # Static assets
```

### Key Components

#### 1. Authentication Context
```typescript
// contexts/AuthContext.tsx
- Manages user state (user, token, role, country)
- Provides login/logout functions
- Persists token in localStorage
- Auto-loads user on mount
```

#### 2. API Client
```typescript
// lib/api.ts
- Centralized HTTP client
- Automatic token injection
- Error handling
- Type-safe response handling
```

#### 3. Page Components

**Login Page** (`app/page.tsx`)
- Email/password form
- Quick login buttons for test users
- Redirects to dashboard on success

**Dashboard** (`app/dashboard/page.tsx`)
- Role-based welcome message
- Quick stats (if applicable)
- Navigation to other features

**Restaurants** (`app/dashboard/restaurants/page.tsx`)
- List of restaurants (country-filtered)
- Menu items display
- Shopping cart functionality
- Checkout with payment selection

**Orders** (`app/dashboard/orders/page.tsx`)
- Order history table
- Status badges with colors
- Status update dropdown (Manager/Admin)
- Cancel order button (Manager/Admin)

**Manage** (`app/dashboard/manage/page.tsx`)
- Restaurant CRUD (Admin/Manager)
- Menu item management
- Country-based filtering (Manager)

### Data Flow

```
User Action (e.g., "Place Order")
    ↓
Event Handler in Component
    ↓
API Client Function (api.ts)
    ↓
HTTP Request with JWT token
    ↓
Backend API Endpoint
    ↓
Database via Prisma
    ↓
Response back through chain
    ↓
Component State Update
    ↓
UI Re-render
```

---

## ⚙️ Backend Architecture (NestJS 11)

### Tech Stack
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT + Passport
- **Validation**: class-validator

### Module Structure

```
backend/src/
├── main.ts                        # App bootstrap & config
│
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts         # /api/auth endpoints
│   ├── auth.service.ts            # Login, register, JWT
│   ├── jwt.strategy.ts            # JWT validation strategy
│   └── dto/                       # Login/Register DTOs
│
├── restaurants/
│   ├── restaurants.module.ts
│   ├── restaurants.controller.ts  # /api/restaurants endpoints
│   ├── restaurants.service.ts     # Business logic
│   └── dto/                       # Create/Update DTOs
│
├── orders/
│   ├── orders.module.ts
│   ├── orders.controller.ts       # /api/orders endpoints
│   ├── orders.service.ts          # Order management logic
│   └── dto/                       # Order DTOs
│
├── payment-methods/
│   ├── payment-methods.module.ts
│   ├── payment-methods.controller.ts  # /api/payment-methods
│   ├── payment-methods.service.ts
│   └── dto/
│
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts          # Database connection service
│
└── guards/
    └── roles.guard.ts             # Role-based access control
```

### Key Modules

#### 1. Auth Module
**Responsibilities**:
- User registration with password hashing (bcrypt)
- Login with JWT token generation
- Profile retrieval
- JWT validation via Passport

**Flow**:
```
POST /auth/login
    ↓
AuthController.login()
    ↓
AuthService.validateUser()
    ↓
bcrypt.compare(password, hashedPassword)
    ↓
AuthService.login()
    ↓
JWT.sign({ userId, email, role, country })
    ↓
Return { access_token, user }
```

#### 2. Restaurants Module
**Responsibilities**:
- CRUD operations for restaurants
- Menu item management
- Country-based access control

**Access Control**:
```typescript
@Get()
@UseGuards(AuthGuard('jwt'))
async findAll(@Request() req) {
  const { role, country } = req.user;
  
  if (role === 'ADMIN') {
    return this.restaurantsService.findAll(); // All restaurants
  }
  
  // Manager/Member: Only their country
  return this.restaurantsService.findByCountry(country);
}
```

#### 3. Orders Module
**Responsibilities**:
- Order creation
- Order checkout with payment
- Status management
- Order cancellation

**Status Lifecycle**:
```
PENDING → CONFIRMED → DELIVERED
   ↓
CANCELLED (from PENDING or CONFIRMED)
```

**Validation Logic**:
```typescript
// Only certain transitions allowed
const validTransitions = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [], // Terminal state
  CANCELLED: []  // Terminal state
};
```

#### 4. Payment Methods Module
**Responsibilities**:
- Store user payment methods
- Set default payment method
- Update/delete payment methods

---

## 🗄️ Database Schema (Prisma)

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │
│─────────────│
│ id          │──┐
│ email       │  │
│ password    │  │ One-to-Many
│ name        │  │
│ role        │  │
│ country     │  ├─────────────────┐
└─────────────┘  │                 │
                 │                 │
                 ▼                 ▼
        ┌──────────────┐  ┌──────────────────┐
        │    Order     │  │  PaymentMethod   │
        │──────────────│  │──────────────────│
        │ id           │  │ id               │
        │ userId       │  │ userId           │
        │ restaurantId │──┤ type             │
        │ status       │  │ cardNumber       │
        │ totalAmount  │  │ cardHolderName   │
        │ country      │  │ expiryDate       │
        └──────────────┘  │ isDefault        │
                │         └──────────────────┘
                │
                │ One-to-Many
                ▼
        ┌──────────────┐
        │  OrderItem   │
        │──────────────│
        │ id           │
        │ orderId      │
        │ menuItemId   │──┐
        │ quantity     │  │
        │ price        │  │
        └──────────────┘  │
                          │
                          │ Many-to-One
                          ▼
                  ┌──────────────┐
                  │   MenuItem   │
                  │──────────────│
                  │ id           │
                  │ restaurantId │──┐
                  │ name         │  │
                  │ description  │  │
                  │ price        │  │
                  │ category     │  │
                  │ isAvailable  │  │
                  └──────────────┘  │
                                    │
                                    │ Many-to-One
                                    ▼
                            ┌──────────────┐
                            │ Restaurant   │
                            │──────────────│
                            │ id           │
                            │ name         │
                            │ description  │
                            │ country      │
                            │ isActive     │
                            └──────────────┘
```

### Tables Overview

| Table | Description | Key Fields |
|-------|-------------|------------|
| users | User accounts | role, country |
| restaurants | Restaurant info | country, isActive |
| menu_items | Food items | price, isAvailable |
| orders | Customer orders | status, totalAmount |
| order_items | Items in order | quantity, price |
| payment_methods | Payment cards | type, isDefault |

### Enums

```prisma
enum Role {
  ADMIN    // Full access
  MANAGER  // Country-specific management
  MEMBER   // Customer
}

enum Country {
  INDIA
  AMERICA
}

enum OrderStatus {
  PENDING    // Order created
  CONFIRMED  // Manager confirmed
  DELIVERED  // Completed
  CANCELLED  // Cancelled
}

enum PaymentMethodType {
  CREDIT_CARD
  DEBIT_CARD
  UPI
  WALLET
}
```

---

## 🔐 Security Architecture

### 1. Authentication Flow

```
User Login
    ↓
POST /api/auth/login
    ↓
Validate credentials (bcrypt)
    ↓
Generate JWT token
    ↓
Token contains: { userId, email, role, country }
    ↓
Frontend stores token in localStorage
    ↓
All subsequent requests include:
Authorization: Bearer <token>
    ↓
Backend validates token via Passport JWT Strategy
    ↓
Extracts user info from token
    ↓
Attaches to request object (req.user)
```

### 2. Authorization (RBAC)

#### Role Guards
```typescript
// Custom decorator
@Roles(Role.ADMIN, Role.MANAGER)
@UseGuards(AuthGuard('jwt'), RolesGuard)
async createRestaurant() { ... }
```

#### Country-Based Filtering
```typescript
// In service layer
if (user.role === Role.MANAGER) {
  // Filter by country
  return await prisma.restaurant.findMany({
    where: { country: user.country }
  });
}
```

### 3. Data Access Control Matrix

| Resource | Admin | Manager | Member |
|----------|-------|---------|--------|
| All Restaurants | ✅ | Country Only | Country Only |
| All Orders | ✅ | Country Only | Own Only |
| Manage Restaurants | ✅ Any Country | Own Country | ❌ |
| Update Order Status | ✅ | Country Only | ❌ |
| Cancel Orders | ✅ | Country Only | ❌ |
| Payment Methods | Own | Own | Own |

### 4. Password Security

```typescript
// Registration
const hashedPassword = await bcrypt.hash(password, 10);

// Login validation
const isValid = await bcrypt.compare(password, user.password);
```

---

## 🔄 Request Flow Examples

### Example 1: Member Places Order

```
1. User (Thanos - Member, India) logs in
   Frontend: POST /api/auth/login
   Backend: Validates credentials → Returns JWT token
   
2. User browses restaurants
   Frontend: GET /api/restaurants
   Backend: Checks role → Filters by country (India)
   Returns: Spice Garden, Curry House
   
3. User views menu
   Frontend: GET /api/restaurants/:id/menu
   Backend: Returns menu items
   
4. User adds items to cart (frontend state)
   
5. User clicks checkout
   Frontend: POST /api/orders
   Payload: { restaurantId, items: [{menuItemId, quantity}] }
   Backend: 
     - Validates user owns the order
     - Calculates total
     - Creates order with PENDING status
     - Creates order items
   Returns: Order object
   
6. User selects payment & confirms
   Frontend: POST /api/orders/:id/checkout
   Payload: { paymentMethodId }
   Backend:
     - Links payment method to order
     - Order stays PENDING (awaits confirmation)
   Returns: Success message
   
7. User views order
   Frontend: GET /api/orders
   Backend: Filters by userId
   Returns: User's orders
```

### Example 2: Manager Updates Order Status

```
1. Manager (Captain Marvel - Manager, India) logs in
   JWT token contains: { role: MANAGER, country: INDIA }
   
2. Manager views orders
   Frontend: GET /api/orders
   Backend:
     - Checks role (MANAGER)
     - Filters by country (India)
   Returns: All orders in India
   
3. Manager updates order status
   Frontend: PATCH /api/orders/:id/status
   Payload: { status: "CONFIRMED" }
   Backend:
     - Validates user is Manager/Admin
     - Checks order belongs to manager's country
     - Validates status transition (PENDING → CONFIRMED)
     - Updates order
   Returns: Updated order
```

### Example 3: Admin Creates Restaurant

```
1. Admin (Nick Fury) logs in
   JWT token contains: { role: ADMIN, country: INDIA }
   
2. Admin creates restaurant
   Frontend: POST /api/restaurants
   Payload: { name, description, country: "AMERICA" }
   Backend:
     - Validates user is Admin or Manager
     - Admin can create in any country
     - Creates restaurant
   Returns: New restaurant object
   
3. Admin adds menu items
   Frontend: POST /api/restaurants/:id/menu
   Payload: { name, description, price, category }
   Backend:
     - Creates menu item
   Returns: Menu item object
```

---

## 📊 Data Flow Patterns

### Pattern 1: Country-Based Filtering

```typescript
// Automatic in all restaurant/order queries
const getRestaurants = (user) => {
  if (user.role === Role.ADMIN) {
    return prisma.restaurant.findMany(); // No filter
  }
  
  return prisma.restaurant.findMany({
    where: { country: user.country } // Filter
  });
};
```

### Pattern 2: Owner Validation

```typescript
// Ensure users can only access their own data
const getOrders = (user) => {
  const filter = { userId: user.id };
  
  if (user.role === Role.MANAGER) {
    // Manager sees all orders in their country
    return prisma.order.findMany({
      where: { country: user.country }
    });
  }
  
  if (user.role === Role.ADMIN) {
    // Admin sees everything
    return prisma.order.findMany();
  }
  
  // Member sees only their orders
  return prisma.order.findMany({ where: filter });
};
```

---

## 🚀 Deployment Architecture

### Development Environment
```
Backend:  localhost:3001
Frontend: localhost:3000
Database: Prisma Cloud (PostgreSQL)
```

### Production Recommendations

**Backend**:
- Deploy on: Heroku, Railway, Render, AWS EC2
- Set environment variables (JWT_SECRET, DATABASE_URL)
- Enable CORS for frontend domain
- Use process manager (PM2)

**Frontend**:
- Deploy on: Vercel, Netlify, AWS Amplify
- Set NEXT_PUBLIC_API_URL to backend URL
- Enable SSR/SSG as needed

**Database**:
- Already on Prisma Cloud (production-ready)
- Or migrate to AWS RDS, DigitalOcean PostgreSQL

---

## 🧪 Testing Strategy

### Unit Tests (Recommended)
- Service layer logic
- Guard functions
- Utility functions

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### E2E Tests
- Complete user workflows
- Role-based access scenarios
- Order lifecycle

---

## 📈 Performance Considerations

### Database Optimization
- Indexes on foreign keys (automatic via Prisma)
- Pagination for large lists
- Eager loading with `include` for related data

### Caching Strategy (Future)
- Redis for session data
- Cache restaurant/menu queries
- Invalidate on updates

### Frontend Optimization
- Next.js automatic code splitting
- Image optimization with Next.js Image
- Client-side caching with SWR/React Query

---

## 🔮 Future Enhancements

1. **Real-time Updates**: Socket.io for live order status
2. **File Uploads**: Restaurant images, menu photos
3. **Search & Filters**: Full-text search, price filters
4. **Analytics Dashboard**: Order stats, revenue charts
5. **Notifications**: Email/SMS for order updates
6. **Reviews & Ratings**: User feedback system
7. **Multi-language**: i18n support
8. **Mobile App**: React Native version

---

## 📚 Design Patterns Used

1. **Module Pattern**: NestJS modules for separation of concerns
2. **Repository Pattern**: Prisma service as data access layer
3. **Decorator Pattern**: NestJS decorators for metadata
4. **Guard Pattern**: Authentication and authorization guards
5. **DTO Pattern**: Data Transfer Objects for validation
6. **Factory Pattern**: Prisma client factory
7. **Singleton Pattern**: Prisma service instance

---

## 🏛️ Architecture Principles

✅ **Separation of Concerns**: Clear layer boundaries  
✅ **DRY (Don't Repeat Yourself)**: Reusable services and components  
✅ **SOLID Principles**: Single responsibility, dependency injection  
✅ **RESTful Design**: Standard HTTP methods and status codes  
✅ **Type Safety**: TypeScript throughout  
✅ **Security First**: Authentication, authorization, input validation  
✅ **Scalability**: Modular design, stateless backend  

---

For implementation details, see `README.md` and `API_DOCUMENTATION.md`
