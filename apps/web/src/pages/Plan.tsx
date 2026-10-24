import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  HOME_SPOTS,
  PLAN_STEPS,
  PROVIDERS,
  emptyNeighbor,
  emptyPerson,
  emptyPet,
  emptyPlan,
  hasSensitiveData,
  prefillPlan,
  tasksProgress,
  withoutHealthData,
  type EmergencyPlan,
  type PlanContact,
  type PlanNeighbor,
  type PlanPlace,
  type PlanStep,
} from '@kitzy/core';
import { TextField } from '../components/TextField';
import { useKitzy } from '../data/derived';
import { deletePlan, savePlanStep } from '../data/store';
import { announce } from '../lib/announce';
import { formatDate } from '../lib/format';
import { mascotImage } from '../lib/assets';
import { usePageTitle } from '../lib/usePageTitle';
import { NotFound } from './NotFound';
import { Loading } from '../components/Loading';
import { PlanGate } from '../components/PlanLock';

const uid = () => crypto.randomUUID();

function isStep(value: string | undefined): value is PlanStep {
  return PLAN_STEPS.includes(value as PlanStep);
}

/* ---------- Vue d'ensemble ---------- */

export function PlanOverview() {
  const { t } = useTranslation();
  usePageTitle(t('plan.title'));
  const data = useKitzy();
  if (!data) return <Loading />;

  const progress = data.planInfo.steps;
  const started = PLAN_STEPS.some((s) => progress[s] !== 'empty');
  const firstOpen = PLAN_STEPS.find((s) => progress[s] !== 'done') ?? 'foyer';
  const gestures = tasksProgress(data.tasks);

  return (
    <div className="page">
      <h1 tabIndex={-1}>{t('plan.title')}</h1>
      <img className="page__hog" {...mascotImage('plan')} alt="" />
      <p className="lead">{t('plan.intro')}</p>

      <ol className="plan-steps">
        {PLAN_STEPS.map((step, i) => (
          <li key={step} className="plan-steps__item">
            <span className="plan-steps__number" aria-hidden="true">
              {i + 1}
            </span>
            <span className="plan-steps__body">
              <Link to={`/plan/${step}`} className="plan-steps__link">
                {t(`plan.steps.${step}`)}
              </Link>
              <span className="plan-steps__intro">{t(`plan.stepIntro.${step}`)}</span>
            </span>
            <span className={`tag tag--${progress[step]}`}>
              {t(`plan.stepState.${progress[step]}`)}
            </span>
          </li>
        ))}
      </ol>

      <div className="button-row">
        <Link to={`/plan/${firstOpen}`} className="button">
          {started ? t('plan.continue') : t('plan.start')}
        </Link>
        {started && (
          <Link to="/plan/imprimer" className="button button--ghost">
            {t('plan.print')}
          </Link>
        )}
      </div>
      {data.planInfo.updatedAt && (
        <p className="muted">{t('plan.updated', { date: formatDate(data.planInfo.updatedAt) })}</p>
      )}
      <p className="note">{t('plan.paper')}</p>

      <section className="card" aria-labelledby="plan-tasks">
        <h2 id="plan-tasks" className="card__label">
          {t('tasks.title')}
        </h2>
        <p className="card__text">{t('tasks.progress', gestures)}</p>
        <Link to="/gestes" className="button button--ghost">
          {t('plan.tasks')}
        </Link>
      </section>

      {(data.plan || data.planSealed) && (
        <button
          type="button"
          className="button button--danger"
          onClick={async () => {
            if (!window.confirm(t('plan.deleteConfirm'))) return;
            await deletePlan();
            announce(t('plan.deleted'));
          }}
        >
          {t('plan.delete')}
        </button>
      )}
    </div>
  );
}

/* ---------- Une étape ---------- */

export function PlanStepPage() {
  const { t } = useTranslation();
  const { step } = useParams();
  const data = useKitzy();
  usePageTitle(isStep(step) ? `${t(`plan.steps.${step}`)}, ${t('plan.title')}` : t('plan.title'));
  if (!isStep(step)) return <NotFound />;
  if (!data) return <Loading />;
  const initial = data.plan ?? prefillPlan(emptyPlan(), data.household, uid);
  return (
    <PlanGate>
      <PlanEditor key={step} step={step} initial={initial} />
    </PlanGate>
  );
}

type Edit = (change: (draft: EmergencyPlan) => void) => void;

function PlanEditor({ step, initial }: { step: PlanStep; initial: EmergencyPlan }) {
  const { t } = useTranslation();
  const [plan, setPlan] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const latest = useRef({ plan, dirty });

  const edit: Edit = (change) => {
    setPlan((current) => {
      const draft = structuredClone(current);
      change(draft);
      return draft;
    });
    setDirty(true);
  };

  // Enregistrement automatique, et au départ de la page.
  useEffect(() => {
    latest.current = { plan, dirty };
    if (!dirty) return;
    const timer = setTimeout(() => {
      void savePlanStep(step, plan);
      setDirty(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [plan, dirty, step]);

  useEffect(() => {
    const ref = latest;
    return () => {
      if (ref.current.dirty) void savePlanStep(step, ref.current.plan);
    };
  }, [step]);

  const index = PLAN_STEPS.indexOf(step);
  const previous = PLAN_STEPS[index - 1];
  const next = PLAN_STEPS[index + 1];

  return (
    <div className="page plan-editor">
      <p className="breadcrumb">
        <Link to="/plan">{t('plan.title')}</Link>
      </p>
      <p className="eyebrow">
        {t('plan.stepOf', { current: index + 1, total: PLAN_STEPS.length })}
      </p>
      <h1 tabIndex={-1}>{t(`plan.steps.${step}`)}</h1>
      <p className="lead">{t(`plan.stepIntro.${step}`)}</p>
      <p className="muted small">
        {t('plan.optional')} {t('plan.autosave')}
      </p>

      <form className="form" onSubmit={(e) => e.preventDefault()} noValidate>
        {step === 'foyer' && <StepHousehold plan={plan} edit={edit} />}
        {step === 'maison' && <StepHome plan={plan} edit={edit} />}
        {step === 'quartier' && <StepNeighborhood plan={plan} edit={edit} />}
        {step === 'urgence' && <StepEmergency plan={plan} edit={edit} />}
        {step === 'numeros' && <StepNumbers plan={plan} edit={edit} />}
      </form>

      <nav className="plan-nav" aria-label={t('plan.title')}>
        {previous && (
          <Link to={`/plan/${previous}`} className="button button--ghost">
            {t('plan.previous')}
          </Link>
        )}
        {next ? (
          <Link to={`/plan/${next}`} className="button">
            {t('plan.next')}
          </Link>
        ) : (
          <Link to="/plan/imprimer" className="button">
            {t('plan.finish')}
          </Link>
        )}
      </nav>
    </div>
  );
}

interface StepProps {
  plan: EmergencyPlan;
  edit: Edit;
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <button type="button" className="button button--small button--ghost" onClick={onClick}>
      {t('plan.remove', { label })}
    </button>
  );
}

function StepHousehold({ plan, edit }: StepProps) {
  const { t } = useTranslation();
  const consent = plan.healthConsent;

  const toggleConsent = () => {
    if (consent) {
      if (hasSensitiveData(plan) && !window.confirm(t('plan.health.withdrawConfirm'))) return;
      edit((d) => Object.assign(d, withoutHealthData(d)));
      if (hasSensitiveData(plan)) announce(t('plan.health.withdrawn'));
    } else {
      edit((d) => {
        d.healthConsent = true;
      });
    }
  };

  return (
    <>
      <fieldset className="card form__group">
        <legend className="form__legend">{t('plan.owner.legend')}</legend>
        <TextField
          label={t('plan.owner.name')}
          value={plan.owner.name}
          autoComplete="name"
          onChange={(v) => edit((d) => void (d.owner.name = v))}
        />
        <TextField
          label={t('plan.owner.address')}
          value={plan.owner.address}
          autoComplete="street-address"
          onChange={(v) => edit((d) => void (d.owner.address = v))}
        />
        <TextField
          label={t('plan.owner.city')}
          value={plan.owner.city}
          autoComplete="address-level2"
          onChange={(v) => edit((d) => void (d.owner.city = v))}
        />
      </fieldset>

      <fieldset className="card form__group">
        <legend className="form__legend">{t('plan.counts.legend')}</legend>
        <div className="field-pair">
          <NumberField
            label={t('plan.counts.adults')}
            value={plan.adults}
            onChange={(n) => edit((d) => void (d.adults = n))}
          />
          <NumberField
            label={t('plan.counts.children')}
            value={plan.children}
            onChange={(n) => edit((d) => void (d.children = n))}
          />
        </div>
      </fieldset>

      <section className="card form__group" aria-labelledby="health-title">
        <h2 id="health-title" className="form__legend">
          {t('plan.health.legend')}
        </h2>
        <p className="field__hint">{t('plan.health.explain')}</p>
        <div className="switch-row">
          <input
            id="health-consent"
            type="checkbox"
            className="checkbox"
            checked={consent}
            onChange={toggleConsent}
          />
          <label htmlFor="health-consent">{t('plan.health.consent')}</label>
        </div>
      </section>

      <h2 className="section-title">{t('plan.peopleLegend')}</h2>
      {plan.people.map((person, i) => {
        const legend = t('plan.person.legend', { n: i + 1 });
        const set = (field: keyof typeof person) => (v: string) =>
          edit((d) => {
            const p = d.people.find((x) => x.id === person.id);
            if (p) p[field] = v;
          });
        return (
          <fieldset key={person.id} className="card form__group">
            <legend className="form__legend">{legend}</legend>
            <div className="field-pair">
              <TextField
                label={t('plan.person.firstName')}
                value={person.firstName}
                onChange={set('firstName')}
              />
              <TextField
                label={t('plan.person.lastName')}
                value={person.lastName}
                onChange={set('lastName')}
              />
            </div>
            <div className="field-pair">
              <TextField
                label={t('plan.person.phone')}
                type="tel"
                value={person.phone}
                maxLength={40}
                onChange={set('phone')}
              />
              <TextField
                label={t('plan.person.languages')}
                value={person.languages}
                onChange={set('languages')}
              />
            </div>
            {consent && (
              <>
                <div className="field-pair">
                  <TextField
                    label={t('plan.person.bloodType')}
                    value={person.bloodType}
                    maxLength={10}
                    onChange={set('bloodType')}
                  />
                  <TextField
                    label={t('plan.person.matricule')}
                    hint={t('plan.person.matriculeHint')}
                    value={person.matricule}
                    maxLength={20}
                    onChange={set('matricule')}
                  />
                </div>
                <TextField
                  label={t('plan.person.disability')}
                  hint={t('plan.person.disabilityHint')}
                  value={person.disability}
                  multiline
                  maxLength={500}
                  onChange={set('disability')}
                />
                <TextField
                  label={t('plan.person.allergies')}
                  hint={t('plan.person.allergiesHint')}
                  value={person.allergies}
                  multiline
                  maxLength={500}
                  onChange={set('allergies')}
                />
                <TextField
                  label={t('plan.person.medication')}
                  hint={t('plan.person.medicationHint')}
                  value={person.medication}
                  multiline
                  maxLength={1000}
                  onChange={set('medication')}
                />
                <TextField
                  label={t('plan.person.remarks')}
                  value={person.remarks}
                  multiline
                  maxLength={1000}
                  onChange={set('remarks')}
                />
              </>
            )}
            <RemoveButton
              label={legend}
              onClick={() =>
                edit((d) => void (d.people = d.people.filter((x) => x.id !== person.id)))
              }
            />
          </fieldset>
        );
      })}
      <button
        type="button"
        className="button button--ghost"
        onClick={() => edit((d) => void d.people.push(emptyPerson(uid())))}
      >
        {t('plan.person.add')}
      </button>

      <h2 className="section-title">{t('plan.petsLegend')}</h2>
      {plan.pets.map((pet, i) => {
        const legend = t('plan.pet.legend', { n: i + 1 });
        const set = (field: 'species' | 'name' | 'info') => (v: string) =>
          edit((d) => {
            const p = d.pets.find((x) => x.id === pet.id);
            if (p) p[field] = v;
          });
        return (
          <fieldset key={pet.id} className="card form__group">
            <legend className="form__legend">{legend}</legend>
            <div className="field-pair">
              <TextField
                label={t('plan.pet.species')}
                value={pet.species}
                onChange={set('species')}
              />
              <TextField label={t('plan.pet.name')} value={pet.name} onChange={set('name')} />
            </div>
            <TextField
              label={t('plan.pet.info')}
              value={pet.info}
              multiline
              maxLength={500}
              onChange={set('info')}
            />
            <RemoveButton
              label={legend}
              onClick={() => edit((d) => void (d.pets = d.pets.filter((x) => x.id !== pet.id)))}
            />
          </fieldset>
        );
      })}
      <button
        type="button"
        className="button button--ghost"
        onClick={() => edit((d) => void d.pets.push(emptyPet(uid())))}
      >
        {t('plan.pet.add')}
      </button>
    </>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const id = `count-${label}`.replace(/\W+/g, '-');
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <input
        id={id}
        className="input input--short"
        type="number"
        inputMode="numeric"
        min={0}
        max={50}
        value={value}
        onChange={(e) => {
          const n = Number.parseInt(e.target.value, 10);
          onChange(Number.isNaN(n) ? 0 : Math.min(50, Math.max(0, n)));
        }}
      />
    </div>
  );
}

function StepHome({ plan, edit }: StepProps) {
  const { t } = useTranslation();
  return (
    <>
      <h2 className="section-title">{t('plan.spots.legend')}</h2>
      {HOME_SPOTS.map((spot) => (
        <fieldset key={spot} className="card form__group">
          <legend className="form__legend">{t(`plan.spots.${spot}`)}</legend>
          <TextField
            label={t('plan.spots.where')}
            value={plan.home.spots[spot].where}
            onChange={(v) => edit((d) => void (d.home.spots[spot].where = v))}
          />
          <TextField
            label={t('plan.spots.comment')}
            value={plan.home.spots[spot].comment}
            maxLength={500}
            onChange={(v) => edit((d) => void (d.home.spots[spot].comment = v))}
          />
        </fieldset>
      ))}
      <fieldset className="card form__group">
        <legend className="form__legend">{t('plan.homeMore.legend')}</legend>
        {(['altExit', 'garageDoor', 'extraKey', 'other'] as const).map((field) => (
          <TextField
            key={field}
            label={t(`plan.homeMore.${field}`)}
            value={plan.home[field]}
            multiline
            maxLength={field === 'other' ? 1000 : 500}
            onChange={(v) => edit((d) => void (d.home[field] = v))}
          />
        ))}
      </fieldset>
    </>
  );
}

function NeighborList({
  kind,
  list,
  edit,
}: {
  kind: 'helpers' | 'toHelp';
  list: PlanNeighbor[];
  edit: Edit;
}) {
  const { t } = useTranslation();
  return (
    <section className="form__group" aria-labelledby={`${kind}-title`}>
      <h2 id={`${kind}-title`} className="section-title">
        {t(`plan.${kind}.legend`)}
      </h2>
      <p className="field__hint">{t(`plan.${kind}.hint`)}</p>
      {list.map((n, i) => {
        const legend = t(`plan.${kind}.item`, { n: i + 1 });
        const set = (field: 'name' | 'help' | 'phone' | 'address') => (v: string) =>
          edit((d) => {
            const x = d[kind].find((y) => y.id === n.id);
            if (x) x[field] = v;
          });
        return (
          <fieldset key={n.id} className="card form__group">
            <legend className="form__legend">{legend}</legend>
            <TextField label={t('plan.neighbor.name')} value={n.name} onChange={set('name')} />
            <TextField label={t(`plan.${kind}.help`)} value={n.help} onChange={set('help')} />
            <div className="field-pair">
              <TextField
                label={t('plan.neighbor.phone')}
                type="tel"
                value={n.phone}
                maxLength={40}
                onChange={set('phone')}
              />
              <TextField
                label={t('plan.neighbor.address')}
                value={n.address}
                onChange={set('address')}
              />
            </div>
            <RemoveButton
              label={legend}
              onClick={() => edit((d) => void (d[kind] = d[kind].filter((y) => y.id !== n.id)))}
            />
          </fieldset>
        );
      })}
      <button
        type="button"
        className="button button--ghost"
        onClick={() => edit((d) => void d[kind].push(emptyNeighbor(uid())))}
      >
        {t(`plan.${kind}.add`)}
      </button>
    </section>
  );
}

function StepNeighborhood({ plan, edit }: StepProps) {
  return (
    <>
      <NeighborList kind="helpers" list={plan.helpers} edit={edit} />
      <NeighborList kind="toHelp" list={plan.toHelp} edit={edit} />
    </>
  );
}

function ContactFields({
  legend,
  value,
  onChange,
}: {
  legend: string;
  value: PlanContact;
  onChange: (field: keyof PlanContact, v: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <fieldset className="form__group form__group--nested">
      <legend className="field__label">{legend}</legend>
      <div className="field-pair">
        <TextField
          label={t('plan.emergency.contactName')}
          value={value.name}
          maxLength={120}
          onChange={(v) => onChange('name', v)}
        />
        <TextField
          label={t('plan.emergency.contactPhone')}
          type="tel"
          value={value.phone}
          maxLength={40}
          onChange={(v) => onChange('phone', v)}
        />
      </div>
    </fieldset>
  );
}

function PlaceFields({
  legend,
  value,
  onChange,
}: {
  legend: string;
  value: PlanPlace;
  onChange: (field: keyof PlanPlace, v: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <fieldset className="form__group form__group--nested">
      <legend className="field__label">{legend}</legend>
      <TextField
        label={t('plan.emergency.shelterName')}
        value={value.name}
        maxLength={120}
        onChange={(v) => onChange('name', v)}
      />
      <div className="field-pair">
        <TextField
          label={t('plan.emergency.shelterPhone')}
          type="tel"
          value={value.phone}
          maxLength={40}
          onChange={(v) => onChange('phone', v)}
        />
        <TextField
          label={t('plan.emergency.shelterAddress')}
          value={value.address}
          onChange={(v) => onChange('address', v)}
        />
      </div>
    </fieldset>
  );
}

function StepEmergency({ plan, edit }: StepProps) {
  const { t } = useTranslation();
  const e = plan.emergency;
  type TextKey =
    'cis' | 'meeting1' | 'meeting2' | 'inform1' | 'inform2' | 'commute' | 'otherSituation';
  const setText = (field: TextKey) => (v: string) => edit((d) => void (d.emergency[field] = v));
  const setContact =
    (field: 'contact1' | 'contact2' | 'school1' | 'school2') =>
    (key: keyof PlanContact, v: string) =>
      edit((d) => void (d.emergency[field][key] = v));
  const setPlace = (field: 'shelter1' | 'shelter2') => (key: keyof PlanPlace, v: string) =>
    edit((d) => void (d.emergency[field][key] = v));

  return (
    <>
      <div className="card form__group">
        <TextField
          label={t('plan.emergency.cis')}
          hint={t('plan.emergency.cisHint')}
          value={e.cis}
          onChange={setText('cis')}
        />
      </div>
      <fieldset className="card form__group">
        <legend className="form__legend">{t('plan.emergency.meetingLegend')}</legend>
        <p className="field__hint">{t('plan.emergency.meetingHint')}</p>
        <TextField
          label={t('plan.emergency.meeting1')}
          value={e.meeting1}
          onChange={setText('meeting1')}
        />
        <TextField
          label={t('plan.emergency.meeting2')}
          value={e.meeting2}
          onChange={setText('meeting2')}
        />
      </fieldset>
      <fieldset className="card form__group">
        <legend className="form__legend">{t('plan.emergency.informLegend')}</legend>
        <p className="field__hint">{t('plan.emergency.informHint')}</p>
        <TextField
          label={t('plan.emergency.inform1')}
          value={e.inform1}
          onChange={setText('inform1')}
        />
        <TextField
          label={t('plan.emergency.inform2')}
          value={e.inform2}
          onChange={setText('inform2')}
        />
      </fieldset>
      <fieldset className="card form__group">
        <legend className="form__legend">{t('plan.emergency.contactLegend')}</legend>
        <ContactFields
          legend={t('plan.emergency.contact1')}
          value={e.contact1}
          onChange={setContact('contact1')}
        />
        <ContactFields
          legend={t('plan.emergency.contact2')}
          value={e.contact2}
          onChange={setContact('contact2')}
        />
      </fieldset>
      <fieldset className="card form__group">
        <legend className="form__legend">{t('plan.emergency.personalLegend')}</legend>
        <ContactFields
          legend={t('plan.emergency.school1')}
          value={e.school1}
          onChange={setContact('school1')}
        />
        <ContactFields
          legend={t('plan.emergency.school2')}
          value={e.school2}
          onChange={setContact('school2')}
        />
        <TextField
          label={t('plan.emergency.commute')}
          value={e.commute}
          multiline
          maxLength={500}
          onChange={setText('commute')}
        />
        <TextField
          label={t('plan.emergency.otherSituation')}
          value={e.otherSituation}
          multiline
          maxLength={500}
          onChange={setText('otherSituation')}
        />
      </fieldset>
      <fieldset className="card form__group">
        <legend className="form__legend">{t('plan.emergency.shelterLegend')}</legend>
        <PlaceFields
          legend={t('plan.emergency.shelter1')}
          value={e.shelter1}
          onChange={setPlace('shelter1')}
        />
        <PlaceFields
          legend={t('plan.emergency.shelter2')}
          value={e.shelter2}
          onChange={setPlace('shelter2')}
        />
      </fieldset>
    </>
  );
}

function StepNumbers({ plan, edit }: StepProps) {
  const { t } = useTranslation();
  return (
    <>
      <section className="card" aria-labelledby="numbers-emergency">
        <h2 id="numbers-emergency" className="form__legend">
          {t('plan.numbers.emergencyLegend')}
        </h2>
        <ul className="plain-list">
          <li>{t('plan.numbers.n112')}</li>
          <li>{t('plan.numbers.n113')}</li>
        </ul>
        <p className="note">{t('plan.numbers.warning')}</p>
      </section>
      <h2 className="section-title">{t('plan.numbers.providersLegend')}</h2>
      {PROVIDERS.map((kind) => {
        const value = plan.providers[kind];
        const set = (field: 'name' | 'customerNo' | 'phone') => (v: string) =>
          edit((d) => void (d.providers[kind][field] = v));
        return (
          <fieldset key={kind} className="card form__group">
            <legend className="form__legend">{t(`plan.numbers.kinds.${kind}`)}</legend>
            <TextField
              label={t('plan.numbers.name')}
              value={value.name}
              maxLength={120}
              onChange={set('name')}
            />
            <div className="field-pair">
              <TextField
                label={t('plan.numbers.customerNo')}
                value={value.customerNo}
                maxLength={60}
                onChange={set('customerNo')}
              />
              <TextField
                label={t('plan.numbers.phone')}
                type="tel"
                value={value.phone}
                maxLength={40}
                onChange={set('phone')}
              />
            </div>
          </fieldset>
        );
      })}
      <div className="card form__group">
        <TextField
          label={t('plan.numbers.comment')}
          value={plan.providersComment}
          multiline
          maxLength={1000}
          onChange={(v) => edit((d) => void (d.providersComment = v))}
        />
      </div>
    </>
  );
}
