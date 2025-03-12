import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import styled from "styled-components";

// Styled components
const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #2a3f54 0%, #1a2a38 100%);
  padding: 0.8rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  color: white;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 24px;
    background-color: #4ecdc4;
    margin-right: 10px;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
`;

const NavMenu = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1.5rem;
`;

const NavItem = styled.li`
  padding: 0;
`;

const NavLink = styled(Link)`
  color: #e0e0e0;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const LogoutButton = styled.button`
  background-color: transparent;
  color: #e0e0e0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <NavbarContainer>
      <Logo>Admin Panel</Logo>
      <NavMenu>
        <NavItem>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </NavItem>
        <NavItem>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </NavItem>
      </NavMenu>
    </NavbarContainer>
  );
};

export default Navbar;