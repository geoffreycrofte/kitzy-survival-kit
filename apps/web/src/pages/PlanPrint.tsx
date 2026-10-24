import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  HOME_SPOTS,
  PROVIDERS,
  emptyPlan,
  hasSensitiveData,
  prefillPlan,
  type EmergencyPlan,
  type PlanNeighbor,
} from '@kitzy/core';
import { useKitzy } from '../data/derived';
import { formatDate } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import { Loading } from '../components/Loading';
import { PlanGate } from '../components/PlanLock';

/**
 * Le plan en document A4, structuré comme le formulaire officiel. À l'écran, il s'affiche
 * comme une feuille de papier ; à l'impression, il ne reste qu'elle. Les cases vides
 * deviennent des lignes à compléter au stylo.
 */
export function PlanPrint() {
  const { t } = useTranslation();
  usePageTitle(t('plan.printPage.title'));
  return (
    <PlanGate>
      <PlanSheet />
    </PlanGate>
  );
}

function PlanSheet() {
  const { t } = useTranslation();
  const data = useKitzy();
  if (!data) return <Loading />;
  const plan = data.plan ?? prefillPlan(emptyPlan(), data.household, () => crypto.randomUUID());

  return (
    <div className="page plan-print">
      <div className="no-print plan-print__tools">
        <p className="breadcrumb">
          <Link to="/plan">{t('plan.title')}</Link>
        </p>
        <p className="lead">{t('plan.printPage.intro')}</p>
        {hasSensitiveData(plan) && <p className="note">{t('plan.printPage.sensitive')}</p>}
        <button type="button" className="button" onClick={() => window.print()}>
          {t('plan.printPage.button')}
        </button>
      </div>

      <article className="doc" aria-labelledby="doc-title">
        <DocHeader plan={plan} />
        <People plan={plan} />
        <Home plan={plan} />
        <Neighbourhood plan={plan} />
        <Emergency plan={plan} />
        <Numbers plan={plan} />
        <footer className="doc__foot">
          <p>{t('plan.printPage.source')}</p>
          <p>{t('plan.printPage.printed', { date: formatDate(data.today) })}</p>
        </footer>
      </article>
    </div>
  );
}

/* ---------- En-tête : à qui est ce plan, et les numéros d'urgence ---------- */

function DocHeader({ plan }: { plan: EmergencyPlan }) {
  const { t } = useTranslation();
  const where = [plan.owner.address, plan.owner.city].filter((v) => v.trim()).join(', ');
  return (
    <header className="doc__head">
      <div className="doc__identity">
        <p className="doc__brand">Kitzy</p>
        <h1 id="doc-title" className="doc__title" tabIndex={-1}>
          {t('plan.printPage.title')}
        </h1>
        <dl className="doc__owner">
          <Field label={t('plan.owner.name')} value={plan.owner.name} />
          <Field label={t('plan.owner.address')} value={where} />
          <Field
            label={t('plan.printPage.updated')}
            value={plan.updatedAt ? formatDate(plan.updatedAt) : ''}
          />
        </dl>
      </div>
      <div className="doc__sos">
        <p className="doc__sos-title">{t('plan.numbers.emergencyLegend')}</p>
        <p className="doc__sos-line">
          <span className="doc__sos-number">112</span> {t('plan.numbers.fire')}
        </p>
        <p className="doc__sos-line">
          <span className="doc__sos-number">113</span> {t('plan.numbers.police')}
        </p>
      </div>
    </header>
  );
}

/* ---------- 1. Les habitants ---------- */

function People({ plan }: { plan: EmergencyPlan }) {
  const { t } = useTranslation();
  return (
    <Section n={1} title={t('plan.steps.foyer')} edit="foyer">
      <dl className="doc__fields doc__fields--inline">
        <Field label={t('plan.counts.adults')} value={plan.adults ? String(plan.adults) : ''} />
        <Field
          label={t('plan.counts.children')}
          value={plan.children ? String(plan.children) : ''}
        />
      </dl>
      <div className="doc__cards">
        {plan.people.map((p, i) => {
          const name = [p.firstName, p.lastName].filter((v) => v.trim()).join(' ');
          return (
            <section key={p.id} className="doc__card" aria-label={name || undefined}>
              <h3 className="doc__card-title">{name || t('plan.person.legend', { n: i + 1 })}</h3>
              <dl className="doc__fields">
                <Field label={t('plan.person.phone')} value={p.phone} />
                <Field label={t('plan.person.languages')} value={p.languages} />
                <Field label={t('plan.person.bloodType')} value={p.bloodType} />
                <Field label={t('plan.person.matricule')} value={p.matricule} />
                <Field label={t('plan.person.disability')} value={p.disability} wide />
                <Field label={t('plan.person.allergies')} value={p.allergies} wide />
                <Field label={t('plan.person.medication')} value={p.medication} wide />
                <Field label={t('plan.person.remarks')} value={p.remarks} wide />
              </dl>
            </section>
          );
        })}
        {plan.pets.map((p, i) => (
          <section key={p.id} className="doc__card" aria-label={p.name || undefined}>
            <h3 className="doc__card-title">
              {[p.name, p.species].filter((v) => v.trim()).join(', ') ||
                t('plan.pet.legend', { n: i + 1 })}
            </h3>
            <dl className="doc__fields">
              <Field label={t('plan.pet.info')} value={p.info} wide />
            </dl>
          </section>
        ))}
      </div>
    </Section>
  );
}

/* ---------- 2. La maison ---------- */

function Home({ plan }: { plan: EmergencyPlan }) {
  const { t } = useTranslation();
  return (
    <Section n={2} title={t('plan.steps.maison')} edit="maison">
      <Table
        caption={t('plan.spots.legend')}
        columns={[t('plan.printPage.item'), t('plan.spots.where'), t('plan.spots.comment')]}
        rows={HOME_SPOTS.map((spot) => [
          t(`plan.spots.${spot}`),
          plan.home.spots[spot].where,
          plan.home.spots[spot].comment,
        ])}
        rowHeaders
      />
      <dl className="doc__fields">
        <Field label={t('plan.homeMore.altExit')} value={plan.home.altExit} wide />
        <Field label={t('plan.homeMore.garageDoor')} value={plan.home.garageDoor} wide />
        <Field label={t('plan.homeMore.extraKey')} value={plan.home.extraKey} wide />
        <Field label={t('plan.homeMore.other')} value={plan.home.other} wide />
      </dl>
    </Section>
  );
}

/* ---------- 3. Le quartier ---------- */

function Neighbourhood({ plan }: { plan: EmergencyPlan }) {
  const { t } = useTranslation();
  const rows = (list: PlanNeighbor[]) =>
    (list.length ? list : [null, null]).map((n) =>
      n ? [n.name, n.help, n.phone, n.address] : ['', '', '', ''],
    );
  return (
    <Section n={3} title={t('plan.steps.quartier')} edit="quartier">
      {(['helpers', 'toHelp'] as const).map((kind) => (
        <Table
          key={kind}
          caption={t(`plan.${kind}.legend`)}
          columns={[
            t('plan.neighbor.name'),
            t(`plan.${kind}.help`),
            t('plan.neighbor.phone'),
            t('plan.neighbor.address'),
          ]}
          rows={rows(plan[kind])}
        />
      ))}
    </Section>
  );
}

/* ---------- 4. En cas d'urgence ---------- */

function Emergency({ plan }: { plan: EmergencyPlan }) {
  const { t } = useTranslation();
  const e = plan.emergency;
  return (
    <Section n={4} title={t('plan.steps.urgence')} edit="urgence">
      <div className="doc__highlight">
        <p className="doc__highlight-title">{t('plan.emergency.meetingLegend')}</p>
        <dl className="doc__fields">
          <Field label={t('plan.emergency.meeting1')} value={e.meeting1} />
          <Field label={t('plan.emergency.meeting2')} value={e.meeting2} />
        </dl>
      </div>
      <Table
        caption={t('plan.printPage.whoToCall')}
        columns={[
          t('plan.printPage.role'),
          t('plan.emergency.contactName'),
          t('plan.emergency.contactPhone'),
        ]}
        rows={[
          [t('plan.emergency.contact1'), e.contact1.name, e.contact1.phone],
          [t('plan.emergency.contact2'), e.contact2.name, e.contact2.phone],
          [t('plan.printPage.school1'), e.school1.name, e.school1.phone],
          [t('plan.printPage.school2'), e.school2.name, e.school2.phone],
        ]}
        rowHeaders
      />
      <Table
        caption={t('plan.emergency.shelterLegend')}
        columns={[
          t('plan.printPage.place'),
          t('plan.emergency.shelterName'),
          t('plan.emergency.shelterPhone'),
          t('plan.emergency.shelterAddress'),
        ]}
        rows={[
          [t('plan.emergency.shelter1'), e.shelter1.name, e.shelter1.phone, e.shelter1.address],
          [t('plan.emergency.shelter2'), e.shelter2.name, e.shelter2.phone, e.shelter2.address],
        ]}
        rowHeaders
      />
      <dl className="doc__fields">
        <Field label={t('plan.emergency.cis')} value={e.cis} wide />
        <Field
          label={`${t('plan.emergency.informLegend')} (${t('plan.emergency.inform1')})`}
          value={e.inform1}
          wide
        />
        <Field
          label={`${t('plan.emergency.informLegend')} (${t('plan.emergency.inform2')})`}
          value={e.inform2}
          wide
        />
        <Field label={t('plan.emergency.commute')} value={e.commute} wide />
        <Field label={t('plan.emergency.otherSituation')} value={e.otherSituation} wide />
      </dl>
    </Section>
  );
}

/* ---------- 5. Numéros importants ---------- */

function Numbers({ plan }: { plan: EmergencyPlan }) {
  const { t } = useTranslation();
  return (
    <Section n={5} title={t('plan.steps.numeros')} edit="numeros">
      <Table
        caption={t('plan.numbers.providersLegend')}
        columns={[
          t('plan.printPage.service'),
          t('plan.numbers.name'),
          t('plan.numbers.customerNo'),
          t('plan.numbers.phone'),
        ]}
        rows={PROVIDERS.map((kind) => {
          const p = plan.providers[kind];
          return [t(`plan.numbers.kinds.${kind}`), p.name, p.customerNo, p.phone];
        })}
        rowHeaders
      />
      <dl className="doc__fields">
        <Field label={t('plan.numbers.comment')} value={plan.providersComment} wide />
      </dl>
    </Section>
  );
}

/* ---------- Briques du document ---------- */

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
    <section className="doc__section" aria-labelledby={id}>
      <div className="doc__section-head">
        <h2 id={id} className="doc__section-title">
          <span className="doc__section-number">{n}</span> {title}
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

/** Une case : son intitulé, puis la réponse, ou une ligne à compléter au stylo. */
function Field({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? 'doc__field doc__field--wide' : 'doc__field'}>
      <dt>{label}</dt>
      <dd>
        <Value value={value} />
      </dd>
    </div>
  );
}

function Value({ value }: { value: string }) {
  const { t } = useTranslation();
  return value.trim() ? (
    <>{value}</>
  ) : (
    <span className="doc__blank">
      <span className="visually-hidden">{t('plan.printPage.empty')}</span>
    </span>
  );
}

/**
 * Tableau du document. Sur un écran étroit, chaque ligne devient un petit bloc,
 * l'intitulé de colonne rappelé devant chaque valeur. Les rôles explicites (tableau,
 * lignes, en-têtes) gardent la sémantique que `display: block` ferait perdre (RAWeb 5.x).
 */
function Table({
  caption,
  columns,
  rows,
  rowHeaders = false,
}: {
  caption: string;
  columns: string[];
  rows: string[][];
  rowHeaders?: boolean;
}) {
  return (
    <table className="doc__table" role="table">
      <caption>{caption}</caption>
      <thead>
        <tr role="row">
          {columns.map((c) => (
            <th key={c} scope="col" role="columnheader">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} role="row">
            {row.map((cell, j) =>
              rowHeaders && j === 0 ? (
                <th key={j} scope="row" role="rowheader">
                  {cell}
                </th>
              ) : (
                <td key={j} data-label={columns[j]}>
                  <Value value={cell} />
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
