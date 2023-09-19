import React, { DetailedHTMLProps, InputHTMLAttributes } from 'react';
interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    value: string;
    onDigitChange: (digits: bigint) => void;
}
export declare const BigIntInputField: React.FC<Props>;
export {};
