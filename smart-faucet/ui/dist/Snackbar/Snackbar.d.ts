import React from 'react';
type NotificationLevel = 'error' | 'info' | 'success' | 'warning';
type Props = {
    className?: string;
    message: string;
    show: boolean;
    type: NotificationLevel;
};
export declare const Snackbar: React.FC<Props>;
export {};
