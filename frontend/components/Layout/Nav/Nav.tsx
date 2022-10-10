/* eslint-disable @next/next/no-img-element */
import classNames from 'classnames';
import React from 'react';

import { useInk } from '../../../lib/useInk';
import { Button } from '../../Button';
import { useStartGameFunc } from '../../../hooks/useGameContract';
import { useRouter } from 'next/router';

export const Nav = () => {
  const classes = classNames('transition ease-in-out py-1 w-full z-11 flex items-center justify-between fixed top-0');
  const { activeAccount } = useInk();
  const executeGame = useStartGameFunc();
  const router = useRouter();

  return (
    <header className="z-11">
      <nav className={classes}>
        <div className="py-2 px-4 lg:px-12 md:px-8 w-full">
          <div className="relative flex justify-end items-center ">
            <ul className="inset-y-0 flex items-center justify-between w-full">
              <li className="mr-3">
                <img
                  role="button"
                  src="/fish-2.svg"
                  alt="fish"
                  className="w-18 hover:cursor-pointer hover:opacity-80 transition-opacity duration-100 drop-shadow-md"
                  onClick={() => router.push('/')}
                />
              </li>
              {activeAccount && (
                <li className="mr-3">
                  <Button onClick={() => executeGame.send()} className="mr-3">
                    {executeGame.status === 'pending' ? 'Pending...' : 'Play Game'}
                  </Button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
