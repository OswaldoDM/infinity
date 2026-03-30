-- ============================================
-- Next - E-commerce
-- ============================================

-- Crear la base de datos (opcional, si no existe)
CREATE DATABASE ecommerce_db;

-- Crear tipos ENUM para roles y estados
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'shipped', 'delivered', 'cancelled');

-- Tabla: Usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  
    image_url VARCHAR(500),
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    first_name VARCHAR(50) DEFAULT '',
    last_name VARCHAR(50) DEFAULT '',
    phone VARCHAR(50) DEFAULT '',
);

-- Tabla: Categorías
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- Tabla: Productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,  -- FK a categorías, permite null si categoría se elimina
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas rápidas en productos por nombre o categoría
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category_id ON products(category_id);


-- Tabla: Direcciones
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Elimina direcciones si usuario se elimina
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'USA',  -- Ajusta default según tu mercado
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    shortname VARCHAR(50),
    phone VARCHAR(50),
);

-- Índice para user_id en direcciones
CREATE INDEX idx_addresses_user_id ON addresses(user_id);


-- Tabla: Órdenes
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status order_status NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    shipping_address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL,  -- FK opcional a direcciones
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para user_id y status en órdenes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);


-- Tabla: Items de Órden
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,  -- No permite eliminar producto si está en una orden
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(10, 2) NOT NULL CHECK (price_at_purchase >= 0)
);

-- Índices para order_id y product_id en items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);


-- Actualizar stock de productos al agregar un item de orden
CREATE OR REPLACE FUNCTION update_stock() RETURNS TRIGGER AS $$
BEGIN
    -- Validar stock disponible
    IF (SELECT stock_quantity FROM products WHERE id = NEW.product_id) < NEW.quantity THEN
        RAISE EXCEPTION 'Stock insuficiente para el producto %', NEW.product_id;
    END IF;
    
    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity        
    WHERE id = NEW.product_id;    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_stock
AFTER INSERT ON order_items
FOR EACH ROW EXECUTE FUNCTION update_stock();


