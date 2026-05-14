import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 2rem;
`;

const LoginCard = styled(motion.div)`
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.07);
`;

const Title = styled.h1`
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary.main};
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
`;

const PasswordInput = styled(Input)`
  width: 100%;
  padding-right: 2.75rem;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: transparent;
  border: 0;
  transform: translateY(-50%);
  cursor: pointer;

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.primary.main};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
    border-radius: 50%;
  }
`;

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${({ theme }) => theme.colors.primary.main};
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.dark};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }
`;

const ForgotPassword = styled(Link)`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.primary.main};
  text-decoration: none;
  align-self: flex-end;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const BottomText = styled.p`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  a {
    color: ${({ theme }) => theme.colors.primary.main};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Call the actual login API endpoint
      const response = await api.post('/api/auth/login', {
        email,
        password
      });
      
      // Extract user data and token from response
      const userData = response.data?.user || {};
      const token = response.data?.token || 'mock-token';
      
      // Login the user
      login({
        id: userData.id || 1,
        name: userData.name || 'User',
        email: userData.email || email,
        role: userData.role || 'company',
        avatar: userData.avatar || '',
        token: token
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Title>Welcome Back</Title>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <PasswordInputWrapper>
              <PasswordInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
                    <path d="M9.9 4.2A9.9 9.9 0 0 1 12 4c5 0 9.3 4.1 10.8 8a12.7 12.7 0 0 1-3.1 4.4" />
                    <path d="M6.5 6.5A12.8 12.8 0 0 0 1.2 12C2.7 15.9 7 20 12 20a10 10 0 0 0 4.2-.9" />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1.2 12C2.7 8.1 7 4 12 4s9.3 4.1 10.8 8c-1.5 3.9-5.8 8-10.8 8s-9.3-4.1-10.8-8Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </PasswordToggle>
            </PasswordInputWrapper>
            <ForgotPassword to="/forgot-password">Forgot password?</ForgotPassword>
          </FormGroup>
          
          <RememberMeContainer>
            <Checkbox
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <CheckboxLabel htmlFor="rememberMe">Remember me</CheckboxLabel>
          </RememberMeContainer>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>
        
        <BottomText>
          Don't have an account? <Link to="/register">Sign up</Link>
        </BottomText>
      </LoginCard>
    </PageContainer>
  );
};

export default LoginPage; 
