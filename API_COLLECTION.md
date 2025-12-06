# API Collection Documentation

## Base URLs

- **Local Development:** `http://localhost:3001/api`
- **Production:** `https://sloozehotelmanagement-production.up.railway.app/api`

## Authentication

All protected endpoints require JWT Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📌 Authentication Endpoints

### 1. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "nick.fury@shield.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "nick.fury@shield.com",
    "name": "Nick Fury",
    "role": "ADMIN",
    "country": "INDIA"
  }
}
```

### 2. Register
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "country": "INDIA"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "new-user-id",
    "email": "newuser@example.com",
    "name": "John Doe",
    "role": "MEMBER",
    "country": "INDIA"
  }
}
```

---

## 🍽️ Restaurant Endpoints

### 1. Get All Restaurants
**GET** `/restaurants`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `country` (optional): Filter by country (INDIA, AMERICA)

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Spice Garden",
    "description": "Authentic Indian cuisine",
    "country": "INDIA",
    "isActive": true,
    "createdAt": "2025-12-05T10:00:00.000Z"
  }
]
```

### 2. Get Single Restaurant
**GET** `/restaurants/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Spice Garden",
  "description": "Authentic Indian cuisine",
  "country": "INDIA",
  "isActive": true,
  "createdAt": "2025-12-05T10:00:00.000Z"
}
```

### 3. Create Restaurant (ADMIN only)
**POST** `/restaurants`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "New Restaurant",
  "description": "Amazing food",
  "country": "INDIA"
}
```

### 4. Update Restaurant (ADMIN only)
**PATCH** `/restaurants/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "isActive": false
}
```

### 5. Delete Restaurant (ADMIN only)
**DELETE** `/restaurants/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

## 🍔 Menu Endpoints

### 1. Get Menu Items for Restaurant
**GET** `/menu/restaurant/:restaurantId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "menu-item-id",
    "restaurantId": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Butter Chicken",
    "description": "Tender chicken in creamy tomato-based curry",
    "price": "450",
    "category": "Main Course",
    "isAvailable": true
  }
]
```

### 2. Create Menu Item (ADMIN/MANAGER)
**POST** `/menu`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "restaurantId": "550e8400-e29b-41d4-a716-446655440001",
  "name": "New Dish",
  "description": "Delicious new item",
  "price": 299,
  "category": "Main Course",
  "isAvailable": true
}
```

### 3. Update Menu Item (ADMIN/MANAGER)
**PATCH** `/menu/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "price": 350,
  "isAvailable": false
}
```

### 4. Delete Menu Item (ADMIN/MANAGER)
**DELETE** `/menu/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 📦 Order Endpoints

### 1. Get User Orders
**GET** `/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "order-id",
    "userId": "user-id",
    "restaurantId": "550e8400-e29b-41d4-a716-446655440001",
    "status": "PENDING",
    "totalAmount": "920",
    "createdAt": "2025-12-05T15:30:00.000Z",
    "restaurant": {
      "name": "Spice Garden",
      "country": "INDIA"
    },
    "orderItems": [
      {
        "id": "order-item-id",
        "menuItemId": "menu-item-id",
        "quantity": 2,
        "price": "450",
        "menuItem": {
          "name": "Butter Chicken"
        }
      }
    ]
  }
]
```

### 2. Create Order
**POST** `/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "restaurantId": "550e8400-e29b-41d4-a716-446655440001",
  "items": [
    {
      "menuItemId": "menu-item-id-1",
      "quantity": 2
    },
    {
      "menuItemId": "menu-item-id-2",
      "quantity": 1
    }
  ],
  "paymentMethodId": "payment-method-id"
}
```

**Response:**
```json
{
  "id": "new-order-id",
  "userId": "user-id",
  "restaurantId": "550e8400-e29b-41d4-a716-446655440001",
  "status": "PENDING",
  "totalAmount": "1200",
  "createdAt": "2025-12-05T16:00:00.000Z"
}
```

### 3. Update Order Status (ADMIN/MANAGER)
**PATCH** `/orders/:id/status`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

**Valid statuses:** `PENDING`, `CONFIRMED`, `PREPARING`, `DELIVERED`, `CANCELLED`

### 4. Cancel Order (ADMIN/MANAGER)
**DELETE** `/orders/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 💳 Payment Method Endpoints

### 1. Get User Payment Methods
**GET** `/payment-methods`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "payment-method-id",
    "userId": "user-id",
    "type": "CREDIT_CARD",
    "details": {
      "cardNumber": "****1234",
      "cardHolder": "John Doe"
    },
    "isDefault": true
  }
]
```

### 2. Create Payment Method
**POST** `/payment-methods`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "CREDIT_CARD",
  "details": {
    "cardNumber": "4111111111111111",
    "cardHolder": "John Doe",
    "expiryMonth": "12",
    "expiryYear": "2026",
    "cvv": "123"
  }
}
```

### 3. Set Default Payment Method
**PATCH** `/payment-methods/:id/default`

**Headers:**
```
Authorization: Bearer <token>
```

### 4. Delete Payment Method
**DELETE** `/payment-methods/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 🧪 Test Data

### Test Users

All users have password: `Password123!`

| Email | Role | Country |
|-------|------|---------|
| nick.fury@shield.com | ADMIN | INDIA |
| carol.danvers@shield.com | MANAGER | INDIA |
| steve.rogers@shield.com | MANAGER | AMERICA |
| thanos@shield.com | MEMBER | INDIA |
| thor@shield.com | MEMBER | INDIA |
| travis@shield.com | MEMBER | AMERICA |

### Test Restaurants

| Name | Country |
|------|---------|
| Spice Garden | INDIA |
| Curry House | INDIA |
| Burger Palace | AMERICA |
| Pizza Paradise | AMERICA |

---

## 📋 Postman Collection

### Import to Postman

1. Create new Collection in Postman
2. Set Collection Variables:
   - `baseUrl`: `http://localhost:3001/api` or `https://sloozehotelmanagement-production.up.railway.app/api`
   - `token`: (will be set after login)

3. Add requests as shown above
4. Use `{{baseUrl}}` in request URLs
5. Use `{{token}}` in Authorization header

### Sample Request Flow

1. **Login** → Get `access_token`
2. **Get Restaurants** → Get restaurant IDs
3. **Get Menu Items** → Get menu item IDs
4. **Create Payment Method** → Get payment method ID
5. **Create Order** → Place an order
6. **Get Orders** → View order history
7. **Update Order Status** (as ADMIN/MANAGER)

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Restaurant not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## 🔐 Authorization Rules

| Endpoint | ADMIN | MANAGER | MEMBER |
|----------|-------|---------|--------|
| GET /restaurants | All countries | Own country | Own country |
| POST /restaurants | ✅ | ❌ | ❌ |
| GET /menu | ✅ | ✅ | ✅ |
| POST /menu | ✅ | Own country | ❌ |
| POST /orders | ✅ | ✅ | ✅ |
| PATCH /orders/status | ✅ | Own country | ❌ |
| DELETE /orders | ✅ | Own country | ❌ |

---

**Happy Testing! 🚀**
