/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Modal } from '../../Modal';
import { useUI } from '../../../contexts/UIContext';
import { CodeBlock } from '../../CodeBlock';
import { FiUsers, FiClock } from 'react-icons/fi';
import { ExternalLink } from '../../ExternalLink';
import { useTranslation } from 'react-i18next';

export const Rules = () => {
  const { showRules, setShowRules } = useUI();
  const { t } = useTranslation('rules');

  return (
    <Modal open={showRules} handleClose={() => setShowRules(false)}>
      <div className="bg-players-9 flex flex-col p-8 w-full max-w-3xl text-start overflow-y-scroll">
        <h3 className="text-2xl text-center">{t('rules.title')}</h3>
        <h4 className="text-lg text-white/90 mt-3 text-start">{t('objective')}</h4>
        <p className="text-md text-white/90 mt-1">
          {t('rules.desc1')} <span className="text-white font-fred tracking-lg">ink!</span> .
        </p>
        <p className="text-md text-white/90 mt-1">
          {t('rules.desc2')}
          <i className="font-semibold"> {t('rules.gas')} </i>
          {t('rules.desc3')}.
        </p>
        <div className="flex items-end text-xs mt-6 gap-3">
          <span className="text-md text-white/90 flex items-end gap-2">
            <FiUsers size={18} /> {t('playersNumber')}
          </span>
          <span className="text-md text-white/90 flex items-end gap-2">
            <FiClock size={18} />
            {t('playTime')}
          </span>
        </div>
        <h4 className="text-lg text-white/90 mt-6 text-start">{t('instructions')}</h4>
        <ol className="list-decimal pl-4">
          <li className="text-md text-white/90 mt-1">
            <ExternalLink
              href="https://github.com/use-ink/ink-workshop/blob/main/workshop/1_SETUP.md"
              secondary
              underline
            >
              {t('setUp')}
            </ExternalLink>
          </li>
        </ol>
        <h4 className="text-lg text-white/90 mt-6 text-start">{t('gamePlay')}</h4>
        <ol className="list-decimal pl-4">
          <li className="text-md text-white/90 mt-1">
            <h4 className="text-md">{t('formingStage.title')}</h4>
            <p>
              {t('formingStage.desc')}
              <i> {t('formingStage.camelCase')} </i>
              {t('formingStage.or')}
              <i> {t('formingStage.pascalCase')}</i>.
            </p>
          </li>

          <li className="text-md text-white/90 mt-1">
            <h4 className="text-md"> {t('gameStart.title')}</h4>
            <p>
              {t('gameStart.desc1')}
              <i>{t('gameStart.n')} </i>
              {t('gameStart.desc2')} <b>{t('gameStart.bold')}</b>
            </p>
          </li>

          <li className="text-md text-white/90 mt-1">
            <h4 className="text-md">{t('completion.title')}</h4>
            <p>
              {t('completion.desc1')} <CodeBlock>end_game()</CodeBlock> {t('completion.desc2')}
            </p>
          </li>
        </ol>
      </div>
    </Modal>
  );
};
