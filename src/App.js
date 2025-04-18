import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import MemberEnrollment from './components/MemeberEnrollemnt'; // Corrected import
import Payments from './components/payment';
import ProductsPage from './components/product'; // Changed to ProductsPage
import Cart from './components/Cart';
import AdminPage from './components/AdminPage';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/member-enrollment" element={<MemberEnrollment />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/AdminPage" element={<AdminPage />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="*" element={<h1>Page Not Found</h1>} /> {/* Fallback route */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;