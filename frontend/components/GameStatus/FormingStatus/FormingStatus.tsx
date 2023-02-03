import { useTranslation } from 'react-i18next';
import { Forming } from '../../../hooks/useGameContract';

export const FormingStatus: React.FC = () => {
  const categoryClass = 'mr-1';
  const { t } = useTranslation('common');

  return (
    <>
      <h6>
        <span className={categoryClass}>{t('status')}: </span>
        <span className="font-normal bg-players-8 text-white rounded-full px-2 py-[2px]">{t('ready')}</span>
      </h6>
    </>
  );
};
