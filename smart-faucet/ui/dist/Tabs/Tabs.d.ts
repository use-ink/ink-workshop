import React, { PropsWithChildren } from 'react';
interface Props {
    className?: string;
}
export declare const Tabs: React.FC<PropsWithChildren<Props>>;
interface TabProps {
    className?: string;
    isSelected: boolean;
    onClick: () => void;
}
export declare const Tab: React.FC<PropsWithChildren<TabProps>>;
export {};
