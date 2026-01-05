import { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface LinkProps extends ComponentPropsWithoutRef<'a'> {
  href?: string;
  children?: ReactNode;
}

export function Link(props: LinkProps): JSX.Element;
