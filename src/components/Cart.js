import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Loader2, Trash2, ShoppingCart } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

// Import local images
import shoe1 from '../assets/Images/shoe1.jpg';
import shoe2 from '../assets/Images/shoe2.jpg';
import shoe3 from '../assets/Images/shoe3.jpg';
import shoe4 from '../assets/Images/shoe4.jpg';
import shoe5 from '../assets/Images/shoe5.jpg';
import shoe6 from '../assets/Images/shoe6.jpg';

// Array of local images
const localImages = [shoe1, shoe2, shoe3, shoe4, shoe5, shoe6];

// ===============================
// Styled Components
// ===============================

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Heading = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
`;

const CartTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
`;

const TableHeader = styled.th`
  padding: 15px;
  background-color: #f7f7f7;
  color: #2c3e50;
  font-weight: 600;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #ddd;
  vertical-align: middle;
`;

const ProductImage = styled.img`
  max-width: 80px;
  max-height: 80px;
  object-fit: contain;
  border-radius: 5px;
`;

const ProductName = styled.span`
  font-size: 1.1rem;
  color: #2c3e50;
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #ff6b6b;
  }
`;

const RemoveButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c0392b;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const TotalText = styled.p`
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
`;

const EmptyCart = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-top: 50px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #e74c3c;
  font-size: 1.2rem;
  margin-top: 20px;
`;

const CheckoutSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CheckoutHeading = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
`;

const CustomerSelect = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  color: #2c3e50;

  &:focus {
    outline: none;
    border-color: #ff6b6b;
  }
`;

const CheckoutButton = styled.button`
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #27ae60;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// ===============================
// Component
// ===============================

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Hardcoded customer_id for demo purposes
  const customerId = 1;

  useEffect(() => {
    const fetchCart = async () => {
      const url = `http://localhost:3000/api/cart/${customerId}`;
      console.log('Cart.js fetching:', url); // Debug log
      try {
        const response = await axios.get(url);
        console.log('Cart.js response:', response.data); // Debug log
        const itemsWithImages = response.data.map((item, index) => ({
          ...item,
          image_url: localImages[index % localImages.length],
          price: Number(item.price) || 0,
        }));
        setCartItems(itemsWithImages);
      } catch (err) {
        console.error('Cart.js fetch error:', err.message);
        setError(err.message || 'Failed to fetch cart');
      } finally {
        setLoading(false);
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/customers');
        setCustomers(response.data);
      } catch (err) {
        console.error('Cart.js fetch customers error:', err.message);
      }
    };

    fetchCart();
    fetchCustomers();
  }, []);

  const handleQuantityChange = async (cartItemId, productId, newQuantity) => {
    if (newQuantity < 1) return;
    setActionLoading((prev) => ({ ...prev, [cartItemId]: true }));
    try {
      const url = 'http://localhost:3000/api/cart';
      console.log('Cart.js updating quantity:', url, { customerId, productId, newQuantity }); // Debug log
      await axios.post(url, {
        customer_id: customerId,
        product_id: productId,
        quantity: newQuantity - (cartItems.find((item) => item.cart_item_id === cartItemId)?.quantity || 0),
      });
      setCartItems((prev) =>
        prev.map((item) =>
          item.cart_item_id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success('Quantity updated!');
    } catch (err) {
      console.error('Cart.js quantity update error:', err.message);
      toast.error('Failed to update quantity');
    } finally {
      setActionLoading((prev) => ({ ...prev, [cartItemId]: false }));
    }
  };

  const handleRemoveItem = async (cartItemId, productId) => {
    setActionLoading((prev) => ({ ...prev, [cartItemId]: true }));
    try {
      const url = `http://localhost:3000/api/cart/${customerId}/${productId}`;
      console.log('Cart.js removing item:', url); // Debug log
      await axios.delete(url);
      setCartItems((prev) => prev.filter((item) => item.cart_item_id !== cartItemId));
      toast.success('Item removed from cart!');
    } catch (err) {
      console.error('Cart.js remove item error:', err.message);
      toast.error('Failed to remove item');
    } finally {
      setActionLoading((prev) => ({ ...prev, [cartItemId]: false }));
    }
  };

  const handleCheckout = async () => {
    if (!selectedCustomerId) {
      toast.error('Please select a customer!');
      return;
    }
    setCheckoutLoading(true);
    try {
      const totalAmount = calculateTotal();
      const items = cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));
      const response = await axios.post('http://localhost:3000/api/orders', {
        customer_id: selectedCustomerId,
        total_amount: totalAmount,
        order_status: 'pending',
        items,
      });
      toast.success('Checkout successful!');
      setCartItems([]); // Clear cart after successful checkout
    } catch (err) {
      console.error('Cart.js checkout error:', err.message);
      toast.error('Failed to complete checkout');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price);
    return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0).toFixed(2);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Loader2 size={48} className="animate-spin text-gray-500" />
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }

  return (
    <>
      <Navbar />
      <Container>
        <ToastContainer position="top-right" autoClose={3000} />
        <Heading>Your Cart</Heading>
        {cartItems.length === 0 ? (
          <EmptyCart>
            <ShoppingCart size={48} className="text-gray-400 mb-4" />
            <p>Your cart is empty.</p>
          </EmptyCart>
        ) : (
          <>
            <CartTable>
              <thead>
                <tr>
                  <TableHeader>Product</TableHeader>
                  <TableHeader>Price</TableHeader>
                  <TableHeader>Quantity</TableHeader>
                  <TableHeader>Total</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <TableRow key={item.cart_item_id}>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ProductImage
                          src={item.image_url || 'https://via.placeholder.com/80?text=No+Image'}
                          alt={item.name || 'Product'}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                          }}
                        />
                        <ProductName>{item.name || 'Unknown Product'}</ProductName>
                      </div>
                    </TableCell>
                    <TableCell>${formatPrice(item.price)}</TableCell>
                    <TableCell>
                      <QuantityInput
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.cart_item_id, item.product_id, Number(e.target.value))
                        }
                        disabled={actionLoading[item.cart_item_id]}
                      />
                    </TableCell>
                    <TableCell>${formatPrice(Number(item.price) * item.quantity)}</TableCell>
                    <TableCell>
                      <RemoveButton
                        onClick={() => handleRemoveItem(item.cart_item_id, item.product_id)}
                        disabled={actionLoading[item.cart_item_id]}
                      >
                        {actionLoading[item.cart_item_id] ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </RemoveButton>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </CartTable>
            <TotalSection>
              <TotalText>Total: ${calculateTotal()}</TotalText>
            </TotalSection>
            <CheckoutSection>
              <CheckoutHeading>Checkout</CheckoutHeading>
              <CustomerSelect
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.customer_id} value={customer.customer_id}>
                    {customer.first_name} ({customer.email})
                  </option>
                ))}
              </CustomerSelect>
              <CheckoutButton onClick={handleCheckout} disabled={checkoutLoading || !selectedCustomerId}>
                {checkoutLoading ? (
                  <Loader2 size={20} className="animate-spin mr-2" />
                ) : (
                  'Proceed to Checkout'
                )}
              </CheckoutButton>
            </CheckoutSection>
          </>
        )}
      </Container>
    </>
  );
};

export default Cart;