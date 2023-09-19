import React, { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from 'react';
type ButtomHTMLProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
export type ButtonProps = PropsWithChildren<ButtomHTMLProps>;
export declare const Button: React.FC<ButtonProps>;
export {};
