import React, { PropsWithChildren } from 'react';
type Props = {
    open: boolean;
    handleClose?: () => void;
    className?: string;
};
export declare const Modal: React.FC<PropsWithChildren<Props>>;
export {};
