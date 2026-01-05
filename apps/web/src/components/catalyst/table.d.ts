import { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface TableProps extends ComponentPropsWithoutRef<'div'> {
  bleed?: boolean;
  dense?: boolean;
  grid?: boolean;
  striped?: boolean;
  children?: ReactNode;
}

export interface TableHeadProps extends ComponentPropsWithoutRef<'thead'> {
  children?: ReactNode;
}

export interface TableBodyProps extends ComponentPropsWithoutRef<'tbody'> {
  children?: ReactNode;
}

export interface TableRowProps extends ComponentPropsWithoutRef<'tr'> {
  href?: string;
  target?: string;
  title?: string;
  children?: ReactNode;
}

export interface TableHeaderProps extends ComponentPropsWithoutRef<'th'> {
  children?: ReactNode;
}

export interface TableCellProps extends ComponentPropsWithoutRef<'td'> {
  children?: ReactNode;
}

export function Table(props: TableProps): JSX.Element;
export function TableHead(props: TableHeadProps): JSX.Element;
export function TableBody(props: TableBodyProps): JSX.Element;
export function TableRow(props: TableRowProps): JSX.Element;
export function TableHeader(props: TableHeaderProps): JSX.Element;
export function TableCell(props: TableCellProps): JSX.Element;
