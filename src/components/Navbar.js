import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ShoppingCart } from 'lucide-react';

const Nav = styled.nav`
  background-color: #1a202c;
  padding: 20px 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: #fff;
  font-size: 1.8rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: -0.02em;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const NavLink = styled(Link)`
  color: #edf2f7;
  font-size: 1.1rem;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #ff7e67;
  }
`;

const CartIconContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const CartCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ff7e67;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Corrected: Defined NavItem using NavLink
const NavItem = NavLink;

const Navbar = ({ cartItemCount = 0 }) => { // Default to 0 if undefined
  console.log('Navbar rendered, cartItemCount:', cartItemCount);
  return (
    <Nav>
      <NavContainer>
        <Logo to="/">ShoeStore</Logo>
        <NavLinks>
          <NavItem to="/">Home</NavItem>
          <NavItem to="/products">Products</NavItem>
          <NavItem to="/member-enrollment">Members</NavItem>
          <NavItem to="/AdminPage">Admin</NavItem>
          <NavLink to="/cart">
            <CartIconContainer>
              <ShoppingCart size={24} />
              {cartItemCount > 0 && <CartCount>{cartItemCount}</CartCount>}
            </CartIconContainer>
          </NavLink>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;