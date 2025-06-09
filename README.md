[![Node.js CI](https://github.com/iitzIrFan/Agrofix-assignment/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/iitzIrFan/Agrofix-assignment/actions/workflows/node.js.yml)
# 🥦 Agrofix - Bulk Vegetable/Fruit Ordering Platform

A full-stack web application for managing bulk fruit and vegetable orders. Built using **Next.js (App Router)**, **PostgreSQL**, **Prisma**, and **Tailwind CSS**. Buyers can place and track orders; admins can manage products and update order statuses.

## ✨ Modern UI Design

Agrofix features a visually appealing, user-friendly interface designed with the following principles:

- **Consistent Design Language**: Clean, consistent styling across all pages
- **Intuitive Navigation**: Clear calls-to-action and logical user flows
- **Visual Hierarchy**: Important elements are emphasized appropriately
- **Responsive Layout**: Optimized for all devices from mobile to desktop
- **Accessibility**: Designed with accessibility in mind for all users

## ✅ Features

### 🛒 Buyer Features
- **Modern Homepage**  
  Attractive hero section with clear product showcasing and key benefits.  
  **Route:** `/`
- **Streamlined Bulk Order**  
  Intuitive form with product selection, quantity, personal details, and delivery address.  
  **Route:** `/order`
- **Enhanced Shopping Cart**  
  Add multiple products with clear order summary and secure checkout process.  
  **Route:** `/cart` and `/checkout`
- **Visual Order Tracking**  
  Track orders with intuitive status visualization and helpful guidance.  
  **Route:** `/track`
- **Dual Ordering Paths**  
  Flexibility between single-product bulk orders and multi-product cart checkout.

### 🛠️ Admin Features
- **Secure Authentication**  
  Admin login with credentials protected by environment variables.
- **Interactive Dashboard**  
  Comprehensive dashboard with total orders, revenue, and product statistics.
- **Orders Management**  
  Detailed order view with buyer information and delivery details.
- **Status Management**  
  Intuitive interface for order status updates with visual indicators.
- **Product Management**  
  User-friendly interface for adding, editing, and removing products.  
  **Route:** `/admin`

## 🗂️ Project Structure

```
agrofix-platform/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/        # Admin dashboard and management
│   │   ├── api/          # API routes
│   │   ├── cart/         # Shopping cart page
│   │   ├── checkout/     # Checkout flow
│   │   ├── order/        # Bulk order form
│   │   ├── track/        # Order tracking
│   │   ├── layout.tsx    # Root layout with shared components
│   │   └── page.tsx      # Homepage
│   ├── components/       # Reusable UI components
│   │   ├── CartDisplay.tsx
│   │   ├── CartIndicator.tsx
│   │   ├── ProductCard.tsx
│   │   └── ResponsiveHandler.tsx
│   └── lib/              # Utility functions and shared logic
├── prisma/               # Database schema and migrations
│   ├── migrations/
│   └── schema.prisma     # Database models
└── public/               # Static assets
    ├── vegetables.jpg    # Hero image
    └── other SVG icons
```

## 🔗 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/products` | Get all products |
| `POST` | `/api/order` | Create a new order |
| `GET` | `/api/order/:id` | Fetch order status |
| `GET` | `/api/checkout/:id` | Fetch checkout session orders |
| `GET` | `/api/admin/stats` | Get admin dashboard statistics |
| `GET` | `/api/admin/orders` | Get all orders for admin |
| `PUT` | `/api/admin/order/:id` | Update order status |
| `POST` | `/api/admin/products` | Add a product |
| `PUT` | `/api/admin/products/:id` | Edit a product |
| `DELETE` | `/api/admin/products/:id` | Delete a product |

## 🧠 PostgreSQL Database Schema (Prisma)

```prisma
model Product {
  id        String   @id @default(uuid())
  name      String
  price     Float
  createdAt DateTime @default(now())
  orders    Order[]
}

model Order {
  id                String      @id @default(uuid())
  product           Product     @relation(fields: [productId], references: [id])
  productId         String
  quantity          Int
  buyerName         String
  contact           String
  address           String
  status            OrderStatus @default(PENDING)
  createdAt         DateTime    @default(now())
  checkoutSessionId String?     // For grouping cart orders
}

enum OrderStatus {
  PENDING
  IN_PROGRESS
  DELIVERED
}
```

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-First Approach**: Designed to work seamlessly on small screens first
- **Adaptive Layouts**: Flexible grids that adapt to different screen sizes
- **Touch-Friendly UI**: Large touch targets for mobile users
- **Device Detection**: The `ResponsiveHandler` component detects screen size and adjusts the UI accordingly

## 🎨 UI Components

Agrofix includes several custom UI components:

- **ProductCard**: Displays product information with Add to Cart functionality
- **CartDisplay**: Shows items in cart with quantity controls
- **CartIndicator**: Navigation icon showing current cart status
- **ResponsiveHandler**: Handles responsive design adaptation

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Neon.tech)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **State Management**: React Context API for cart state
- **Deployment**: Vercel

## ⚙️ Setup Instructions

1. **Clone the repository**:
   ```
   git clone https://github.com/your-username/agrofix-platform
   cd agrofix-platform
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Configure environment variables**:
   
   Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@host/db
   ADMIN_SECRET=your_secret_admin_token
   ```

4. **Initialize the Prisma database**:
   ```
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Run the development server**:
   ```
   npm run dev
   ```

6. **Access the application**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🔧 Development Workflow

1. **Database Changes**:
   - Edit `prisma/schema.prisma`
   - Run `npx prisma migrate dev --name your_change_name`
   - Prisma Client is auto-generated

2. **Adding New Features**:
   - Create new components in `src/components`
   - Add new pages in `src/app`
   - Implement API endpoints in `src/app/api`

3. **Testing**:
   - Manual testing using the development server
   - Test all user flows from product browsing to order completion

## 🧪 Advanced Features
- ✅ Secure admin authentication (token-based)
- ✅ Interactive admin dashboard with real-time statistics
- ✅ Dual ordering systems (direct bulk order and cart checkout)
- ✅ Checkout session tracking for grouped orders
- ✅ Form validation and user-friendly error messages
- ✅ Fully responsive design optimized for all devices
- ✅ Environment variable management
- ✅ Modern UI with consistent design language
- ✅ Intuitive user flows for both customers and administrators

<!-- ## 📸 Screenshots

*Add screenshots of your application here to showcase the UI:*

### Homepage
*Screenshot of homepage with hero section and products*

### Bulk Order Form
*Screenshot of the order form*

### Cart & Checkout
*Screenshot of shopping cart page*

### Order Tracking
*Screenshot of order tracking interface*

### Admin Dashboard
*Screenshot of admin interface* -->

## 🚀 Deployment

This application is designed to be deployed on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the environment variables
3. Deploy automatically with each push to main branch

For the database, Neon.tech provides a serverless PostgreSQL that works well with this application.

## 📝 Future Enhancements
- User accounts and login functionality
- Enhanced product filtering and search
- Email notifications for order updates
- Payment gateway integration
- Admin analytics dashboard with charts
- Product categories and tags
- Customer reviews and ratings

<!-- ## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for any bugs or feature suggestions. -->
