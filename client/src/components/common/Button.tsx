import React, { ReactNode, ElementType } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text' | 'accent' | 'success' | 'error';

interface ButtonStyleProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
  $animateOnHover?: boolean;
  disabled?: boolean;
}

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  as?: ElementType;
  to?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  [x: string]: any;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isLoading?: boolean;
  animateOnHover?: boolean;
}

// Size styles
const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return css`
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      `;
    case 'large':
      return css`
        padding: 0.875rem 2rem;
        font-size: 1.1rem;
      `;
    case 'medium':
    default:
      return css`
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      `;
  }
};

// Variant styles
const getVariantStyles = (variant: ButtonVariant, theme: any) => {
  const successColor = theme.colors.feedback?.success || theme.colors.success || '#4CAF50';
  const errorColor = theme.colors.feedback?.error || theme.colors.error || '#F44336';

  switch (variant) {
    case 'primary':
      return css`
        background-color: ${theme.colors.primary.main};
        color: white;
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary.dark};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${theme.colors.secondary.main};
        color: white;
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.secondary.dark};
        }
      `;
    case 'outlined':
      return css`
        background-color: transparent;
        border: 1px solid ${theme.colors.primary.main};
        color: ${theme.colors.primary.main};
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary.light}20;
        }
      `;
    case 'text':
      return css`
        background-color: transparent;
        color: ${theme.colors.primary.main};
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary.light}10;
        }
      `;
    case 'accent':
      return css`
        background-color: ${theme.colors.accent.main};
        color: ${theme.colors.accent.contrastText};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.accent.dark};
        }
      `;
    case 'success':
      return css`
        background-color: ${successColor};
        color: white;
        &:hover:not(:disabled) {
          background-color: #388e3c;
        }
      `;
    case 'error':
      return css`
        background-color: ${errorColor};
        color: white;
        &:hover:not(:disabled) {
          background-color: #d32f2f;
        }
      `;
    default:
      return css`
        background-color: ${theme.colors.primary.main};
        color: white;
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary.dark};
        }
      `;
  }
};

const StyledButton = styled.button<ButtonStyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  &:hover:not(:disabled) {
    ${({ $animateOnHover = true }) => $animateOnHover && css`
    transform: translateY(-1px) scale(1.03);
    `}
  }

  &:active:not(:disabled) {
    ${({ $animateOnHover = true }) => $animateOnHover && css`
    transform: scale(0.98);
    `}
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.disabled};
    color: ${({ theme }) => theme.colors.text.disabled};
  }
  
  ${({ $variant = 'primary', theme }) => getVariantStyles($variant, theme)}
  ${({ $size = 'medium' }) => getSizeStyles($size)}
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  as,
  to,
  startIcon,
  endIcon,
  isLoading = false,
  animateOnHover = true,
  ...rest
}) => {
  // If 'to' prop is provided and 'as' is not, use Link as the component
  const Component = to && !as ? Link : as || 'button';
  
  return (
    <StyledButton
      as={Component}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $animateOnHover={animateOnHover}
      disabled={disabled || isLoading}
      to={to}
      {...rest}
    >
      {isLoading && <LoadingSpinner />}
      {!isLoading && startIcon && <span>{startIcon}</span>}
      {children}
      {!isLoading && endIcon && <span>{endIcon}</span>}
    </StyledButton>
  );
};

export default Button; 
