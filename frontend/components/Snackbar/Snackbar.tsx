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
      <div className={classNames('rounded-lg px-4 py-2 mt-1 drop-shadow-md float-right', BG_COLORS[type])}>
        {Icon && <Icon />}
        <span className={classNames('text-sm font-medium text-white text-right', Icon && 'ml-2')}>{message}</span>
      </div>
    </Transition>
  );
};
