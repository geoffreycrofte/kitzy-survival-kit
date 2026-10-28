import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../lib/usePageTitle';

export function Transparency() {
  const { t } = useTranslation();
  usePageTitle(t('transparency.title'));
  const list = (key: string) => t(key, { returnObjects: true }) as unknown as string[];

  return (
    <article className="page prose">
      <h1 tabIndex={-1}>{t('transparency.title')}</h1>
      <p className="lead">{t('transparency.intro')}</p>
      <section className="prose-section" aria-labelledby="tr-choose">
        <h2 id="tr-choose" className="section-title">
          {t('transparency.chooseTitle')}
        </h2>
        <ul className="prose-list">
          {list('transparency.choose').map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="prose-section" aria-labelledby="tr-links">
        <h2 id="tr-links" className="section-title">
          {t('transparency.linksTitle')}
        </h2>
        <ul className="prose-list">
          {list('transparency.links').map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="prose-section" aria-labelledby="tr-amazon">
        <h2 id="tr-amazon" className="section-title">
          {t('transparency.amazonTitle')}
        </h2>
        <p>{t('buy.amazon')}</p>
      </section>
      <section className="prose-section" aria-labelledby="tr-ai">
        <h2 id="tr-ai" className="section-title">
          {t('transparency.aiTitle')}
        </h2>
        <ul className="prose-list">
          {list('transparency.ai').map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="prose-section" aria-labelledby="tr-privacy">
        <h2 id="tr-privacy" className="section-title">
          {t('transparency.privacyTitle')}
        </h2>
        <p>{t('transparency.privacy')}</p>
        <Link to="/confidentialite" className="text-link">
          {t('transparency.privacyLink')}
        </Link>
      </section>
    </article>
  );
}
