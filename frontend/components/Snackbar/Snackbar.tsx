import { Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment } from 'react';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

type Props = {
  className?: string;
  message: string;
  show: boolean;
  type: SnackbarType;
  Icon?: React.FC;
};

const BG_COLORS = {
  success: 'bg-players-3',
  error: 'bg-players-2',
  warning: 'bg-players-8',
  info: 'bg-players-4',
};

const BORDER_COLORS = {
  success: 'border-b-players-3 border-l-players-3',
  error: ' border-b-players-2 border-l-players-2',
  warning: 'border-b-players-8 border-l-players-8',
  info: 'border-b-players-4 border-l-players-4',
};

export const Snackbar: React.FC<Props> = ({ show, message, type, Icon }) => {
  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="flex items-end justify-end mt-1 drop-shadow-md">
        <div className={classNames('rounded-lg rounded-br-none px-4 py-2', BG_COLORS[type])}>
          {Icon && <Icon />}
          <span className={classNames('text-sm font-medium text-white text-right', Icon && 'ml-2')}>{message}</span>
        </div>
        <div
          className={classNames(
            'border-t-[8px] border-r-[8px] border-r-transparent border-b-[8px] border-t-transparent border-l-[8px]',
            BORDER_COLORS[type],
          )}
        />
      </div>
    </Transition>
  );
};
