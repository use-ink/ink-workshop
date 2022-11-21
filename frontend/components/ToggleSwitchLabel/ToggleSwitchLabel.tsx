import classNames from 'classnames';
import { ToggleSwitch } from '../ToggleSwitch';

type Props = {
  handleClick: () => any;
  label: string;
  isOn: boolean;
  className?: string;
};

export const ToggleSwitchLabel: React.FC<Props> = ({ handleClick, label, isOn, className }) => {
  return (
    <span className={classNames('flex items-center justify-center text-white/80 text-xs gap-2', className)}>
      <ToggleSwitch handleClick={handleClick} enabled={isOn} />
      <button onClick={handleClick}>{label}</button>
    </span>
  );
};
