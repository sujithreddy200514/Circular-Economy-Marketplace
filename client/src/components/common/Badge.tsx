import React from 'react';
import styled from 'styled-components';

type BadgeColor = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  size?: BadgeSize;
  pill?: boolean;
  className?: string;
}

const getColorStyles = (color: BadgeColor, theme: any) => {
  switch (color) {
    case 'primary':
      return {
        background: theme.colors.primary.light,
        color: theme.colors.primary.dark,
        borderColor: theme.colors.primary.main
      };
    case 'secondary':
      return {
        background: theme.colors.secondary.light,
        color: theme.colors.secondary.dark,
        borderColor: theme.colors.secondary.main
      };
    case 'success':
      return {
        background: `${theme.colors.success}20`,
        color: theme.colors.success,
        borderColor: theme.colors.success
      };
    case 'error':
      return {
        background: `${theme.colors.error}20`,
        color: theme.colors.error,
        borderColor: theme.colors.error
      };
    case 'warning':
      return {
        background: `${theme.colors.warning}20`,
        color: theme.colors.warning,
        borderColor: theme.colors.warning
      };
    case 'info':
      return {
        background: `${theme.colors.info}20`,
        color: theme.colors.info,
        borderColor: theme.colors.info
      };
    default:
      return {
        background: theme.colors.background.default,
        color: theme.colors.text.secondary,
        borderColor: theme.colors.border
      };
  }
};

const getSizeStyles = (size: BadgeSize) => {
  switch (size) {
    case 'small':
      return {
        fontSize: '0.75rem',
        padding: '0.1rem 0.5rem'
      };
    case 'large':
      return {
        fontSize: '1rem',
        padding: '0.3rem 0.8rem'
      };
    default:
      return {
        fontSize: '0.875rem',
        padding: '0.2rem 0.6rem'
      };
  }
};

const BadgeWrapper = styled.span<{
  $color: BadgeColor;
  $size: BadgeSize;
  $pill: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.$pill ? '50px' : props.theme.borderRadius.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  border: 1px solid;
  
  ${props => {
    const colorStyles = getColorStyles(props.$color, props.theme);
    const sizeStyles = getSizeStyles(props.$size);
    
    return `
      background-color: ${colorStyles.background};
      color: ${colorStyles.color};
      border-color: ${colorStyles.borderColor};
      font-size: ${sizeStyles.fontSize};
      padding: ${sizeStyles.padding};
    `;
  }}
`;

const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'default',
  size = 'medium',
  pill = false,
  className
}) => {
  return (
    <BadgeWrapper
      $color={color}
      $size={size}
      $pill={pill}
      className={className}
    >
      {children}
    </BadgeWrapper>
  );
};

export default Badge; 
