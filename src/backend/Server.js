const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Log incoming requests for debugging
app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    next();
});

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'Welcome2023',  // Replace with your MySQL password
    database: 'ShoeStoreDB'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes for Products
app.get('/api/products', (req, res) => {
    const query = `
        SELECT p.*, b.name AS brand_name, c.name AS category_name, si.image_filename
        FROM Products p
        LEFT JOIN Brands b ON p.brand_id = b.brand_id
        LEFT JOIN Categories c ON p.category_id = c.category_id
        LEFT JOIN shoeImages si ON p.product_id = si.product_id
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/products/:id', (req, res) => {
    const query = `
        SELECT p.*, b.name AS brand_name, c.name AS category_name, si.image_filename
        FROM Products p
        LEFT JOIN Brands b ON p.brand_id = b.brand_id
        LEFT JOIN Categories c ON p.category_id = c.category_id
        LEFT JOIN shoeImages si ON p.product_id = si.product_id
        WHERE p.product_id = ?
    `;
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result[0]);
    });
});

app.post('/api/products', (req, res) => {
    const { name, description, price, color, size, brand_id, category_id, stock_quantity, image_url } = req.body;
    const query = `
        INSERT INTO Products (name, description, price, color, size, brand_id, category_id, stock_quantity, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [name, description, price, color, size, brand_id, category_id, stock_quantity, image_url], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ product_id: result.insertId });
    });
});

app.put('/api/products/:id', (req, res) => {
    const { name, description, price, color, size, brand_id, category_id, stock_quantity, image_url } = req.body;
    const query = `
        UPDATE Products
        SET name = ?, description = ?, price = ?, color = ?, size = ?, brand_id = ?, category_id = ?, stock_quantity = ?, image_url = ?
        WHERE product_id = ?
    `;
    db.query(query, [name, description, price, color, size, brand_id, category_id, stock_quantity, image_url, req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Product updated successfully' });
    });
});

app.delete('/api/products/:id', (req, res) => {
    const query = 'DELETE FROM Products WHERE product_id = ?';
    db.query(query, [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

// Routes for Customers
app.get('/api/customers', (req, res) => {
    const query = 'SELECT * FROM Customers';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.post('/api/customers', (req, res) => {
    const { first_name, last_name, email, password, address, phone } = req.body;
    const query = `
        INSERT INTO Customers (first_name, last_name, email, password, address, phone)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [first_name, last_name, email, password, address, phone], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ customer_id: result.insertId });
    });
});

// Routes for Orders
app.post('/api/orders', (req, res) => {
    const { customer_id, total_amount, order_status, items } = req.body;
    const orderQuery = `
        INSERT INTO Orders (customer_id, order_date, total_amount, order_status)
        VALUES (?, NOW(), ?, ?)
    `;
    db.query(orderQuery, [customer_id, total_amount, order_status], (err, orderResult) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const orderId = orderResult.insertId;
        const orderItemsQuery = `
            INSERT INTO Order_Items (order_id, product_id, quantity, price)
            VALUES ?
        `;
        const orderItems = items.map(item => [orderId, item.product_id, item.quantity, item.price]);
        db.query(orderItemsQuery, [orderItems], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            // Insert payment record
            const paymentQuery = `
                INSERT INTO payments (customer_id, order_id, amount, payment_method, payment_status)
                VALUES (?, ?, ?, ?, ?)
            `;
            db.query(paymentQuery, [customer_id, orderId, total_amount, 'Credit Card', 'completed'], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ order_id: orderId });
            });
        });
    });
});

app.get('/api/customers/:id/orders', (req, res) => {
    const query = `
        SELECT o.*, oi.product_id, oi.quantity, oi.price, p.name AS product_name
        FROM Orders o
        LEFT JOIN Order_Items oi ON o.order_id = oi.order_id
        LEFT JOIN Products p ON oi.product_id = p.product_id
        WHERE o.customer_id = ?
    `;
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// New Routes
app.get('/api/order-items', (req, res) => {
    const query = 'SELECT * FROM Order_Items';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/carts', (req, res) => {
    const query = 'SELECT * FROM Cart';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/cart-items', (req, res) => {
    const query = 'SELECT * FROM Cart_Items';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/payments', (req, res) => {
    const query = 'SELECT * FROM payments';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Routes for Cart
app.post('/api/cart', (req, res) => {
    const { customer_id, product_id, quantity } = req.body;
    if (!customer_id || !product_id || !quantity || quantity < 1) {
        return res.status(400).json({ error: 'Invalid request data' });
    }
    const cartQuery = 'INSERT INTO Cart (customer_id) VALUES (?) ON DUPLICATE KEY UPDATE cart_id = cart_id';
    db.query(cartQuery, [customer_id], (err, cartResult) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const cartIdQuery = 'SELECT cart_id FROM Cart WHERE customer_id = ?';
        db.query(cartIdQuery, [customer_id], (err, cart) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const cartId = cart[0].cart_id;
            const cartItemQuery = `
                INSERT INTO Cart_Items (cart_id, product_id, quantity)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE quantity = quantity + ?
            `;
            db.query(cartItemQuery, [cartId, product_id, quantity, quantity], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ message: 'Item added to cart' });
            });
        });
    });
});

app.get('/api/cart/:customer_id', (req, res) => {
    const query = `
        SELECT ci.*, p.name, p.price, p.image_url, si.image_filename
        FROM Cart_Items ci
        JOIN Cart c ON ci.cart_id = c.cart_id
        JOIN Products p ON ci.product_id = p.product_id
        LEFT JOIN shoeImages si ON p.product_id = si.product_id
        WHERE c.customer_id = ?
    `;
    db.query(query, [req.params.customer_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.delete('/api/cart/:customer_id/:product_id', (req, res) => {
    const { customer_id, product_id } = req.params;
    const findCartQuery = 'SELECT cart_id FROM Cart WHERE customer_id = ?';
    db.query(findCartQuery, [customer_id], (err, cart) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (cart.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const cartId = cart[0].cart_id;
        const deleteQuery = 'DELETE FROM Cart_Items WHERE cart_id = ? AND product_id = ?';
        db.query(deleteQuery, [cartId, product_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }
            res.json({ message: 'Item removed from cart' });
        });
    });
});

app.get('/api/cart/:customer_id/count', (req, res) => {
    const { customer_id } = req.params;
    const query = `
        SELECT SUM(ci.quantity) AS itemCount
        FROM Cart_Items ci
        JOIN Cart c ON ci.cart_id = c.cart_id
        WHERE c.customer_id = ?
    `;
    db.query(query, [customer_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const itemCount = results[0].itemCount || 0;
        res.json({ itemCount });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});