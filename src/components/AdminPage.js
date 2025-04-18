import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
`;

const PasswordContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #2ecc71;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
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

const Tabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #ddd;
`;

const Tab = styled.button`
  padding: 10px 20px;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => (props.active ? '#2c3e50' : '#7f8c8d')};
  background: none;
  border: none;
  border-bottom: ${props => (props.active ? '2px solid #2ecc71' : 'none')};
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #2c3e50;
  }
`;

const TableContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 12px;
  background-color: #f7f7f7;
  color: #2c3e50;
  font-weight: 600;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #ecf0f1;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  color: #2c3e50;
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

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false); // Only load after authentication
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const CORRECT_PASSWORD = 'admin'; // Hardcoded password

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!isAuthenticated || loading) return;

      setLoading(true);
      setError(null);
      try {
        console.log('Fetching data for AdminPage...');
        const [products, customers, orders, orderItems, carts, cartItems, payments] = await Promise.all([
          axios.get('http://localhost:3000/api/products'),
          axios.get('http://localhost:3000/api/customers'),
          axios.get('http://localhost:3000/api/customers/1/orders'),
          axios.get('http://localhost:3000/api/order-items'),
          axios.get('http://localhost:3000/api/carts'),
          axios.get('http://localhost:3000/api/cart-items'),
          axios.get('http://localhost:3000/api/payments'),
        ]);

        if (isMounted) {
          setData({
            products: products.data,
            customers: customers.data,
            orders: orders.data,
            orderItems: orderItems.data,
            carts: carts.data,
            cartItems: cartItems.data,
            payments: payments.data,
          });
          console.log('Data fetched successfully:', { products: products.data.length, customers: customers.data.length });
        }
      } catch (err) {
        console.error('AdminPage fetch error:', err.message, err.response?.data);
        if (isMounted) {
          setError(`Failed to fetch data: ${err.message}`);
          toast.error(`Failed to load admin data: ${err.message}`);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    // Cleanup to prevent memory leaks
    return () => { isMounted = false; };
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('Access granted!');
    } else {
      toast.error('Incorrect password!');
    }
  };

  const renderTable = (dataArray, headers) => {
    if (!dataArray || dataArray.length === 0) return <p>No data available</p>;

    return (
      <Table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <TableHeader key={index}>{header}</TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataArray.map((item, index) => (
            <TableRow key={index}>
              {Object.values(item).map((value, i) => (
                <TableCell key={i}>{value !== null ? value.toString() : 'N/A'}</TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </Table>
    );
  };

  const tabData = {
    products: {
      data: data.products || [],
      headers: ['product_id', 'name', 'description', 'price', 'color', 'size', 'brand_id', 'category_id', 'stock_quantity', 'image_url', 'brand_name', 'category_name', 'image_filename'],
    },
    customers: {
      data: data.customers || [],
      headers: ['customer_id', 'first_name', 'last_name', 'email', 'password', 'address', 'phone'],
    },
    orders: {
      data: data.orders || [],
      headers: ['order_id', 'customer_id', 'order_date', 'total_amount', 'order_status', 'product_id', 'quantity', 'price', 'product_name'],
    },
    orderItems: {
      data: data.orderItems || [],
      headers: ['order_item_id', 'order_id', 'product_id', 'quantity', 'price'],
    },
    carts: {
      data: data.carts || [],
      headers: ['cart_id', 'customer_id'],
    },
    cartItems: {
      data: data.cartItems || [],
      headers: ['cart_item_id', 'cart_id', 'product_id', 'quantity'],
    },
    payments: {
      data: data.payments || [],
      headers: ['payment_id', 'customer_id', 'order_id', 'amount', 'payment_date', 'payment_method', 'payment_status'],
    },
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Loader2 size={60} className="animate-spin text-gray-500" />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <>
        <Navbar cartItemCount={0} />
        <ErrorMessage>{error}</ErrorMessage>
      </>
    );
  }

  return (
    <>
      <Navbar cartItemCount={0} />
      {!isAuthenticated ? (
        <PasswordContainer>
          <ToastContainer position="top-right" autoClose={3000} />
          <Heading>Admin Login</Heading>
          <form onSubmit={handlePasswordSubmit}>
            <PasswordInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            <SubmitButton type="submit">Submit</SubmitButton>
          </form>
        </PasswordContainer>
      ) : (
        <Container>
          <ToastContainer position="top-right" autoClose={3000} />
          <Heading>Admin Dashboard</Heading>
          <Tabs>
            {Object.keys(tabData).map((tab) => (
              <Tab
                key={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Tab>
            ))}
          </Tabs>
          <TableContainer>
            {renderTable(tabData[activeTab].data, tabData[activeTab].headers)}
          </TableContainer>
        </Container>
      )}
    </>
  );
};

export default AdminPage;