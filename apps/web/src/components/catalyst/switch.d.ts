import { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface SwitchGroupProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode;
}

export interface SwitchFieldProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode;
}

export interface SwitchProps {
  name?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  color?: string;
  className?: string;
}

export function SwitchGroup(props: SwitchGroupProps): JSX.Element;
export function SwitchField(props: SwitchFieldProps): JSX.Element;
export function Switch(props: SwitchProps): JSX.Element;
