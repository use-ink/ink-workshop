import { ClassNameable } from '..';
import React from 'react';
type Props = ClassNameable & {
    onChange: (v: number) => void;
    value: number;
    placeholder?: string;
    disabled?: boolean;
    max: number;
    min?: number;
};
export declare const NumberInput: React.FC<Props>;
export {};
