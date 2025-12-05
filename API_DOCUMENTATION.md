# API Documentation

Complete API reference for the Food Ordering Application.

**Base URL**: `http://localhost:3001/api`

All endpoints (except login and register) require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication

### 1. Register User

**Endpoint**: `POST /api/auth/register`

**Description**: Create a new user account

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe",
  "role": "MEMBER",
  "country": "INDIA"
}
```

**Response** (201 Created):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "MEMBER",
    "country": "INDIA"
  }
}
```

---

### 2. Login

**Endpoint**: `POST /api/auth/login`

**Description**: Authenticate user and receive JWT token

**Request Body**:
```json
{
  "email": "thanos@shield.com",
  "password": "Password123!"
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "thanos@shield.com",
    "name": "Thanos",
    "role": "MEMBER",
    "country": "INDIA"
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

---

### 3. Get Profile

**Endpoint**: `GET /api/auth/profile`

**Description**: Get current user's profile information

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "id": "uuid-here",
  "email": "thanos@shield.com",
  "name": "Thanos",
  "role": "MEMBER",
  "country": "INDIA"
}
```

---

## 🍽️ Restaurants

### 4. List Restaurants

**Endpoint**: `GET /api/restaurants`

**Description**: Get all restaurants (filtered by country for non-admin users)

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Spice Garden",
    "description": "Authentic Indian cuisine with a modern twist",
    "country": "INDIA",
    "isActive": true,
    "createdAt": "2025-12-05T10:00:00.000Z",
    "updatedAt": "2025-12-05T10:00:00.000Z"
  }
]
```

**Access Rules**:
- **Admin**: See all restaurants
- **Manager/Member**: See only restaurants in their country

---

### 5. Get Restaurant Details

**Endpoint**: `GET /api/restaurants/:id`

**Description**: Get single restaurant by ID

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Spice Garden",
  "description": "Authentic Indian cuisine with a modern twist",
  "country": "INDIA",
  "isActive": true,
  "createdAt": "2025-12-05T10:00:00.000Z",
  "updatedAt": "2025-12-05T10:00:00.000Z"
}
```

**Error** (404 Not Found):
```json
{
  "statusCode": 404,
  "message": "Restaurant not found"
}
```

---

### 6. Get Menu Items

**Endpoint**: `GET /api/restaurants/:id/menu`

**Description**: Get all menu items for a restaurant

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
[
  {
    "id": "menu-item-uuid",
    "restaurantId": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Butter Chicken",
    "description": "Creamy tomato-based chicken curry",
    "price": "350.00",
    "category": "Main Course",
    "isAvailable": true,
    "createdAt": "2025-12-05T10:00:00.000Z",
    "updatedAt": "2025-12-05T10:00:00.000Z"
  }
]
```

---

### 7. Create Restaurant

**Endpoint**: `POST /api/restaurants`

**Description**: Create a new restaurant (Admin/Manager only)

**Roles Required**: ADMIN, MANAGER

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "name": "Mumbai Delights",
  "description": "Authentic street food experience",
  "country": "INDIA"
}
```

**Response** (201 Created):
```json
{
  "id": "new-uuid",
  "name": "Mumbai Delights",
  "description": "Authentic street food experience",
  "country": "INDIA",
  "isActive": true,
  "createdAt": "2025-12-05T12:00:00.000Z",
  "updatedAt": "2025-12-05T12:00:00.000Z"
}
```

**Access Rules**:
- **Admin**: Can create in any country
- **Manager**: Can only create in their country

---

### 8. Update Restaurant

**Endpoint**: `PATCH /api/restaurants/:id`

**Description**: Update restaurant details (Admin/Manager only)

**Roles Required**: ADMIN, MANAGER

**Request Body**:
```json
{
  "name": "Spice Garden Premium",
  "description": "Updated description"
}
```

**Response** (200 OK):
```json
{
  "id": "restaurant-uuid",
  "name": "Spice Garden Premium",
  "description": "Updated description",
  "country": "INDIA",
  "isActive": true,
  "createdAt": "2025-12-05T10:00:00.000Z",
  "updatedAt": "2025-12-05T13:00:00.000Z"
}
```

---

### 9. Delete Restaurant

**Endpoint**: `DELETE /api/restaurants/:id`

**Description**: Soft delete a restaurant (Admin/Manager only)

**Roles Required**: ADMIN, MANAGER

**Response** (200 OK):
```json
{
  "message": "Restaurant deleted successfully"
}
```

---

### 10. Add Menu Item

**Endpoint**: `POST /api/restaurants/:id/menu`

**Description**: Add a menu item to restaurant (Admin/Manager only)

**Roles Required**: ADMIN, MANAGER

**Request Body**:
```json
{
  "name": "Paneer Tikka",
  "description": "Grilled cottage cheese with spices",
  "price": 280,
  "category": "Appetizer"
}
```

**Response** (201 Created):
```json
{
  "id": "menu-item-uuid",
  "restaurantId": "restaurant-uuid",
  "name": "Paneer Tikka",
  "description": "Grilled cottage cheese with spices",
  "price": "280.00",
  "category": "Appetizer",
  "isAvailable": true,
  "createdAt": "2025-12-05T14:00:00.000Z",
  "updatedAt": "2025-12-05T14:00:00.000Z"
}
```

---

### 11. Update Menu Item

**Endpoint**: `PATCH /api/restaurants/:restaurantId/menu/:menuItemId`

**Description**: Update menu item details

**Roles Required**: ADMIN, MANAGER

**Request Body**:
```json
{
  "price": 300,
  "isAvailable": false
}
```

**Response** (200 OK):
```json
{
  "id": "menu-item-uuid",
  "name": "Paneer Tikka",
  "price": "300.00",
  "isAvailable": false
}
```

---

### 12. Delete Menu Item

**Endpoint**: `DELETE /api/restaurants/:restaurantId/menu/:menuItemId`

**Description**: Delete a menu item

**Roles Required**: ADMIN, MANAGER

**Response** (200 OK):
```json
{
  "message": "Menu item deleted successfully"
}
```

---

## 📦 Orders

### 13. Create Order

**Endpoint**: `POST /api/orders`

**Description**: Create a new order with items

**Request Body**:
```json
{
  "restaurantId": "550e8400-e29b-41d4-a716-446655440001",
  "items": [
    {
      "menuItemId": "menu-item-uuid-1",
      "quantity": 2
    },
    {
      "menuItemId": "menu-item-uuid-2",
      "quantity": 1
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "id": "order-uuid",
  "userId": "user-uuid",
  "restaurantId": "restaurant-uuid",
  "status": "PENDING",
  "totalAmount": "980.00",
  "country": "INDIA",
  "createdAt": "2025-12-05T15:00:00.000Z",
  "orderItems": [
    {
      "id": "order-item-uuid-1",
      "menuItemId": "menu-item-uuid-1",
      "quantity": 2,
      "price": "350.00",
      "menuItem": {
        "name": "Butter Chicken"
      }
    },
    {
      "id": "order-item-uuid-2",
      "menuItemId": "menu-item-uuid-2",
      "quantity": 1,
      "price": "280.00",
      "menuItem": {
        "name": "Paneer Tikka"
      }
    }
  ]
}
```

---

### 14. List Orders

**Endpoint**: `GET /api/orders`

**Description**: Get all orders for current user (or country for Manager/Admin)

**Response** (200 OK):
```json
[
  {
    "id": "order-uuid",
    "userId": "user-uuid",
    "restaurantId": "restaurant-uuid",
    "status": "PENDING",
    "totalAmount": "980.00",
    "paymentMethodId": null,
    "country": "INDIA",
    "createdAt": "2025-12-05T15:00:00.000Z",
    "restaurant": {
      "name": "Spice Garden"
    },
    "orderItems": [
      {
        "quantity": 2,
        "price": "350.00",
        "menuItem": {
          "name": "Butter Chicken"
        }
      }
    ]
  }
]
```

**Access Rules**:
- **Admin**: See all orders
- **Manager**: See orders in their country
- **Member**: See only their own orders

---

### 15. Get Order Details

**Endpoint**: `GET /api/orders/:id`

**Description**: Get single order by ID

**Response** (200 OK):
```json
{
  "id": "order-uuid",
  "userId": "user-uuid",
  "restaurantId": "restaurant-uuid",
  "status": "CONFIRMED",
  "totalAmount": "980.00",
  "paymentMethodId": "payment-method-uuid",
  "country": "INDIA",
  "createdAt": "2025-12-05T15:00:00.000Z",
  "updatedAt": "2025-12-05T15:30:00.000Z",
  "restaurant": {
    "name": "Spice Garden",
    "country": "INDIA"
  },
  "user": {
    "name": "Thanos",
    "email": "thanos@shield.com"
  },
  "paymentMethod": {
    "type": "CREDIT_CARD",
    "cardNumber": "4111111111111114"
  },
  "orderItems": [
    {
      "id": "order-item-uuid",
      "quantity": 2,
      "price": "350.00",
      "menuItem": {
        "name": "Butter Chicken",
        "description": "Creamy tomato-based chicken curry"
      }
    }
  ]
}
```

---

### 16. Checkout Order

**Endpoint**: `POST /api/orders/:id/checkout`

**Description**: Complete order checkout with payment method

**Request Body**:
```json
{
  "paymentMethodId": "payment-method-uuid"
}
```

**Response** (200 OK):
```json
{
  "id": "order-uuid",
  "status": "PENDING",
  "totalAmount": "980.00",
  "paymentMethodId": "payment-method-uuid",
  "message": "Order placed successfully"
}
```

---

### 17. Update Order Status

**Endpoint**: `PATCH /api/orders/:id/status`

**Description**: Update order status (Admin/Manager only)

**Roles Required**: ADMIN, MANAGER

**Request Body**:
```json
{
  "status": "CONFIRMED"
}
```

**Valid Status Transitions**:
- PENDING → CONFIRMED
- CONFIRMED → DELIVERED
- PENDING → CANCELLED
- CONFIRMED → CANCELLED

**Response** (200 OK):
```json
{
  "id": "order-uuid",
  "status": "CONFIRMED",
  "updatedAt": "2025-12-05T16:00:00.000Z"
}
```

**Error** (400 Bad Request):
```json
{
  "statusCode": 400,
  "message": "Invalid status transition"
}
```

---

### 18. Cancel Order

**Endpoint**: `PATCH /api/orders/:id/cancel`

**Description**: Cancel an order (Admin/Manager only)

**Roles Required**: ADMIN, MANAGER

**Response** (200 OK):
```json
{
  "id": "order-uuid",
  "status": "CANCELLED",
  "message": "Order cancelled successfully"
}
```

**Access Rules**:
- **Admin**: Can cancel any order
- **Manager**: Can only cancel orders in their country
- **Member**: Cannot cancel orders

---

## 💳 Payment Methods

### 19. List Payment Methods

**Endpoint**: `GET /api/payment-methods`

**Description**: Get all payment methods for current user

**Response** (200 OK):
```json
[
  {
    "id": "payment-method-uuid",
    "userId": "user-uuid",
    "type": "CREDIT_CARD",
    "cardNumber": "4111111111111114",
    "cardHolderName": "Thanos",
    "expiryDate": "12/28",
    "isDefault": true,
    "createdAt": "2025-12-05T10:00:00.000Z"
  }
]
```

---

### 20. Create Payment Method

**Endpoint**: `POST /api/payment-methods`

**Description**: Add a new payment method

**Request Body**:
```json
{
  "type": "CREDIT_CARD",
  "cardNumber": "4111111111111115",
  "cardHolderName": "Thanos",
  "expiryDate": "12/26",
  "isDefault": false
}
```

**Valid Payment Types**:
- CREDIT_CARD
- DEBIT_CARD
- UPI
- WALLET

**Response** (201 Created):
```json
{
  "id": "new-payment-method-uuid",
  "userId": "user-uuid",
  "type": "CREDIT_CARD",
  "cardNumber": "4111111111111115",
  "cardHolderName": "Thanos",
  "expiryDate": "12/26",
  "isDefault": false,
  "createdAt": "2025-12-05T17:00:00.000Z"
}
```

---

### 21. Get Payment Method

**Endpoint**: `GET /api/payment-methods/:id`

**Description**: Get single payment method by ID

**Response** (200 OK):
```json
{
  "id": "payment-method-uuid",
  "type": "CREDIT_CARD",
  "cardNumber": "4111111111111114",
  "cardHolderName": "Thanos",
  "expiryDate": "12/28",
  "isDefault": true
}
```

---

### 22. Update Payment Method

**Endpoint**: `PATCH /api/payment-methods/:id`

**Description**: Update payment method details

**Request Body**:
```json
{
  "cardHolderName": "Thanos Updated",
  "expiryDate": "12/29"
}
```

**Response** (200 OK):
```json
{
  "id": "payment-method-uuid",
  "cardHolderName": "Thanos Updated",
  "expiryDate": "12/29"
}
```

---

### 23. Set Default Payment Method

**Endpoint**: `PATCH /api/payment-methods/:id/set-default`

**Description**: Set a payment method as default

**Response** (200 OK):
```json
{
  "id": "payment-method-uuid",
  "isDefault": true,
  "message": "Payment method set as default"
}
```

---

### 24. Delete Payment Method

**Endpoint**: `DELETE /api/payment-methods/:id`

**Description**: Delete a payment method

**Response** (200 OK):
```json
{
  "message": "Payment method deleted successfully"
}
```

---

## 📊 Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## 🔒 Role Permissions Summary

| Endpoint | Admin | Manager | Member |
|----------|-------|---------|--------|
| Auth endpoints | ✅ | ✅ | ✅ |
| GET restaurants | ✅ All | ✅ Country | ✅ Country |
| POST restaurant | ✅ | ✅ | ❌ |
| PATCH/DELETE restaurant | ✅ | ✅ Own Country | ❌ |
| Menu CRUD | ✅ | ✅ Own Country | ❌ |
| Create order | ✅ | ✅ | ✅ |
| View orders | ✅ All | ✅ Country | ✅ Own |
| Update order status | ✅ | ✅ Country | ❌ |
| Cancel order | ✅ | ✅ Country | ❌ |
| Payment methods | ✅ Own | ✅ Own | ✅ Own |

---

## 🧪 Testing with Postman

1. Import `postman_collection.json` from project root
2. Set environment variable `baseUrl` to `http://localhost:3001/api`
3. Login to get JWT token
4. Set `authToken` variable with the token
5. All requests will automatically include the token

**Sample Test Flow**:
1. Login as Thanos → Get token
2. List restaurants → See India restaurants
3. Get menu for Spice Garden
4. Create order with items
5. Checkout order with payment method
6. List orders → See your order
7. Login as Captain Marvel (Manager)
8. Update order status to CONFIRMED
9. Update status to DELIVERED

---

## 📝 Notes

- All prices are in INR (Indian Rupees)
- Timestamps are in ISO 8601 format (UTC)
- Card numbers in seed data are test numbers (Visa test card: 4111111111111111)
- Country field is auto-set based on restaurant's country for orders
- Status changes are validated (can't go from DELIVERED to PENDING)
- Managers can only access data from their assigned country
- Admins have full access across all countries

---

For more details, see `README.md` and `ARCHITECTURE.md`
