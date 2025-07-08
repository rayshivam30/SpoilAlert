# Walmart Food Clone - E-commerce Platform

A modern e-commerce platform focused on food products with expiry date tracking, built with Next.js, Neon PostgreSQL, and comprehensive admin functionality.

## 🚀 Features

### User Features
- **Product Catalog**: Browse food products by categories (fruits, vegetables, dairy, snacks, etc.)
- **Expiry Tracking**: Visual warnings for expired or soon-to-expire products
- **Shopping Cart**: Add items to cart with quantity management
- **User Authentication**: Secure registration and login system
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS

### Admin Features
- **Admin Dashboard**: Comprehensive overview with key metrics
- **Product Management**: Add, edit, delete products with image upload
- **Expiry Monitoring**: Track and get alerts for expiring products
- **Inventory Management**: Stock quantity tracking and management
- **User Management**: View and manage registered users

### Technical Features
- **Database**: PostgreSQL with Neon hosting
- **Authentication**: JWT-based authentication with secure cookies
- **API Routes**: RESTful API endpoints for all operations
- **Error Handling**: Comprehensive error handling and validation
- **Security**: Password hashing, input validation, and SQL injection protection

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Neon PostgreSQL
- **Authentication**: Custom JWT implementation
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd walmart-food-clone
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a \`.env.local\` file in the root directory:
   \`\`\`env
   DATABASE_URL=your_neon_database_url
   JWT_SECRET=your_jwt_secret_key
   \`\`\`

4. **Set up the database**
   Run the SQL schema script in your Neon database console or use the provided script:
   \`\`\`bash
   # The schema.sql file contains all necessary tables and sample data
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to \`http://localhost:3000\`

## 🗄️ Database Schema

### Tables
- **users**: User accounts with role-based access
- **categories**: Product categories (fruits, vegetables, etc.)
- **products**: Product information with expiry dates
- **cart_items**: Shopping cart functionality

### Key Features
- Expiry date tracking for all products
- Stock quantity management
- User role management (user/admin)
- Relational data integrity

## 🔐 Authentication

The application uses JWT-based authentication with:
- Secure password hashing (bcrypt)
- HTTP-only cookies for token storage
- Role-based access control
- Session persistence across page reloads

### Demo Accounts
- **Admin**: admin@walmart.com / admin123
- **User**: Create your own account via registration

## 📱 API Endpoints

### Authentication
- \`POST /api/auth/login\` - User login
- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/logout\` - User logout

### Cart Management
- \`GET /api/cart\` - Get user's cart items
- \`POST /api/cart\` - Add item to cart
- \`PUT /api/cart\` - Update cart item quantity
- \`DELETE /api/cart\` - Remove item from cart

### Products (Admin)
- \`GET /api/admin/products\` - Get all products
- \`POST /api/admin/products\` - Create new product
- \`PUT /api/admin/products/[id]\` - Update product
- \`DELETE /api/admin/products/[id]\` - Delete product

## 🎨 UI Components

Built with shadcn/ui components:
- Responsive product cards with expiry status
- Clean admin dashboard with metrics
- Mobile-friendly navigation
- Form validation and error handling
- Loading states and user feedback

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables
- \`DATABASE_URL\`: Your Neon PostgreSQL connection string
- \`JWT_SECRET\`: Secret key for JWT token signing

## 🔄 Expiry Tracking System

The application includes a comprehensive expiry tracking system:

### Status Types
- **Fresh**: Products with expiry dates > 3 days away
- **Expiring Soon**: Products expiring within 3 days
- **Expired**: Products past their expiry date

### Visual Indicators
- Color-coded badges on product cards
- Admin dashboard alerts for expiring products
- Automatic prevention of adding expired items to cart

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only secure cookies
- Input validation and sanitization
- SQL injection prevention
- Role-based access control

## 📊 Admin Dashboard Features

- **Metrics Overview**: Total products, users, cart items
- **Expiry Alerts**: Real-time notifications for expiring products
- **Quick Actions**: Easy access to common admin tasks
- **Product Management**: Full CRUD operations for products
- **User Management**: View and manage user accounts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the demo accounts for testing

---

Built with ❤️ using Next.js and modern web technologies.
