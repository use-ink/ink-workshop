import { Listbox, Transition } from '@headlessui/react';
import { RiArrowDownSFill, RiCheckFill } from 'react-icons/ri';
import { Fragment } from 'react';
import classNames from 'classnames';
import { useAudioSettings } from '../../../../../hooks/useAudioSettings';
import { ALL_TRACKS } from '../../../../../contexts/AudioSettingsContext';

type Props = {
  className?: string;
};

export const TrackSelect: React.FC<Props> = ({ className }) => {
  const { gameTrack, setGameTrack } = useAudioSettings();

  return (
    <div className={classNames('', className)}>
      <Listbox value={gameTrack} onChange={setGameTrack}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full flex items-center hover:cursor-pointer cursor-default rounded-lg text-brand-600 bg-white py-4 pl-3 pr-10 text-left shadow-md focus:outline-none sm:text-sm">
            <span className="block truncate">{gameTrack.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <RiArrowDownSFill className="h-5 w-5 text-brand-600/70" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            {ALL_TRACKS.length === 0 ? (
              <p className="mt-3 text-md text-white/70">Loading...</p>
            ) : (
              <Listbox.Options className=" mt-2 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {ALL_TRACKS.map((track) => (
                  <Listbox.Option
                    key={track.name}
                    className={({ active }) =>
                      `relative cursor-default select-none py-4 px-10 transition duration-75 text-brand-600 ${
                        active && 'bg-players-4/30'
                      } hover:cursor-pointer`
                    }
                    value={track}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`text-center block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {track.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-3 flex items-center text-amber-600">
                            <RiCheckFill className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            )}
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
