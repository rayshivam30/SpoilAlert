-- Create database schema for Walmart Food Clone

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    category_id INTEGER REFERENCES categories(id),
    stock_quantity INTEGER DEFAULT 0,
    expiry_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Fruits', 'fruits', 'Fresh fruits and berries'),
('Vegetables', 'vegetables', 'Fresh vegetables and greens'),
('Dairy', 'dairy', 'Milk, cheese, yogurt and dairy products'),
('Snacks', 'snacks', 'Chips, crackers and snack foods'),
('Beverages', 'beverages', 'Drinks and beverages'),
('Meat', 'meat', 'Fresh meat and poultry')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category_id, stock_quantity, expiry_date) VALUES
('Fresh Bananas', 'Ripe yellow bananas, perfect for snacking', 2.99, '/placeholder.svg?height=300&width=300', 1, 50, CURRENT_TIMESTAMP + INTERVAL '5 days'),
('Organic Apples', 'Crisp red apples, locally sourced', 4.99, '/placeholder.svg?height=300&width=300', 1, 30, CURRENT_TIMESTAMP + INTERVAL '10 days'),
('Fresh Spinach', 'Baby spinach leaves, perfect for salads', 3.49, '/placeholder.svg?height=300&width=300', 2, 25, CURRENT_TIMESTAMP + INTERVAL '3 days'),
('Whole Milk', 'Fresh whole milk, 1 gallon', 3.99, '/placeholder.svg?height=300&width=300', 3, 40, CURRENT_TIMESTAMP + INTERVAL '7 days'),
('Cheddar Cheese', 'Sharp cheddar cheese block', 5.99, '/placeholder.svg?height=300&width=300', 3, 20, CURRENT_TIMESTAMP + INTERVAL '14 days'),
('Potato Chips', 'Classic salted potato chips', 2.49, '/placeholder.svg?height=300&width=300', 4, 100, CURRENT_TIMESTAMP + INTERVAL '30 days'),
('Orange Juice', 'Fresh squeezed orange juice', 4.49, '/placeholder.svg?height=300&width=300', 5, 35, CURRENT_TIMESTAMP + INTERVAL '5 days'),
('Chicken Breast', 'Boneless chicken breast, 1lb', 7.99, '/placeholder.svg?height=300&width=300', 6, 15, CURRENT_TIMESTAMP + INTERVAL '2 days'),
-- Additional dummy products
('Strawberries', 'Sweet and juicy strawberries', 3.79, '/placeholder.svg?height=300&width=300', 1, 40, CURRENT_TIMESTAMP + INTERVAL '6 days'),
('Broccoli', 'Fresh green broccoli florets', 2.99, '/placeholder.svg?height=300&width=300', 2, 30, CURRENT_TIMESTAMP + INTERVAL '4 days'),
('Greek Yogurt', 'Creamy Greek yogurt, plain', 4.29, '/placeholder.svg?height=300&width=300', 3, 25, CURRENT_TIMESTAMP + INTERVAL '10 days'),
('Chocolate Cookies', 'Crunchy chocolate chip cookies', 3.59, '/placeholder.svg?height=300&width=300', 4, 60, CURRENT_TIMESTAMP + INTERVAL '20 days'),
('Cola Drink', 'Classic cola beverage, 2L', 1.99, '/placeholder.svg?height=300&width=300', 5, 50, CURRENT_TIMESTAMP + INTERVAL '60 days'),
('Ground Beef', 'Fresh ground beef, 1lb', 8.49, '/placeholder.svg?height=300&width=300', 6, 20, CURRENT_TIMESTAMP + INTERVAL '3 days'),
('Mangoes', 'Tropical ripe mangoes', 5.49, '/placeholder.svg?height=300&width=300', 1, 35, CURRENT_TIMESTAMP + INTERVAL '8 days'),
('Carrots', 'Crunchy orange carrots', 2.19, '/placeholder.svg?height=300&width=300', 2, 45, CURRENT_TIMESTAMP + INTERVAL '12 days'),
('Butter', 'Creamy unsalted butter', 3.69, '/placeholder.svg?height=300&width=300', 3, 30, CURRENT_TIMESTAMP + INTERVAL '25 days'),
('Nachos', 'Corn nachos with a hint of lime', 2.99, '/placeholder.svg?height=300&width=300', 4, 80, CURRENT_TIMESTAMP + INTERVAL '40 days'),
('Apple Juice', 'Pure apple juice, no sugar added', 3.99, '/placeholder.svg?height=300&width=300', 5, 40, CURRENT_TIMESTAMP + INTERVAL '15 days'),
('Pork Chops', 'Tender pork chops, 1lb', 9.29, '/placeholder.svg?height=300&width=300', 6, 18, CURRENT_TIMESTAMP + INTERVAL '5 days')
ON CONFLICT DO NOTHING;

-- Create admin user (password: admin123)
INSERT INTO users (email, password, name, role) VALUES
('admin@walmart.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;
