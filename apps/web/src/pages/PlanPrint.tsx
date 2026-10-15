import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  HOME_SPOTS,
  PROVIDERS,
  emptyPlan,
  hasSensitiveData,
  prefillPlan,
  type PlanContact,
  type PlanPlace,
} from '@kitzy/core';
import { useKitzy } from '../data/derived';
import { formatDate } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import { Loading } from '../components/Loading';

/**
 * Version papier du plan, structurée comme le formulaire officiel.
 * Les cases vides restent visibles pour être complétées au stylo.
 */
export function PlanPrint() {
  const { t } = useTranslation();
  usePageTitle(t('plan.printPage.title'));
  const data = useKitzy();
  if (!data) return <Loading />;

  const plan = data.plan ?? prefillPlan(emptyPlan(), data.household, () => crypto.randomUUID());
  const e = plan.emergency;
  const contact = (c: PlanContact) => [c.name, c.phone].filter(Boolean).join(', ');
  const place = (p: PlanPlace) => [p.name, p.phone, p.address].filter(Boolean).join(', ');

  return (
    <div className="page plan-print">
      <div className="no-print">
        <p className="breadcrumb">
          <Link to="/plan">{t('plan.title')}</Link>
        </p>
      </div>
      <h1 tabIndex={-1}>{t('plan.printPage.title')}</h1>
      <div className="no-print stack">
        <p className="lead">{t('plan.printPage.intro')}</p>
        {hasSensitiveData(plan) && <p className="note">{t('plan.printPage.sensitive')}</p>}
        <button type="button" className="button" onClick={() => window.print()}>
          {t('plan.printPage.button')}
        </button>
      </div>

      <dl className="sheet">
        <Row label={t('plan.owner.name')} value={plan.owner.name} />
        <Row label={t('plan.owner.address')} value={plan.owner.address} />
        <Row label={t('plan.owner.city')} value={plan.owner.city} />
        <Row
          label={t('plan.printPage.completed')}
          value={plan.createdAt ? formatDate(plan.createdAt) : ''}
        />
        <Row
          label={t('plan.printPage.updated')}
          value={plan.updatedAt ? formatDate(plan.updatedAt) : ''}
        />
      </dl>

      <Section n={1} title={t('plan.steps.foyer')} edit="foyer">
        <dl className="sheet">
          <Row label={t('plan.counts.adults')} value={String(plan.adults || '')} />
          <Row label={t('plan.counts.children')} value={String(plan.children || '')} />
        </dl>
        {plan.people.map((p, i) => (
          <div key={p.id} className="sheet-block">
            <h3>{t('plan.person.legend', { n: i + 1 })}</h3>
            <dl className="sheet">
              <Row label={t('plan.person.lastName')} value={p.lastName} />
              <Row label={t('plan.person.firstName')} value={p.firstName} />
              <Row label={t('plan.person.phone')} value={p.phone} />
              <Row label={t('plan.person.languages')} value={p.languages} />
              <Row label={t('plan.person.bloodType')} value={p.bloodType} />
              <Row label={t('plan.person.matricule')} value={p.matricule} />
              <Row label={t('plan.person.disability')} value={p.disability} />
              <Row label={t('plan.person.allergies')} value={p.allergies} />
              <Row label={t('plan.person.medication')} value={p.medication} />
              <Row label={t('plan.person.remarks')} value={p.remarks} />
            </dl>
          </div>
        ))}
        {plan.pets.map((p, i) => (
          <div key={p.id} className="sheet-block">
            <h3>{t('plan.pet.legend', { n: i + 1 })}</h3>
            <dl className="sheet">
              <Row label={t('plan.pet.species')} value={p.species} />
              <Row label={t('plan.pet.name')} value={p.name} />
              <Row label={t('plan.pet.info')} value={p.info} />
            </dl>
          </div>
        ))}
      </Section>

      <Section n={2} title={t('plan.steps.maison')} edit="maison">
        <dl className="sheet">
          {HOME_SPOTS.map((spot) => (
            <Row
              key={spot}
              label={t(`plan.spots.${spot}`)}
              value={[plan.home.spots[spot].where, plan.home.spots[spot].comment]
                .filter(Boolean)
                .join(' : ')}
            />
          ))}
          <Row label={t('plan.homeMore.altExit')} value={plan.home.altExit} />
          <Row label={t('plan.homeMore.garageDoor')} value={plan.home.garageDoor} />
          <Row label={t('plan.homeMore.extraKey')} value={plan.home.extraKey} />
          <Row label={t('plan.homeMore.other')} value={plan.home.other} />
        </dl>
      </Section>

      <Section n={3} title={t('plan.steps.quartier')} edit="quartier">
        {(['helpers', 'toHelp'] as const).map((kind) => (
          <div key={kind} className="sheet-block">
            <h3>{t(`plan.${kind}.legend`)}</h3>
            <dl className="sheet">
              {(plan[kind].length ? plan[kind] : [null, null]).map((n, i) => (
                <Row
                  key={n?.id ?? i}
                  label={t(`plan.${kind}.item`, { n: i + 1 })}
                  value={n ? [n.name, n.help, n.phone, n.address].filter(Boolean).join(', ') : ''}
                />
              ))}
            </dl>
          </div>
        ))}
      </Section>

      <Section n={4} title={t('plan.steps.urgence')} edit="urgence">
        <dl className="sheet">
          <Row label={t('plan.emergency.cis')} value={e.cis} />
          <Row label={t('plan.emergency.meeting1')} value={e.meeting1} />
          <Row label={t('plan.emergency.meeting2')} value={e.meeting2} />
          <Row
            label={`${t('plan.emergency.informLegend')}, ${t('plan.emergency.inform1')}`}
            value={e.inform1}
          />
          <Row
            label={`${t('plan.emergency.informLegend')}, ${t('plan.emergency.inform2')}`}
            value={e.inform2}
          />
          <Row label={t('plan.emergency.contact1')} value={contact(e.contact1)} />
          <Row label={t('plan.emergency.contact2')} value={contact(e.contact2)} />
          <Row label={t('plan.emergency.school1')} value={contact(e.school1)} />
          <Row label={t('plan.printPage.school2')} value={contact(e.school2)} />
          <Row label={t('plan.emergency.commute')} value={e.commute} />
          <Row label={t('plan.emergency.otherSituation')} value={e.otherSituation} />
          <Row
            label={`${t('plan.emergency.shelterLegend')}, ${t('plan.emergency.shelter1')}`}
            value={place(e.shelter1)}
          />
          <Row
            label={`${t('plan.emergency.shelterLegend')}, ${t('plan.emergency.shelter2')}`}
            value={place(e.shelter2)}
          />
        </dl>
      </Section>

      <Section n={5} title={t('plan.steps.numeros')} edit="numeros">
        <ul className="plain-list">
          <li>
            <strong>{t('plan.numbers.n112')}</strong>
          </li>
          <li>
            <strong>{t('plan.numbers.n113')}</strong>
          </li>
        </ul>
        <p>{t('plan.numbers.warning')}</p>
        <dl className="sheet">
          {PROVIDERS.map((kind) => {
            const p = plan.providers[kind];
            return (
              <Row
                key={kind}
                label={t(`plan.numbers.kinds.${kind}`)}
                value={[p.name, p.customerNo, p.phone].filter(Boolean).join(', ')}
              />
            );
          })}
          <Row label={t('plan.numbers.comment')} value={plan.providersComment} />
        </dl>
      </Section>

      <p className="muted small">{t('plan.printPage.source')}</p>
    </div>
  );
}

function Section({
  n,
  title,
  edit,
  children,
}: {
  n: number;
  title: string;
  edit: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const id = `print-${edit}`;
  return (
    <section className="sheet-section" aria-labelledby={id}>
      <div className="sheet-section__head">
        <h2 id={id}>
          {n}. {title}
        </h2>
        <Link
          to={`/plan/${edit}`}
          className="text-link no-print"
          aria-label={t('plan.printPage.editLabel', { title })}
        >
          {t('plan.printPage.edit')}
        </Link>
      </div>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const { t } = useTranslation();
  return (
    <div className="sheet__row">
      <dt>{label}</dt>
      <dd>
        {value.trim() ? (
          value
        ) : (
          <span className="sheet__blank">
            <span className="visually-hidden">{t('plan.printPage.empty')}</span>
          </span>
        )}
      </dd>
    </div>
  );
}
