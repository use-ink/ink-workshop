import { useTranslation } from 'react-i18next';
import { GiCube } from 'react-icons/gi';
import { Forming } from '../../../hooks/useGameContract';

type Props = {
  forming: Forming;
};

export const FormingStatus: React.FC<Props> = ({ forming }) => {
  const categoryClass = 'mr-1';
  const { t } = useTranslation('common');

  return (
    <>
      <h6>
        <span className={categoryClass}>{t('status')}: </span>
        <span className="font-normal bg-players-8 text-white rounded-full px-2 py-[2px]">{t('ready')}</span>
      </h6>
      <div className="my-2">
        {forming.startingIn > 0 && (
          <h6 className="flex items-center">
            {t('startingIn', { blocks: forming.startingIn })} <GiCube className="ml-1" size={12} />
          </h6>
        )}
      </div>
    </>
  );
};
