import { GiBigGear } from 'react-icons/gi';
import { useUI } from '../../../../contexts/UIContext';
import { useAudioSettings } from '../../../../hooks/useAudioSettings';
import { Modal } from '../../../Modal';
import { ToggleSwitchLabel } from '../../../ToggleSwitchLabel';
import { TrackSelect } from './TrackSelect';
import { useTranslation } from 'react-i18next';
import { LanguageSelect } from './LanguageSelect';

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
    showLogs,
    setShowLogs,
  } = useUI();
  const { setPlayTrack, playTrack } = useAudioSettings();
  const { t } = useTranslation('common');

  return (
    <>
      <Modal open={showSettings} handleClose={() => setShowSettings(false)}>
        <div className="w-full px-8 py-12">
          <div className="w-full">
            <h3 className="text-lg text-white my-3">{t('chooseLanguage')}</h3>
            <LanguageSelect />
          </div>
          <div className="w-full mt-8">
            <h3 className="text-lg text-white">{t('gameAudio')}</h3>
            <ToggleSwitchLabel
              className="mt-3"
              handleClick={() => setPlayTrack(!playTrack)}
              isOn={playTrack}
              label={t('playGameTrack')}
            />
            <div className="mt-6">
              <TrackSelect />
            </div>
          </div>

          <div className="w-full mt-8">
            <h3 className="text-lg text-white">{t('visualSettings')}</h3>
            <ToggleSwitchLabel
              className="mt-3"
              handleClick={() => setDarkMode(!darkMode)}
              isOn={darkMode}
              label={t('darkMode')}
            />
            <ToggleSwitchLabel
              className="mt-3"
              handleClick={() => setShowGrid(!showGrid)}
              isOn={showGrid}
              label={t('showPixelGrid')}
            />
            <ToggleSwitchLabel
              className="mt-3"
              handleClick={() => setShowCoordinates(!showCoordinates)}
              isOn={showCoordinates}
              label={t('showPixelCoordinates')}
            />
            <ToggleSwitchLabel
              className="mt-3"
              handleClick={() => setShowLogs(!showLogs)}
              isOn={showLogs}
              label={t('showGameLogs')}
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
