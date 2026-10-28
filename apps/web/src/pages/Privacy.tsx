import { useTranslation } from 'react-i18next';
import { PROJECT_ISSUES_URL } from '@kitzy/core';
import { usePageTitle } from '../lib/usePageTitle';
import { webPushConfigured } from '../lib/webpush';

export function Privacy() {
  const { t } = useTranslation();
  usePageTitle(t('privacy.title'));
  type Section = { id?: string; title: string; where: string; text: string };
  const push = t('privacy.pushSection', { returnObjects: true }) as unknown as Section;
  // Une fois le service de rappel en ligne, la section Notifications dit ce qu'il reçoit.
  const sections = (t('privacy.sections', { returnObjects: true }) as unknown as Section[]).map(
    (section) => (webPushConfigured && section.id === 'notify' ? push : section),
  );

  return (
    <article className="page prose">
      <h1 tabIndex={-1}>{t('privacy.title')}</h1>
      <p className="lead">{t('privacy.intro')}</p>
      {sections.map((section, i) => (
        <section key={section.title} className="prose-section" aria-labelledby={`privacy-${i}`}>
          <h2 id={`privacy-${i}`} className="section-title">
            {section.title}
          </h2>
          <p className="privacy__where">{section.where}</p>
          <p>{section.text}</p>
        </section>
      ))}
      <p>
        {t('privacy.contact')}{' '}
        <a href={PROJECT_ISSUES_URL} target="_blank" rel="noopener noreferrer">
          {t('privacy.contactLink')}
          <span className="visually-hidden"> {t('guide.newWindow')}</span>
        </a>
      </p>
      <p className="muted small">{t('privacy.updated')}</p>
    </article>
  );
}
