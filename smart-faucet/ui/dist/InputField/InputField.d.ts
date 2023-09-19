import React, { ChangeEventHandler, DetailedHTMLProps, InputHTMLAttributes } from 'react';
interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    onChange: ChangeEventHandler<HTMLInputElement>;
    value: string;
    placeholder?: string;
    disabled?: boolean;
}
export declare const InputField: React.FC<Props>;
export {};
