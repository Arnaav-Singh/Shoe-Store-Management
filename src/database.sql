-- SQL code to create the tables for the Shoe Store Database
CREATE DATABASE ShoeStoreDB;
USE ShoeStoreDB;
-- -----------------------------------------------------
-- Table `Categories`
-- -----------------------------------------------------
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- -----------------------------------------------------
-- Table `Brands`
-- -----------------------------------------------------
CREATE TABLE Brands (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- -----------------------------------------------------
-- Table `Customers`
-- -----------------------------------------------------
CREATE TABLE Customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Store hashed passwords
    address TEXT,
    phone VARCHAR(20)
);

-- -----------------------------------------------------
-- Table `Products`
-- -----------------------------------------------------
CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    color VARCHAR(50),
    size VARCHAR(50),
    brand_id INT,
    category_id INT,
    stock_quantity INT NOT NULL,
    image_url VARCHAR(255), -- stores the URL of the product image.
    FOREIGN KEY (brand_id) REFERENCES Brands (brand_id),
    FOREIGN KEY (category_id) REFERENCES Categories (category_id)
);

-- -----------------------------------------------------
-- Table `Orders`
-- -----------------------------------------------------
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    order_date DATETIME NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_status VARCHAR(50) NOT NULL, -- e.g., "Pending," "Shipped," "Delivered"
    FOREIGN KEY (customer_id) REFERENCES Customers (customer_id)
);

-- -----------------------------------------------------
-- Table `Order_Items`
-- -----------------------------------------------------
CREATE TABLE Order_Items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- Price of the item at the time of the order
    FOREIGN KEY (order_id) REFERENCES Orders (order_id),
    FOREIGN KEY (product_id) REFERENCES Products (product_id)
);

-- -----------------------------------------------------
-- Table `Cart`
-- -----------------------------------------------------
CREATE TABLE Cart (
  cart_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- -----------------------------------------------------
-- Table `Cart_Items`
-- -----------------------------------------------------
CREATE TABLE Cart_Items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT,
    product_id INT,
    quantity INT NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES Cart (cart_id),
    FOREIGN KEY (product_id) REFERENCES Products (product_id)
);

-- -----------------------------------------------------
-- Table `Collections`
-- -----------------------------------------------------
CREATE TABLE Collections (
    collection_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255)
);

-- -----------------------------------------------------
-- Table `Product_Collections`
-- -----------------------------------------------------
CREATE TABLE Product_Collections (
    product_id INT,
    collection_id INT,
    PRIMARY KEY (product_id, collection_id),
    FOREIGN KEY (product_id) REFERENCES Products (product_id),
    FOREIGN KEY (collection_id) REFERENCES Collections (collection_id)
);
-- -----------------------------------------------------
-- Table `Payments`
-- -----------------------------------------------------
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id), -- Assuming a customers table exists
    FOREIGN KEY (order_id) REFERENCES orders(order_id) -- Assuming an orders table exists
);