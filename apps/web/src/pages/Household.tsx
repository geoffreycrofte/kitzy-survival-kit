import { useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_DURATION_DAYS,
  MAX_DURATION_DAYS,
  MIN_DURATION_DAYS,
  countMembers,
  type Household as HouseholdData,
  type Member,
  type PetSpecies,
} from '@kitzy/core';
import { Stepper } from '../components/Stepper';
import { useKitzy } from '../data/derived';
import { saveHousehold, suggestedBags } from '../data/store';
import { announce } from '../lib/announce';
import { usePageTitle } from '../lib/usePageTitle';

interface Counts {
  adults: number;
  seniors: number;
  children: number;
  infants: number;
  dogs: number;
  cats: number;
  otherPets: number;
}

const EMPTY: Counts = {
  adults: 0,
  seniors: 0,
  children: 0,
  infants: 0,
  dogs: 0,
  cats: 0,
  otherPets: 0,
};

function toMembers(c: Counts): Member[] {
  const members: Member[] = [];
  const add = (n: number, type: Member['type'], petSpecies?: PetSpecies) => {
    for (let i = 1; i <= n; i++) {
      const id = petSpecies ? `${petSpecies}-${i}` : `${type}-${i}`;
      members.push(petSpecies ? { id, type, petSpecies } : { id, type });
    }
  };
  add(c.adults, 'adult');
  add(c.seniors, 'senior');
  add(c.children, 'child');
  add(c.infants, 'infant');
  add(c.dogs, 'pet', 'dog');
  add(c.cats, 'pet', 'cat');
  add(c.otherPets, 'pet', 'other');
  return members;
}

function fromHousehold(h: HouseholdData): Counts {
  const pets = (s: PetSpecies) => h.members.filter((m) => m.petSpecies === s).length;
  const c = countMembers(h);
  return {
    adults: c.adults,
    seniors: c.seniors,
    children: c.children,
    infants: c.infants,
    dogs: pets('dog'),
    cats: pets('cat'),
    otherPets: pets('other'),
  };
}

export function Household() {
  const { t } = useTranslation();
  usePageTitle(t('household.title'));
  const data = useKitzy();
  if (!data) return <p>{t('app.loading')}</p>;
  return (
    <HouseholdForm
      initialCounts={data.household ? fromHousehold(data.household) : { ...EMPTY, adults: 1 }}
      initialDuration={data.household?.durationDays ?? DEFAULT_DURATION_DAYS}
      initialBags={data.household ? data.kits.filter((k) => k.type === 'go-bag').length : null}
    />
  );
}

interface FormProps {
  initialCounts: Counts;
  initialDuration: number;
  initialBags: number | null;
}

function HouseholdForm({ initialCounts, initialDuration, initialBags }: FormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [counts, setCounts] = useState<Counts>(initialCounts);
  const [duration, setDuration] = useState(initialDuration);
  const [bags, setBags] = useState<number | null>(initialBags);
  const [error, setError] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const household: HouseholdData = { members: toMembers(counts), durationDays: duration };
  const people = counts.adults + counts.seniors + counts.children + counts.infants;
  const suggestion = suggestedBags(household);
  const bagCount = bags ?? suggestion;
  const update = (key: keyof Counts) => (value: number) => setCounts({ ...counts, [key]: value });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (people === 0) {
      setError(true);
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    await saveHousehold(household, bagCount);
    announce(t('household.saved'));
    navigate('/');
  };

  return (
    <div className="page">
      <h1 tabIndex={-1}>{t('household.title')}</h1>
      <p className="lead">{t('household.intro')}</p>

      {error && (
        <div ref={errorRef} tabIndex={-1} className="form-error" role="alert">
          <p>
            <strong>{t('household.errorSummary')}</strong>{' '}
            <a href="#household-people">{t('household.errorEmpty')}</a>
          </p>
        </div>
      )}

      <form className="form" onSubmit={submit} noValidate>
        <fieldset id="household-people" className="card form__group">
          <legend className="form__legend">{t('household.people')}</legend>
          {error && people === 0 && <p className="field__error">{t('household.errorEmpty')}</p>}
          <Stepper
            label={t('household.adults')}
            value={counts.adults}
            onChange={update('adults')}
          />
          <Stepper
            label={t('household.seniors')}
            value={counts.seniors}
            onChange={update('seniors')}
          />
          <Stepper
            label={t('household.children')}
            value={counts.children}
            onChange={update('children')}
          />
          <Stepper
            label={t('household.infants')}
            value={counts.infants}
            onChange={update('infants')}
            hint={t('household.infantsHint')}
          />
        </fieldset>

        <fieldset className="card form__group">
          <legend className="form__legend">{t('household.pets')}</legend>
          <Stepper label={t('household.dogs')} value={counts.dogs} onChange={update('dogs')} />
          <Stepper label={t('household.cats')} value={counts.cats} onChange={update('cats')} />
          <Stepper
            label={t('household.otherPets')}
            value={counts.otherPets}
            onChange={update('otherPets')}
          />
        </fieldset>

        <div className="card form__group">
          <label htmlFor="duration" className="form__legend">
            {t('household.duration')}
          </label>
          <p id="duration-hint" className="field__hint">
            {t('household.durationHint')}
          </p>
          <select
            id="duration"
            className="select"
            aria-describedby="duration-hint"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            {Array.from(
              { length: MAX_DURATION_DAYS - MIN_DURATION_DAYS + 1 },
              (_, i) => i + MIN_DURATION_DAYS,
            ).map((d) => (
              <option key={d} value={d}>
                {d === DEFAULT_DURATION_DAYS
                  ? t('household.durationDefault')
                  : t('household.durationOption', { count: d })}
              </option>
            ))}
          </select>
        </div>

        <div className="card form__group">
          <Stepper
            label={t('household.bags')}
            value={bagCount}
            onChange={setBags}
            max={12}
            hint={`${t('household.bagsHint', { count: suggestion })} ${t('household.bagRemovalWarning')}`}
          />
        </div>

        <button type="submit" className="button">
          {t('household.save')}
        </button>
      </form>
    </div>
  );
}
