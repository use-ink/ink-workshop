import classNames from 'classnames';
import classnames from 'classnames';
import React from 'react';
import { RiSubtractLine, RiAddLine } from 'react-icons/ri';

type Props = {
  onChange: (v: number) => any;
  value: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  max: number;
  min?: number;
};

export const NumberInput: React.FC<Props> = ({ value, disabled, onChange, placeholder, max, min = 0, className }) => {
  const commonClasses =
    'bg-white/30 border-none focuse:outline-none focus-visible:outline-none focus:outline-none disabled:text-gray-500 py-4 flex items-center justify-center';
  const buttonClasses = 'hover:bg-white/40 disabled:bg-white/20 disabled:cursor-not-allowed';

  const handleChange = (v: number) => {
    const val = v || min;
    if (val < min) return;
    if (val > max) return;
    onChange(val);
  };

  return (
    <span className={classNames('w-full flex items-stretch justify-between rounded-full', className)}>
      <button
        disabled={value <= min || disabled}
        onClick={() => handleChange(value - 1)}
        className={classnames(
          commonClasses,
          buttonClasses,
          'rounded-l-full min-w-min pl-8 pr-4 transition duration-75',
        )}
      >
        <RiSubtractLine />
      </button>
      <input
        className={classnames(
          commonClasses,
          'text-center grow focus:ring-0 focus:ring-offset-0 disabled:bg-dark-gray disabled:cursor-not-allowed',
          'font-fred tracking-wider',
        )}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={(e) => {
          handleChange(parseInt(e.target.value) || 0);
        }}
      />
      <button
        disabled={value >= max || disabled}
        onClick={() => handleChange(value + 1)}
        className={classnames(commonClasses, buttonClasses, 'rounded-r-full pr-8 pl-4 transition duration-75')}
      >
        <RiAddLine />
      </button>
    </span>
  );
};
