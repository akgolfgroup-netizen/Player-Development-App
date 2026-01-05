import { ComponentPropsWithoutRef, ReactNode, ForwardRefExoticComponent, RefAttributes } from 'react';

export interface InputGroupProps {
  children?: ReactNode;
}

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  'data-invalid'?: boolean;
}

export function InputGroup(props: InputGroupProps): JSX.Element;
export const Input: ForwardRefExoticComponent<InputProps & RefAttributes<HTMLInputElement>>;
