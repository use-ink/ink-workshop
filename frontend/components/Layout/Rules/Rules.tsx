/* eslint-disable @next/next/no-img-element */
import React from 'react';

import { Modal } from '../../Modal';
import { useUI } from '../../../contexts/UIContext';
import { CodeBlock } from '../../CodeBlock';
import { FiUsers, FiClock } from 'react-icons/fi';

export const Rules = () => {
  const { showRules, setShowRules } = useUI();

  return (
    <Modal open={showRules} handleClose={() => setShowRules(false)}>
      <div className="bg-players-9 flex flex-col p-8 w-full max-w-2xl text-start overflow-y-scroll">
        <h3 className="text-2xl text-center">Game Rules</h3>
        <h4 className="text-lg text-white/90 mt-3 text-start">Objective</h4>
        <p className="text-md text-white/90 mt-1">
          The goal of the game is to paint the most squares on the board. You will compete other players by writing a
          smart contract in <span className="text-white font-fred tracking-lg">ink!</span> Points are awarded based on
          how many squares you paint, and much <i className="font-semibold">gas</i> and{' '}
          <i className="font-semibold">storage</i> you use.
        </p>

        <div className="flex items-end text-xs mt-6 gap-3">
          <span className="text-md text-white/90 flex items-end gap-2">
            <FiUsers size={18} /> 2-25
          </span>
          <span className="text-md text-white/90 flex items-end gap-2">
            <FiClock size={18} /> 45 minutes
          </span>
        </div>

        <h4 className="text-lg text-white/90 mt-6 text-start">Steps</h4>
        <ol className="list-decimal pl-4">
          <li className="text-md text-white/90 mt-1">
            You will write a smart contract called <i className="font-semibold">Player</i> and register it in the{' '}
            <i className="font-semibold">Game</i>. The starter code can be found{' '}
            <button
              onClick={() => window.open('https://github.com/paritytech/ink-workshop/tree/main/player', '_blank')}
              className="text-players-5 font-bold underline hover:text-players-5/80"
            >
              here
            </button>
            . You must create a plan to take over the board, but watch out - players can overpaint to steal points!
          </li>

          <li className="text-md text-white/90 mt-1">
            After you have compiled your contract you must deploy it on{' '}
            <button
              onClick={() =>
                window.open(
                  'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-contracts-rpc.polkadot.io#/explorer',
                  '_blank',
                )
              }
              className="text-players-5 font-bold underline hover:text-players-5/80"
            >
              Contracts on Rococo
            </button>
            . You will need some tokens to do this, so head in to the Rococo Testnet Faucet{' '}
            <button
              onClick={() => window.open('https://matrix.to/#/#rococo-faucet:matrix.org', '_blank')}
              className="text-players-5 font-bold underline hover:text-players-5/80"
            >
              matrix channel
            </button>{' '}
            and use the command <br />
            <CodeBlock className="mr-1">!drip YOUR_WALLET_ADDRESS:1002</CodeBlock> (note the{' '}
            <CodeBlock>:1002</CodeBlock> on the end)
          </li>

          <li className="text-md text-white/90 mt-1">
            <h4 className="text-md">The Forming Stage</h4>
            <p>
              The Forming Stage is a period of time where players can join the game by registering their Player with the
              Game contract. When you register you must deposit the required funds and create a player name. Spaces,
              underscores, and strange characters are not allowed. You should use <i>camelCase</i> or <i>PascalCase</i>.
            </p>
          </li>

          <li className="text-md text-white/90 mt-1">
            <h4 className="text-md">Game Start</h4>
            <p>
              The game will start after all of the players have joined and the game master has started the game. It will
              last for <i>N</i> number of rounds (blocks).{' '}
              <b>It is your responsibility to execute the "Play turn" transaction on the game contract</b>
            </p>
          </li>

          <li className="text-md text-white/90 mt-1">
            <h4 className="text-md">Game Completion</h4>
            <p>
              The game is over when all rounds have elapsed. Someone must call the <CodeBlock>end_game()</CodeBlock>{' '}
              transaction for the game to declare the winner and award the funds.
            </p>
          </li>
        </ol>
      </div>
    </Modal>
  );
};
