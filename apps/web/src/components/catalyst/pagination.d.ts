import { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface PaginationProps extends ComponentPropsWithoutRef<'nav'> {
  'aria-label'?: string;
  children?: ReactNode;
}

export interface PaginationPreviousProps {
  href?: string | null;
  className?: string;
  children?: ReactNode;
}

export interface PaginationNextProps {
  href?: string | null;
  className?: string;
  children?: ReactNode;
}

export interface PaginationListProps extends ComponentPropsWithoutRef<'span'> {
  children?: ReactNode;
}

export interface PaginationPageProps {
  href?: string;
  className?: string;
  current?: boolean;
  children?: ReactNode;
}

export interface PaginationGapProps extends ComponentPropsWithoutRef<'span'> {
  children?: ReactNode;
}

export function Pagination(props: PaginationProps): JSX.Element;
export function PaginationPrevious(props: PaginationPreviousProps): JSX.Element;
export function PaginationNext(props: PaginationNextProps): JSX.Element;
export function PaginationList(props: PaginationListProps): JSX.Element;
export function PaginationPage(props: PaginationPageProps): JSX.Element;
export function PaginationGap(props: PaginationGapProps): JSX.Element;
