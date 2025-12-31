import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  elevated?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const paddingSizes = {
  none: '0',
  sm: theme.spacing[3],
  md: theme.spacing[5],
  lg: theme.spacing[6],
};

const StyledCard = styled.div<{
  $elevated: boolean;
  $clickable: boolean;
  $padding: 'none' | 'sm' | 'md' | 'lg';
}>`
  background-color: ${({ $elevated }) =>
    $elevated ? theme.colors.surface.elevated : theme.colors.surface.card};
  border: 1px solid ${theme.colors.surface.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${({ $padding }) => paddingSizes[$padding]};
  box-shadow: ${({ $elevated }) =>
    $elevated ? theme.shadows.elevated : theme.shadows.card};
  transition: all ${theme.transitions.normal};

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;

      &:hover {
        border-color: ${theme.colors.primary[600]};
      }

      &:active {
        transform: scale(0.98);
      }
    `}
`;

export const Card: React.FC<CardProps> = ({
  children,
  elevated = false,
  onClick,
  padding = 'md',
  className,
}) => {
  return (
    <StyledCard
      $elevated={elevated}
      $clickable={!!onClick}
      $padding={padding}
      onClick={onClick}
      className={className}
    >
      {children}
    </StyledCard>
  );
};

// Stat Card variant
interface StatCardProps {
  value: string | number;
  label: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  icon?: React.ReactNode;
}

const StatCardContainer = styled(Card)`
  text-align: center;
  min-width: 140px;
`;

const StatIcon = styled.div`
  font-size: 24px;
  margin-bottom: ${theme.spacing[2]};
`;

const StatValue = styled.div`
  font-size: ${theme.fontSize.displayMd};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text.primary};
  font-family: 'JetBrains Mono', monospace;
`;

const StatLabel = styled.div`
  font-size: ${theme.fontSize.label};
  color: ${theme.colors.text.secondary};
  margin-top: ${theme.spacing[1]};
`;

const StatTrend = styled.div<{ $positive: boolean }>`
  font-size: ${theme.fontSize.bodyMd};
  font-weight: ${theme.fontWeight.medium};
  color: ${({ $positive }) =>
    $positive ? theme.colors.success : theme.colors.error};
  margin-top: ${theme.spacing[2]};
`;

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  trend,
  icon,
}) => {
  return (
    <StatCardContainer>
      {icon && <StatIcon>{icon}</StatIcon>}
      <StatValue>{value}</StatValue>
      <StatLabel>{label}</StatLabel>
      {trend && (
        <StatTrend $positive={trend.positive}>
          {trend.positive ? '↓' : '↑'} {trend.value}
        </StatTrend>
      )}
    </StatCardContainer>
  );
};
