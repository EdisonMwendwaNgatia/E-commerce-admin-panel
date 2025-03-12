import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 1rem 2rem;
  text-align: center;
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Copyright = styled.p`
  margin: 0;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const FooterLink = styled.a`
  color: #6c757d;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: #495057;
    text-decoration: underline;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          &copy; {new Date().getFullYear()} Tivee Organics - Admin Panel. All rights reserved.
        </Copyright>
        <FooterLinks>
          <FooterLink href="#">Terms</FooterLink>
          <FooterLink href="#">Privacy</FooterLink>
          <FooterLink href="#">Support</FooterLink>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;