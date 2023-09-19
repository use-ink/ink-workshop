import { ClassNameable } from '..';
import React from 'react';
import { EventRecord } from 'useink/core';
export interface Props extends ClassNameable {
    events?: EventRecord[];
}
export declare const Events: React.FC<Props>;
