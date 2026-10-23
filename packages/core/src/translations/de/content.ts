/** Contenus traduits, assemblés depuis `content/`. Un texte manquant retombe sur le français. */
import type { ContentTranslation } from '../types';
import { catalog } from './content/catalog';
import { guide } from './content/guide';
import { products } from './content/products';
import { quiz } from './content/quiz';
import { recipes } from './content/recipes';
import { simulation } from './content/simulation';
import { tasks } from './content/tasks';

export const content: ContentTranslation = {
  catalog,
  guide,
  tasks,
  recipes,
  quiz,
  simulation,
  products,
};
