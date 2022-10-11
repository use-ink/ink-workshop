import { GiCube } from 'react-icons/gi';
import { Forming } from '../../../hooks/useGameContract';

type Props = {
  forming: Forming;
};

export const FormingStatus: React.FC<Props> = ({ forming }) => {
  const categoryClass = 'mr-1';
  console.log(forming);

  return (
    <>
      <h6>
        <span className={categoryClass}>Status: </span>
        <span className="font-normal bg-players-8 text-white rounded-full px-2 py-[2px]">
          {forming.startingIn > 0 ? forming.status : 'Ready'}
        </span>
      </h6>
      <h6 className="my-2">
        {forming.startingIn > 0 && (
          <h6 className="flex items-center">
            Starting in {forming.startingIn} <GiCube className="ml-1" size={12} />
          </h6>
        )}
      </h6>
    </>
  );
};
