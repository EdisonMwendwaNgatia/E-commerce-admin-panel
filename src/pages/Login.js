import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import styled from "styled-components";

// Styled components
const LoginPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ef 100%);
  padding: 1rem;
`;

const LoginCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  text-align: center;
`;

const Logo = styled.div`
  margin-bottom: 1.5rem;
  
  &::before {
    content: '';
    display: inline-block;
    width: 48px;
    height: 48px;
    background-color: #4ecdc4;
    margin-bottom: 1rem;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
`;

const BrandTitle = styled.h1`
  color: #2a3f54;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  font-weight: 700;
`;

const LoginTitle = styled.h2`
  color: #6c757d;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 2rem;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
  text-align: left;
`;

const InputLabel = styled.label`
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4ecdc4;
    box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
  }
`;

const LoginButton = styled.button`
  background-color: #4ecdc4;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.85rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: #3dbeb6;
  }
`;

const ForgotPasswordButton = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;
  
  &:hover {
    color: #4ecdc4;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  margin-top: 1rem;
  font-size: 0.85rem;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setError("Failed to send reset email. Please ensure the email is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginPageContainer>
      <LoginCard>
        <Logo />
        <BrandTitle>Tivee Organics</BrandTitle>
        <LoginTitle>Admin Panel</LoginTitle>
        
        <LoginForm onSubmit={handleLogin}>
          <InputGroup>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoFocus
            />
          </InputGroup>
          
          <InputGroup>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </InputGroup>
          
          <LoginButton type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </LoginButton>
        </LoginForm>
        
        <ForgotPasswordButton type="button" onClick={handleForgotPassword} disabled={loading}>
          Forgot your password?
        </ForgotPasswordButton>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginCard>
    </LoginPageContainer>
  );
};

export default Login;