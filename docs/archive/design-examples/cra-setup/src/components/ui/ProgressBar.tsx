import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
}

const sizes = {
  sm: '4px',
  md: '8px',
  lg: '12px',
};

const variantColors = {
  default: `linear-gradient(90deg, ${theme.colors.primary[700]}, ${theme.colors.primary[500]})`,
  success: theme.colors.success,
  warning: theme.colors.warning,
  error: theme.colors.error,
};

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[2]};
`;

const Label = styled.span`
  font-size: ${theme.fontSize.bodyMd};
  color: ${theme.colors.text.secondary};
`;

const Percentage = styled.span`
  font-size: ${theme.fontSize.bodyMd};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.text.primary};
  font-family: 'JetBrains Mono', monospace;
`;

const Track = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  width: 100%;
  height: ${({ $size }) => sizes[$size]};
  background-color: ${theme.colors.surface.border};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
`;

const fillAnimation = keyframes`
  from {
    transform: scaleX(0);
  }
`;

const Fill = styled.div<{
  $percentage: number;
  $variant: 'default' | 'success' | 'warning' | 'error';
  $size: 'sm' | 'md' | 'lg';
}>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background: ${({ $variant }) => variantColors[$variant]};
  border-radius: ${theme.borderRadius.full};
  transform-origin: left;
  animation: ${fillAnimation} 500ms ease-out;
  transition: width 300ms ease-out;
`;

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  variant = 'default',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <Container>
      {(label || showPercentage) && (
        <Header>
          {label && <Label>{label}</Label>}
          {showPercentage && <Percentage>{Math.round(percentage)}%</Percentage>}
        </Header>
      )}
      <Track $size={size}>
        <Fill $percentage={percentage} $variant={variant} $size={size} />
      </Track>
    </Container>
  );
};

// Strokes Gained Bar for golf stats
interface StrokesGainedBarProps {
  category: string;
  value: number;
  maxValue?: number;
}

const SGContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
`;

const SGLabel = styled.span`
  width: 96px;
  font-size: ${theme.fontSize.bodyMd};
  color: ${theme.colors.text.secondary};
  flex-shrink: 0;
`;

const SGTrack = styled.div`
  flex: 1;
  height: 24px;
  background-color: ${theme.colors.surface.border};
  border-radius: ${theme.borderRadius.sm};
  position: relative;
`;

const SGCenterLine = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: ${theme.colors.surface.card};
`;

const SGBar = styled.div<{ $percentage: number; $positive: boolean }>`
  position: absolute;
  top: 4px;
  bottom: 4px;
  border-radius: ${theme.borderRadius.sm};
  background-color: ${({ $positive }) =>
    $positive ? theme.colors.success : theme.colors.error};

  ${({ $positive, $percentage }) =>
    $positive
      ? `
          left: 50%;
          width: ${$percentage}%;
        `
      : `
          right: 50%;
          width: ${$percentage}%;
        `}
`;

const SGValue = styled.span<{ $positive: boolean }>`
  width: 48px;
  font-size: ${theme.fontSize.bodyMd};
  font-weight: ${theme.fontWeight.medium};
  font-family: 'JetBrains Mono', monospace;
  text-align: right;
  color: ${({ $positive }) =>
    $positive ? theme.colors.success : theme.colors.error};
  flex-shrink: 0;
`;

export const StrokesGainedBar: React.FC<StrokesGainedBarProps> = ({
  category,
  value,
  maxValue = 2,
}) => {
  const percentage = (Math.abs(value) / maxValue) * 50;
  const isPositive = value >= 0;

  return (
    <SGContainer>
      <SGLabel>{category}</SGLabel>
      <SGTrack>
        <SGCenterLine />
        <SGBar $percentage={percentage} $positive={isPositive} />
      </SGTrack>
      <SGValue $positive={isPositive}>
        {isPositive ? '+' : ''}
        {value.toFixed(1)}
      </SGValue>
    </SGContainer>
  );
};
