import { GiBigGear } from 'react-icons/gi';
import { useUI } from '../../../../contexts/UIContext';
import { useAudioSettings } from '../../../../hooks/useAudioSettings';
import { Modal } from '../../../Modal';
import { ToggleSwitchLabel } from '../../../ToggleSwitchLabel';
import { TrackSelect } from './TrackSelect';

export const Settings: React.FC = () => {
  const {
    darkMode,
    setDarkMode,
    showSettings,
    setShowSettings,
    showGrid,
    setShowGrid,
    showCoordinates,
    setShowCoordinates,
  } = useUI();
  const { setPlayTrack, playTrack } = useAudioSettings();

  return (
    <>
      <Modal open={showSettings} handleClose={() => setShowSettings(false)}>
        <div className="w-full px-8 py-12">
          <div className="w-full">
            <h3 className="text-lg text-white">Game Audio</h3>
            <ToggleSwitchLabel
              className="mt-3"
              handleClick={() => setPlayTrack(!playTrack)}
              isOn={playTrack}
              label="Play game track"
            />
            <div className="mt-6">
              <TrackSelect />
            </div>
          </div>

          <div className="w-full mt-8">
            <h3 className="text-lg text-white">Visual Settings</h3>
            <ToggleSwitchLabel
              className="mt-3"
              handleClick={() => setDarkMode(!darkMode)}
              isOn={darkMode}
              label="Dark Mode"
            />
            <ToggleSwitchLabel
              className="mt-3"
              handleClick={() => setShowGrid(!showGrid)}
              isOn={showGrid}
              label="Show pixel grid"
            />
            <ToggleSwitchLabel
              className="mt-3"
              handleClick={() => setShowCoordinates(!showCoordinates)}
              isOn={showCoordinates}
              label="Show pixel coordinates"
            />
          </div>
        </div>
      </Modal>

      <div className="fixed left-3 bottom-3 z-10">
        <button onClick={() => setShowSettings(true)}>
          <GiBigGear size={48} className="drop-shadow-lg" />
        </button>
      </div>
    </>
  );
};
