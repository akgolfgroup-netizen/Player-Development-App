import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const InputWrapper = styled.div`
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-size: ${theme.fontSize.label};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing[2]};
`;

const InputContainer = styled.div<{ $hasError: boolean; $disabled: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${theme.colors.surface.dark};
  border: 1px solid ${({ $hasError }) =>
    $hasError ? theme.colors.error : theme.colors.surface.border};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.normal};

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}

  &:focus-within {
    border-color: ${({ $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.primary[600]};
    box-shadow: 0 0 0 3px ${({ $hasError }) =>
      $hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(45, 106, 79, 0.2)'};
  }
`;

const IconWrapper = styled.div<{ $position: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  color: ${theme.colors.text.muted};
  flex-shrink: 0;

  ${({ $position }) =>
    $position === 'left'
      ? css`
          padding-left: ${theme.spacing[4]};
        `
      : css`
          padding-right: ${theme.spacing[4]};
        `}
`;

const StyledInput = styled.input<{ $hasLeftIcon: boolean; $hasRightIcon: boolean }>`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: ${theme.fontSize.bodyLg};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  min-height: 48px;

  ${({ $hasLeftIcon }) =>
    $hasLeftIcon &&
    css`
      padding-left: 0;
    `}

  ${({ $hasRightIcon }) =>
    $hasRightIcon &&
    css`
      padding-right: 0;
    `}

  &::placeholder {
    color: ${theme.colors.text.muted};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const HelperText = styled.span<{ $isError: boolean }>`
  display: block;
  font-size: ${theme.fontSize.caption};
  color: ${({ $isError }) =>
    $isError ? theme.colors.error : theme.colors.text.muted};
  margin-top: ${theme.spacing[2]};
`;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  disabled = false,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <InputWrapper>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <InputContainer $hasError={!!error} $disabled={disabled}>
        {leftIcon && <IconWrapper $position="left">{leftIcon}</IconWrapper>}
        <StyledInput
          id={inputId}
          disabled={disabled}
          $hasLeftIcon={!!leftIcon}
          $hasRightIcon={!!rightIcon}
          {...props}
        />
        {rightIcon && <IconWrapper $position="right">{rightIcon}</IconWrapper>}
      </InputContainer>
      {(error || helperText) && (
        <HelperText $isError={!!error}>{error || helperText}</HelperText>
      )}
    </InputWrapper>
  );
};

// Search Input variant
interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {}

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const SearchInput: React.FC<SearchInputProps> = (props) => {
  return <Input leftIcon={<SearchIcon />} placeholder="Search..." {...props} />;
};
