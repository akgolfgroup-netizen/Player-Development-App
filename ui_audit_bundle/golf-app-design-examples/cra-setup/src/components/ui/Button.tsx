import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles = {
  sm: css`
    padding: 8px 16px;
    font-size: 14px;
    height: 32px;
  `,
  md: css`
    padding: 12px 24px;
    font-size: 16px;
    height: 44px;
  `,
  lg: css`
    padding: 16px 32px;
    font-size: 18px;
    height: 52px;
  `,
};

const variantStyles = {
  primary: css`
    background-color: ${theme.colors.primary[700]};
    color: ${theme.colors.text.primary};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.primary[600]};
    }

    &:active:not(:disabled) {
      background-color: ${theme.colors.primary[800]};
    }
  `,
  secondary: css`
    background-color: transparent;
    color: ${theme.colors.primary[600]};
    border: 1px solid ${theme.colors.primary[700]};

    &:hover:not(:disabled) {
      background-color: rgba(27, 67, 50, 0.1);
    }
  `,
  gold: css`
    background: linear-gradient(135deg, ${theme.colors.gold[400]}, ${theme.colors.gold[300]});
    color: ${theme.colors.surface.black};
    box-shadow: ${theme.shadows.goldGlow};

    &:hover:not(:disabled) {
      box-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
      transform: translateY(-1px);
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${theme.colors.text.secondary};

    &:hover:not(:disabled) {
      color: ${theme.colors.text.primary};
      text-decoration: underline;
    }
  `,
};

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $isLoading: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-family: inherit;
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  white-space: nowrap;

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $isLoading }) =>
    $isLoading &&
    css`
      pointer-events: none;
      opacity: 0.7;
    `}
`;

const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $isLoading={isLoading}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </StyledButton>
  );
};
