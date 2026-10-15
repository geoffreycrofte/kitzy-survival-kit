import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../lib/usePageTitle';

export function Privacy() {
  const { t } = useTranslation();
  usePageTitle(t('privacy.title'));
  const sections = t('privacy.sections', { returnObjects: true }) as unknown as Array<{
    title: string;
    text: string;
  }>;

  return (
    <article className="page prose">
      <h1 tabIndex={-1}>{t('privacy.title')}</h1>
      <p className="lead">{t('privacy.intro')}</p>
      {sections.map((section, i) => (
        <section key={section.title} className="prose-section" aria-labelledby={`privacy-${i}`}>
          <h2 id={`privacy-${i}`} className="section-title">
            {section.title}
          </h2>
          <p>{section.text}</p>
        </section>
      ))}
      <p className="muted">{t('privacy.contact')}</p>
      <p className="muted small">{t('privacy.updated')}</p>
    </article>
  );
}
