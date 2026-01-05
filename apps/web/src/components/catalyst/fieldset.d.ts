import { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface FieldsetProps extends ComponentPropsWithoutRef<'fieldset'> {
  children?: ReactNode;
}

export interface LegendProps extends ComponentPropsWithoutRef<'legend'> {
  children?: ReactNode;
}

export interface FieldGroupProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode;
}

export interface FieldProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode;
}

export interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  children?: ReactNode;
  className?: string;
}

export interface DescriptionProps extends ComponentPropsWithoutRef<'p'> {
  children?: ReactNode;
  className?: string;
}

export interface ErrorMessageProps extends ComponentPropsWithoutRef<'p'> {
  children?: ReactNode;
  className?: string;
}

export function Fieldset(props: FieldsetProps): JSX.Element;
export function Legend(props: LegendProps): JSX.Element;
export function FieldGroup(props: FieldGroupProps): JSX.Element;
export function Field(props: FieldProps): JSX.Element;
export function Label(props: LabelProps): JSX.Element;
export function Description(props: DescriptionProps): JSX.Element;
export function ErrorMessage(props: ErrorMessageProps): JSX.Element;
