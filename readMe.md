# E-commerce Backend API

A robust Node.js/Express backend system implementing user authentication, product management, order processing, and automated notifications.

## 🚀 Implementation Approach & Technical Decisions

### 1. Architecture Design
I approached this project using a layered architecture pattern to ensure separation of concerns:
- **Routes Layer**: Handles incoming requests and routes them to appropriate controllers
- **Controller Layer**: Contains business logic and request processing
- **Model Layer**: Defines database schemas and handles data interactions
- **Middleware Layer**: Manages cross-cutting concerns like authentication and validation

### 2. Security Implementation
Security was a top priority throughout development:
- **Password Security**: Implemented bcrypt hashing for password storage
- **JWT Authentication**: Used JSON Web Tokens for stateless authentication
- **Input Validation**: Employed Joi for comprehensive request validation
- **Route Protection**: Created middleware to protect admin routes

### 3. Database Design Decisions
Chose MongoDB for its flexibility and scalability:
- **Soft Deletion**: Implemented for products to maintain data history
- **Referential Integrity**: Used Mongoose references to maintain relationships between orders, users, and products
- **Indexing**: Added indexes on frequently queried fields for better performance

### 4. Notable Features

#### Advanced Product Filtering
Implemented a flexible query system for products:
```javascript
// Example query
GET /api/products?minPrice=10&maxPrice=100&inStock=true&search=laptop
```

#### Robust Order Management
- Stock validation before order creation
- Automatic stock updates
- Order status tracking
- Comprehensive order history

#### Automated Tasks
Implemented two critical cron jobs:
1. **Stock Monitoring**: Runs daily to check product inventory
2. **Order Fulfillment**: Hourly checks for pending orders

## 🛠️ Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Email**: Nodemailer
- **Scheduling**: Node-cron

## 📦 Project Structure
```
├── controllers/
│   ├── user.controller.js
│   ├── product.controller.js
│   └── order.controller.js
├── models/
│   ├── user.model.js
│   ├── product.model.js
│   └── order.model.js
├── middleware/
│   ├── auth.js
│   └── validate.js
├── routes/
│   ├── user.routes.js
│   ├── product.routes.js
│   └── order.routes.js
├── validation/
│   └── schemas.js
├── utils/
│   ├── email.js
│   └── cronJobs.js
└── server.js
```

## 🚦 API Endpoints

### User Management
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

### Product Management
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `GET /api/products` - Get products (with filters)
- `DELETE /api/products/:id` - Delete product (Admin)

### Order Management
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `DELETE /api/orders/:id` - Delete order (Admin)

## 💡 Key Implementation Highlights

1. **Error Handling**
```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});
```

2. **Validation Example**
```javascript
const productValidation = {
  create: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    stock: Joi.number().required().min(0)
  })
};
```

3. **Stock Management**
```javascript
// Stock update during order creation
await Product.findByIdAndUpdate(item.product, {
  $inc: { stock: -item.quantity }
});
```

## 🔄 Automated Tasks Implementation

### Stock Monitoring
```javascript
cron.schedule('0 0 * * *', async () => {
  const lowStockProducts = await Product.find({ stock: { $lt: 10 } });
  if (lowStockProducts.length > 0) {
    await sendLowStockAlert(lowStockProducts);
  }
});
```

### Order Reminder
```javascript
cron.schedule('0 * * * *', async () => {
  const pendingOrders = await Order.find({
    status: 'pending',
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });
  for (const order of pendingOrders) {
    await sendOrderReminder(order);
  }
});
```

## 🔍 Testing Strategy

The implementation includes comprehensive testing:
1. Unit tests for individual components
2. Integration tests for API endpoints
3. Load testing for performance verification
4. Security testing for authentication and authorization

## 🛡️ Security Measures

1. **Input Sanitization**
2. **Rate Limiting**
3. **JWT Token Expiration**
4. **Password Hashing**
5. **Role-Based Access Control**

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Start the server: `npm start`

## 📈 Future Improvements

1. Implement caching for frequently accessed products
2. Add webhook notifications for order status changes
3. Implement bulk operations for product updates
4. Add analytics dashboard for admin
5. Implement payment gateway integration

This implementation focuses on creating a scalable, secure, and maintainable e-commerce backend system while following best practices in Node.js development.