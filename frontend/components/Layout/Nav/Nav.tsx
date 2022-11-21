/* eslint-disable @next/next/no-img-element */
import classNames from 'classnames';
import React from 'react';

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const GameStatus = dynamic(() => import('../../GameStatus').then((mod) => mod.GameStatus), {
  ssr: false,
});

export const Nav = () => {
  const classes = classNames('transition ease-in-out py-1 w-full z-11 flex items-center justify-between fixed top-0');
  const router = useRouter();

  return (
    <header className="z-11">
      <nav className={classes}>
        <div className="py-2 px-3 w-full">
          <div className="relative flex justify-end items-center ">
            <div className="inset-y-0 flex items-start justify-between w-full">
              <li className="mr-3">
                <img
                  role="button"
                  src="/fish-2.svg"
                  alt="fish"
                  className="w-16 hover:cursor-pointer hover:opacity-80 transition-opacity duration-100 drop-shadow-md"
                  onClick={() => router.push('/')}
                />
              </li>
              <ul className="inset-y-0 flex items- justify-end">
                <li>
                  <GameStatus />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
