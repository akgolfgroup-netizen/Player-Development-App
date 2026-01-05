import { ComponentPropsWithoutRef, ReactNode, ForwardRefExoticComponent, RefAttributes } from 'react';

export interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'color'> {
  color?: string;
  outline?: boolean;
  plain?: boolean;
  href?: string;
  children?: ReactNode;
}

export const Button: ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>>;
export function TouchTarget(props: { children: ReactNode }): JSX.Element;
