import React, { PropsWithChildren } from 'react';
type View = 'off' | 'contract' | 'wallet';
interface ScreenPosition {
    top: number;
    left: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
}
export interface UIState {
    showScreen: boolean;
    showClearContract: boolean;
    setShowClearContract: (show: boolean) => void;
    setView: (view: View) => void;
    view: View;
    playAudio: boolean;
    setPlayAudio: (play: boolean) => void;
    playLedSwitch: () => void;
    setScreenPosition: (pos: ScreenPosition) => void;
    screenPosition: ScreenPosition | undefined;
}
export declare const UIContext: React.Context<UIState>;
export declare const UIProvider: React.FC<PropsWithChildren>;
export {};
