import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { recipesFor, tx, type Recipe } from '@kitzy/core';
import { useContent } from '../lib/content';
import { Loading } from '../components/Loading';
import { useKitzy } from '../data/derived';
import { recordActivity } from '../data/store';
import { announce } from '../lib/announce';
import { formatDate, formatQuantity } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import { DonePanel } from './Rituals';
import { NotFound } from './NotFound';

/** Pastilles d'une recette : durée, cuisson, eau. */
function RecipeFacts({ recipe }: { recipe: Recipe }) {
  const { t } = useTranslation();
  return (
    <ul className="chips">
      <li className="chip">{t('recipes.minutes', { count: recipe.minutes })}</li>
      <li className="chip">{t(recipe.cooking === 'none' ? 'recipes.none' : 'recipes.stove')}</li>
      <li className="chip">
        {recipe.water > 0
          ? t('recipes.water', { quantity: formatQuantity(recipe.water, 'L') })
          : t('recipes.noWater')}
      </li>
    </ul>
  );
}

function RecipeCards({
  recipes,
  headingLevel = 3,
}: {
  recipes: readonly Recipe[];
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <ul className="guide-list">
      {recipes.map((recipe) => (
        <li key={recipe.id} className="card guide-card">
          <Heading className="guide-card__title">
            <Link to={`/recettes/${recipe.id}`}>{recipe.title}</Link>
          </Heading>
          <p className="muted">{recipe.summary}</p>
          <RecipeFacts recipe={recipe} />
        </li>
      ))}
    </ul>
  );
}

/** Soirée conserves : ce qui approche de sa date d'abord, puis toutes les recettes. */
export function RecipeIndex() {
  const { t } = useTranslation();
  usePageTitle(t('recipes.title'));
  const { recipes: RECIPES } = useContent();
  const data = useKitzy();
  if (!data) return <Loading />;
  const soon = data.rotate;
  const suggested = recipesFor(
    RECIPES,
    soon.map((r) => r.key),
  );

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/activites">{t('activities.title')}</Link>
      </p>
      <h1 tabIndex={-1}>{t('recipes.title')}</h1>
      <p className="lead">{t('recipes.intro')}</p>

      {soon.length > 0 && (
        <section className="kit-group" aria-labelledby="recipes-soon">
          <h2 id="recipes-soon" className="section-title">
            {t('recipes.soon')}
          </h2>
          <div className="note">
            <p>{t('recipes.soonText')}</p>
            <ul className="plain-list">
              {soon.map((row) => (
                <li key={`${row.kit.id}-${row.key}`}>
                  <Link to={`/kits/${row.kit.id}/${row.key}`}>
                    {t('recipes.soonDate', {
                      name: row.name,
                      date: row.status.nextExpiry ? formatDate(row.status.nextExpiry) : '',
                    })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {suggested.length > 0 && (
            <>
              <h3 className="toc__label">{t('recipes.forSoon')}</h3>
              <RecipeCards recipes={suggested} />
            </>
          )}
        </section>
      )}

      <section className="kit-group" aria-labelledby="recipes-all">
        <h2 id="recipes-all" className="section-title">
          {t('recipes.all')}
        </h2>
        <RecipeCards recipes={RECIPES} />
      </section>
    </div>
  );
}

/** Une recette : ingrédients (avec ce qui est déjà dans la réserve), étapes, astuce. */
export function RecipePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { recipes: RECIPES } = useContent();
  const recipe = RECIPES.find((r) => r.id === id);
  usePageTitle(recipe?.title ?? t('recipes.title'));
  const data = useKitzy();
  const [cooked, setCooked] = useState(false);
  if (!recipe) return <NotFound />;
  if (!data) return <Loading />;

  const used = [
    ...new Set(
      recipe.ingredients
        .map((i) => i.templateId)
        .filter((id): id is string => Boolean(id && data.owned.has(id))),
    ),
  ];
  const usedRows = data.kits
    .filter((k) => k.type === 'home')
    .flatMap((kit) => used.map((key) => ({ kit, key })));

  return (
    <div className="page recipe">
      <p className="breadcrumb">
        <Link to="/recettes">{t('recipes.back')}</Link>
      </p>
      <h1 tabIndex={-1}>{recipe.title}</h1>
      <p className="lead">{recipe.summary}</p>
      <RecipeFacts recipe={recipe} />
      <p className="muted">{t('recipes.serves', { count: recipe.serves })}</p>

      <section className="card" aria-labelledby="recipe-ingredients">
        <h2 id="recipe-ingredients" className="card__label">
          {t('recipes.ingredients')}
        </h2>
        <ul className="prose-list">
          {recipe.ingredients.map((ing) => (
            <li key={ing.text}>
              {ing.text}
              {ing.templateId && data.owned.has(ing.templateId) && (
                <span className="tag tag--done recipe__stock">{t('recipes.inStock')}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="kit-group" aria-labelledby="recipe-steps">
        <h2 id="recipe-steps" className="section-title">
          {t('recipes.steps')}
        </h2>
        <ol className="prose-list prose-list--steps">
          {recipe.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      {recipe.tip && <p className="note">{recipe.tip}</p>}
      {recipe.cooking === 'stove' && <p className="note note--warning">{t('recipes.safety')}</p>}

      {cooked ? (
        <DonePanel>
          {usedRows.length > 0 && (
            <>
              <p>{t('recipes.cookedDone')}</p>
              <ul className="plain-list">
                {usedRows.map(({ kit, key }) => (
                  <li key={key}>
                    <Link to={`/kits/${kit.id}/${key}`}>
                      {tx(
                        data.ctx.catalog.find((c) => c.id === key)?.name ?? { fr: key },
                        data.ctx.locale,
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </DonePanel>
      ) : (
        <button
          type="button"
          className="button"
          onClick={async () => {
            await recordActivity('recettes');
            setCooked(true);
            announce(t('recipes.cookedSaved'));
          }}
        >
          {t('recipes.cooked')}
        </button>
      )}
    </div>
  );
}
