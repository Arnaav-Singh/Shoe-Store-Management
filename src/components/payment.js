import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IndianRupee } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import NavBar from './Navbar';

// --- Reusable Styles ---
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const PaymentsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f2f5 0%, #e0e0e0 100%);
  font-family: 'Inter', sans-serif;
  padding: 40px 0;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 40px;
  color: #2c3e50;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const PaymentCard = styled(motion.div)`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  padding: 30px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  margin-bottom: 40px;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  }
`;

const RecordPaymentButton = styled.button`
  padding: 14px 32px;
  background: linear-gradient(to right, #10b981, #3b82f6);
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 25px;
  width: 100%;
  max-width: 350px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 18px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(59, 130, 246, 0.3);
  }
`;

const PaymentList = styled.div`
  margin-top: 60px;
  width: 100%;
`;

const PaymentListTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #2c3e50;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
`;

const DateGroupTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 20px 0 10px;
  color: #34495e;
  text-align: left;
`;

const NoPayments = styled.p`
  text-align: center;
  color: #9ca3af;
  font-size: 1.15rem;
  padding: 25px;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  margin-top: 20px;
`;

const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  margin-top: 10px;
`;

const PaymentItem = styled(motion.div)`
  padding: 20px;
  border-radius: 12px;
  background-color: #fff;
  border: 1px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const MemberName = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
`;

const PaymentDetails = styled.div`
  font-size: 1rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Loading = styled.div`
  text-align: center;
  font-size: 1.25rem;
  padding: 40px;
`;

const Error = styled.div`
  text-align: center;
  font-size: 1.25rem;
  color: #dc2626;
  padding: 40px;
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  margin: 15px 0;
  width: 100%;
  max-width: 350px;
  background-color: #fff;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  margin: 15px 0;
  width: 100%;
  max-width: 350px;
  background-color: #fff;
`;

const Payments = () => {
  const [newmembers, setNewmembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 16));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch newmembers
        const newmembersResponse = await axios.get('http://localhost:5050/api/newmembers');
        console.log('Fetched newmembers:', newmembersResponse.data);
        setNewmembers(newmembersResponse.data);

        // Fetch all payments
        const paymentsResponse = await axios.get('http://localhost:5050/api/payments');
        console.log('Fetched payments:', paymentsResponse.data);
        setPayments(paymentsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRecordPayment = async () => {
    if (!selectedMemberId || isNaN(parseInt(selectedMemberId, 10))) {
      setError('Please select a valid member.');
      return;
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }
    if (!paymentDate) {
      setError('Please select a payment date.');
      return;
    }

    const memberId = parseInt(selectedMemberId, 10);
    const memberExists = newmembers.some((m) => m.id === memberId);
    if (!memberExists) {
      setError('Selected member does not exist.');
      return;
    }

    const payload = {
      member_id: memberId,
      amount: parseFloat(amount),
      payment_method: paymentMethod,
      payment_date: new Date(paymentDate).toISOString(),
    };
    console.log('Sending payment payload:', payload);

    try {
      const response = await axios.post('http://localhost:5050/api/payments', payload);
      console.log('Payment recorded:', response.data);
      setPayments([response.data, ...payments]);
      setSelectedMemberId('');
      setAmount('');
      setPaymentMethod('');
      setPaymentDate(new Date().toISOString().slice(0, 16));
      setError(null);
    } catch (err) {
      console.error('Error recording payment:', JSON.stringify(err.response?.data, null, 2));
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.map((e) => e.msg).join(', ') ||
        'Failed to record payment';
      setError(errorMessage);
    }
  };

  // Group payments by date
  const groupPaymentsByDate = () => {
    const grouped = {};
    payments.forEach((payment) => {
      const date = format(parseISO(payment.payment_date), 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(payment);
    });
    return grouped;
  };

  const groupedPayments = groupPaymentsByDate();

  if (loading) {
    return (
      <PaymentsContainer>
        <NavBar />
        <Container>
          <Loading>Loading Payments...</Loading>
        </Container>
      </PaymentsContainer>
    );
  }

  if (error) {
    return (
      <PaymentsContainer>
        <NavBar />
        <Container>
          <Error>Error: {error}</Error>
        </Container>
      </PaymentsContainer>
    );
  }

  return (
    <PaymentsContainer>
      <NavBar />
      <Container>
        <Title>Payments</Title>

        <PaymentCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
          >
            <option value="">Select a Member</option>
            {newmembers.map((newmember) => (
              <option key={newmember.id} value={newmember.id}>
                {newmember.name}
              </option>
            ))}
          </Select>
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
          />
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select Payment Method</option>
            <option value="cash">Cash</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="online">Online</option>
          </Select>
          <Input
            type="datetime-local"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
          <RecordPaymentButton onClick={handleRecordPayment}>
            Record Payment
          </RecordPaymentButton>
        </PaymentCard>

        <PaymentList>
          <PaymentListTitle>All Payment Records</PaymentListTitle>
          {Object.keys(groupedPayments).length === 0 ? (
            <NoPayments>No payment records.</NoPayments>
          ) : (
            Object.keys(groupedPayments)
              .sort((a, b) => new Date(b) - new Date(a))
              .map((date) => (
                <div key={date}>
                  <DateGroupTitle>{format(parseISO(date), 'PPP')}</DateGroupTitle>
                  <PaymentGrid>
                    <AnimatePresence>
                      {groupedPayments[date].map((payment) => (
                        <motion.div
                          key={payment.id}
                          initial={{ opacity: 0, x: -20, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 20, scale: 0.9 }}
                          transition={{ duration: 0.3, type: 'spring', stiffness: 120 }}
                        >
                          <PaymentItem>
                            <MemberName>{payment.name}</MemberName>
                            <PaymentDetails>
                              <IndianRupee size={18} />
                              {(parseFloat(payment.amount) || 0).toFixed(2)} - {payment.payment_method} -{' '}
                              {format(parseISO(payment.payment_date), 'h:mm a')}
                            </PaymentDetails>
                          </PaymentItem>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </PaymentGrid>
                </div>
              ))
          )}
        </PaymentList>
      </Container>
    </PaymentsContainer>
  );
};

export default Payments;