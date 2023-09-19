import React, { AnchorHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from 'react';
type LinkHTMLProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
type LinkProps = PropsWithChildren<LinkHTMLProps>;
export declare const Link: React.FC<LinkProps>;
export {};
