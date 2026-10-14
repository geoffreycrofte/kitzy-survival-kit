import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { GUIDE, type GuideBlock, type GuidePage } from '@kitzy/core';
import { mascot } from '../lib/assets';
import { usePageTitle } from '../lib/usePageTitle';
import { NotFound } from './NotFound';

const CHAPTERS: GuidePage['chapter'][] = ['comprendre', 'alerte', 'preparer'];

export function GuideIndex() {
  const { t } = useTranslation();
  usePageTitle(t('guide.title'));
  return (
    <div className="page">
      <h1 tabIndex={-1}>{t('guide.title')}</h1>
      <p className="lead">{t('guide.intro')}</p>
      {CHAPTERS.map((chapter) => (
        <section key={chapter} aria-labelledby={`chapter-${chapter}`} className="kit-group">
          <h2 id={`chapter-${chapter}`} className="section-title">
            {t(`guide.chapters.${chapter}`)}
          </h2>
          <ul className="guide-list">
            {GUIDE.filter((p) => p.chapter === chapter).map((page) => (
              <li key={page.slug} className="card guide-card">
                <h3 className="guide-card__title">
                  <Link to={`/guide/${page.slug}`}>{page.title}</Link>
                </h3>
                <p className="muted">{page.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="muted small">{t('guide.source')}</p>
    </div>
  );
}

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="section-title">{block.text}</h2>;
    case 'p':
      return <p>{block.text}</p>;
    case 'note':
      return <p className="note">{block.text}</p>;
    case 'list':
      return (
        <ul className="prose-list">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case 'steps':
      return (
        <ol className="prose-list">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );
  }
}

export function GuideArticle() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const page = GUIDE.find((p) => p.slug === slug);
  usePageTitle(page?.title ?? t('guide.title'));
  if (!page) return <NotFound />;

  return (
    <article className="page prose">
      <p className="breadcrumb">
        <Link to="/guide">{t('guide.back')}</Link>
      </p>
      <h1 tabIndex={-1}>{page.title}</h1>
      {page.pose && (
        <img className="prose__hog" src={mascot(page.pose)} alt="" width={640} height={1000} />
      )}
      <p className="lead">{page.summary}</p>
      {page.blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
      {page.links && page.links.length > 0 && (
        <section aria-labelledby="guide-links">
          <h2 id="guide-links" className="section-title">
            {t('guide.links')}
          </h2>
          <ul className="prose-list">
            {page.links.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                  <span className="visually-hidden"> {t('guide.newWindow')}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="muted small">{t('guide.source')}</p>
    </article>
  );
}
