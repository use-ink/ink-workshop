import { Howl } from 'howler';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

export type GameTrack = {
  name: string;
  url: string;
};

const TRACKS: { [k: string]: GameTrack } = {
  SQUINK_JAZZ: {
    name: 'Squink Jazz',
    url: '/audio/squink-jazz.mp3',
  },
  SQUINKS_TUNE: {
    name: `Squink's Tune`,
    url: '/audio/squinks-tune.mp3',
  },
  THE_SUBMARINE: {
    name: `The Submarine`,
    url: '/audio/the-submarine.mp3',
  },
  SECRET_AGENT: {
    name: 'Double O Squink',
    url: '/audio/secret-agent.mp3',
  },
  MIGRATION_OF_THE_JELLYFISH: {
    name: `Migration of the Jellyfish`,
    url: '/audio/migration-of-the-jellyfish.mp3',
  },
  SQUINKS_ADVENTURE: {
    name: `Squink's Adventure`,
    url: '/audio/squinks-adventure.mp3',
  },
  MYSTERIES_OF_THE_DEEP: {
    name: `Mysteries of the Deep`,
    url: '/audio/mysteries-of-the-deep.mp3',
  },
  ANGRY_CRAB: {
    name: `The Angry Crab`,
    url: '/audio/the-angry-crab.mp3',
  },
};

export const ALL_TRACKS = Object.values(TRACKS);

export const EFFECTS = {
  SUCCESS: {
    url: '/audio/success.mp3',
  },
  FAILURE: {
    url: '/audio/failure-fx.mp3',
  },
  COIN: {
    url: '/audio/coin.mp3',
  },
  SEND: {
    url: '/audio/whip.mp3',
  },
};

type AudioSettings = {
  gameTrack: GameTrack;
  setGameTrack: (track: GameTrack) => void;
  trackPlayer: Howl | undefined;
  successEffect: Howl | undefined;
  finalizedEffect: Howl | undefined;
  failureEffect: Howl | undefined;
  sendEffect: Howl | undefined;
  playTrack: boolean;
  setPlayTrack: (_: boolean) => void;
};

const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  gameTrack: TRACKS.SECRET_AGENT,
  setGameTrack: (_: GameTrack) => null,
  trackPlayer: undefined,
  successEffect: undefined,
  finalizedEffect: undefined,
  failureEffect: undefined,
  sendEffect: undefined,
  playTrack: false,
  setPlayTrack: (_: boolean) => null,
};

export const AudioSettingsContext = createContext<AudioSettings>(DEFAULT_AUDIO_SETTINGS);

export const AudioSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameTrack, setGameTrack] = useState<GameTrack>(ALL_TRACKS[0]);
  const [successEffect, setEffect] = useState<Howl | undefined>(undefined);
  const [failureEffect, setFailureEffect] = useState<Howl | undefined>(undefined);
  const [finalizedEffect, setFinalizedEffect] = useState<Howl | undefined>(undefined);
  const [sendEffect, setSendEffect] = useState<Howl | undefined>(undefined);
  const [playTrack, setPlayTrack] = useState(false);
  const [trackPlayer, setTrackPlayer] = useState<Howl | undefined>(undefined);

  useEffect(() => {
    const gt: Howl = new Howl({
      src: gameTrack.url,
      loop: true,
      volume: 0.2,
      html5: true,
    }).on('load', () => setTrackPlayer(gt));
  }, [gameTrack]);

  useEffect(() => {
    const success: Howl = new Howl({
      src: EFFECTS.SUCCESS.url,
      loop: false,
      volume: 0.5,
      html5: true,
    }).on('load', () => setEffect(success));

    const finalizedSoundPlayer: Howl = new Howl({
      src: EFFECTS.COIN.url,
      loop: false,
      volume: 0.3,
      html5: true,
    }).on('load', () => setFinalizedEffect(finalizedSoundPlayer));

    const failureSoundPlayer: Howl = new Howl({
      src: EFFECTS.FAILURE.url,
      loop: false,
      volume: 0.3,
      html5: true,
    }).on('load', () => setFailureEffect(failureSoundPlayer));

    const sendSoundPlayer: Howl = new Howl({
      src: EFFECTS.SEND.url,
      loop: false,
      volume: 0.4,
      html5: true,
    }).on('load', () => setSendEffect(sendSoundPlayer));
  }, []);

  const value: AudioSettings = {
    gameTrack,
    playTrack,
    setGameTrack,
    successEffect,
    finalizedEffect,
    failureEffect,
    sendEffect,
    trackPlayer,
    setPlayTrack,
  };

  return <AudioSettingsContext.Provider value={value}>{children}</AudioSettingsContext.Provider>;
};
