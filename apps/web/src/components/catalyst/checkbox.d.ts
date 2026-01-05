import { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface CheckboxGroupProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode;
}

export interface CheckboxFieldProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode;
}

export interface CheckboxProps {
  name?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  color?: string;
  className?: string;
  indeterminate?: boolean;
}

export function CheckboxGroup(props: CheckboxGroupProps): JSX.Element;
export function CheckboxField(props: CheckboxFieldProps): JSX.Element;
export function Checkbox(props: CheckboxProps): JSX.Element;
