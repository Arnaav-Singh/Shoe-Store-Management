import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import axios from 'axios';
import {
    IdCard,
    Mail,
    Home,
    Phone,
    Lock,
} from 'lucide-react';
import NavBar from './Navbar';

// --- Reusable Styles ---
const Container = styled.div`
    max-width: 900px;
    margin: 0 auto;
    padding: 0 16px;
`;

// --- Member Enrollment-Specific Styles ---
const MemberEnrollmentContainer = styled.div`
    min-height: 100vh;
    background: linear-gradient(to bottom, #ffffff, #f8fafc);
    font-family: 'Roboto', sans-serif;
    padding: 24px 0;
`;

const Title = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin: 24px 0 32px;
    color: #1e293b;
`;

const Form = styled.form`
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 32px;
    margin: 0 auto;
    max-width: 600px;
`;

const FormGroup = styled.div`
    margin-bottom: 16px;
`;

const Label = styled.label`
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: #475569;
    margin-bottom: 6px;
`;

const InputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const InputIcon = styled.span`
    position: absolute;
    left: 12px;
    color: #94a3b8;
    top: 50%;
    transform: translateY(-50%);
`;

const Input = styled.input.withConfig({
    shouldForwardProp: (prop) => !['error'].includes(prop),
})`
    width: 100%;
    padding: 10px 12px 10px 40px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    color: #1e293b;
    background: #f8fafc;
    transition: all 0.2s ease;
    &:focus {
        outline: none;
        border-color: #3b82f6;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    ${({ error }) => error && css`
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    `}
`;

const Button = styled.button`
    padding: 12px;
    background: #3b82f6;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    transition: all 0.2s ease;
    &:hover {
        background: #2563eb;
        transform: translateY(-1px);
    }
    &:disabled {
        background: #94a3b8;
        cursor: not-allowed;
        transform: none;
    }
`;

const ErrorMessage = styled.div`
    color: #ef4444;
    font-size: 0.8rem;
    margin-top: 4px;
`;

const Loading = styled.div`
    text-align: center;
    font-size: 1rem;
    padding: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #475569;
`;

const Error = styled.div`
    text-align: center;
    font-size: 1rem;
    color: #ef4444;
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
`;

const RetryButton = styled.button`
    padding: 8px 16px;
    background: #b8860b;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    &:hover {
        background: #916807;
    }
`;

const SuccessModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 24px;
    max-width: 360px;
    text-align: center;
    z-index: 1000;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
`;

const ModalTitle = styled.h3`
    font-size: 1.25rem;
    color: #1e293b;
    margin-bottom: 12px;
`;

const ModalButton = styled.button`
    padding: 8px 16px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    &:hover {
        background: #2563eb;
    }
`;

const MemberEnrollment = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        address: '',
        phone: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
        if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = 'Enter a valid email';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.phone && !formData.phone.match(/^\+?\d{10,15}$/)) newErrors.phone = 'Enter a valid phone number';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setApiError(null);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/customers`, {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
                address: formData.address || null,
                phone: formData.phone || null,
            });
            setShowSuccess(true);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                address: '',
                phone: '',
            });
        } catch (err) {
            console.error('Enroll customer error:', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
            });
            setApiError(err.response?.data?.error || 'Failed to enroll customer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <MemberEnrollmentContainer>
            <NavBar />
            <Container>
                <Loading>
                    <Lock size={20} />
                    Enrolling customer...
                </Loading>
            </Container>
        </MemberEnrollmentContainer>
    );

    if (apiError) return (
        <MemberEnrollmentContainer>
            <NavBar />
            <Container>
                <Error>
                    <Lock size={20} />
                    Error: {apiError}
                    <RetryButton onClick={handleSubmit}>Retry</RetryButton>
                </Error>
            </Container>
        </MemberEnrollmentContainer>
    );

    return (
        <MemberEnrollmentContainer>
            <NavBar />
            <Container>
                <Title>Customer Enrollment</Title>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="firstName">First Name</Label>
                        <InputWrapper>
                            <InputIcon><IdCard size={16} /></InputIcon>
                            <Input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                error={errors.firstName}
                            />
                        </InputWrapper>
                        {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="lastName">Last Name</Label>
                        <InputWrapper>
                            <InputIcon><IdCard size={16} /></InputIcon>
                            <Input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                error={errors.lastName}
                            />
                        </InputWrapper>
                        {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <InputWrapper>
                            <InputIcon><Mail size={16} /></InputIcon>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                        </InputWrapper>
                        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <InputWrapper>
                            <InputIcon><Lock size={16} /></InputIcon>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                autoComplete="new-password"
                            />
                        </InputWrapper>
                        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="address">Address (Optional)</Label>
                        <InputWrapper>
                            <InputIcon><Home size={16} /></InputIcon>
                            <Input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                error={errors.address}
                            />
                        </InputWrapper>
                        {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <InputWrapper>
                            <InputIcon><Phone size={16} /></InputIcon>
                            <Input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                error={errors.phone}
                            />
                        </InputWrapper>
                        {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                    </FormGroup>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Enrolling...' : 'Enroll Customer'}
                    </Button>
                </Form>
            </Container>
            {showSuccess && (
                <>
                    <ModalOverlay />
                    <SuccessModal>
                        <ModalTitle>Customer Enrolled Successfully!</ModalTitle>
                        <ModalButton onClick={() => setShowSuccess(false)}>Close</ModalButton>
                    </SuccessModal>
                </>
            )}
        </MemberEnrollmentContainer>
    );
};

export default MemberEnrollment;