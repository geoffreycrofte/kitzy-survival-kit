import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { ESSENTIALS, litCount, type EssentialsState } from '@kitzy/core';
import { mascot, type MascotPose } from '../lib/assets';

/** Position des six lucioles autour de la fenêtre, en % de la zone. */
const POSITIONS: ReadonlyArray<[number, number]> = [
  [7.4, 71.8],
  [7.4, 31.3],
  [27.4, 1.5],
  [68, 1.5],
  [88, 31.3],
  [88, 71.8],
];

interface LanternProps {
  essentials: EssentialsState;
  pose?: MascotPose;
  /**
   * Foyer pas encore présenté : les lucioles s'éteignent une à une (`play`),
   * ou sont déjà éteintes (`still`, après la première fois ou sans animation).
   */
  intro?: 'play' | 'still';
}

/** La fenêtre éclairée du terrier, entourée des six lucioles. */
export function Lantern({ essentials, pose = 'bonjour', intro }: LanternProps) {
  const { t } = useTranslation();
  const count = litCount(essentials);

  return (
    <div
      className={`lantern${intro ? ` lantern--intro lantern--intro-${intro}` : ''}`}
      role="img"
      aria-label={t('home.fliesLabel', { count })}
    >
      <div className="lantern__window">
        <div className="lantern__glow" />
        <img className="lantern__hog" src={mascot(pose)} alt="" width={640} height={1060} />
      </div>
      {ESSENTIALS.map((essential, i) => {
        const [x, y] = POSITIONS[i] ?? [0, 0];
        const wrapStyle = {
          left: `${x}%`,
          top: `${y}%`,
          '--kz-drift-duration': `${8 + (i % 3) * 1.5}s`,
          '--kz-drift-delay': `${-i * 1.3}s`,
        } as CSSProperties;
        const dotStyle = {
          '--kz-appear-delay': `${0.9 + i * 0.12}s`,
          '--kz-twinkle-delay': `${i * 0.5}s`,
          // Extinction une à une, dans l'ordre des essentiels.
          '--kz-out-delay': `${1.8 + i * 0.3}s`,
        } as CSSProperties;
        return (
          <span key={essential} className="lantern__fly" style={wrapStyle}>
            <span
              className={essentials[essential] ? 'fly fly--on' : 'fly fly--off'}
              style={dotStyle}
            >
              {intro === 'play' && <span className="fly__light" />}
            </span>
          </span>
        );
      })}
    </div>
  );
}
