/**
 * Photos des recettes, tirées de Wikimedia Commons. Chacune garde sa licence (CC0, CC BY ou
 * CC BY-SA) : la page de la recette crédite l'auteur et la licence, avec un lien vers la source.
 * Recadrées en 3:2 (1200 × 800) et converties en WebP : landing/public/images/recettes/.
 * Une recette absente d'ici s'affiche sans photo.
 */
export interface RecipePhoto {
  author: string;
  license: string;
  licenseUrl: string;
  /** Page de la photo sur Wikimedia Commons. */
  source: string;
  width: number;
  height: number;
}

export const RECIPE_PHOTOS: Readonly<Record<string, RecipePhoto>> = {
  'chili-express': {
    author: 'Aerith',
    license: 'CC0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0',
    source: 'https://commons.wikimedia.org/wiki/File:Chili_con_carne_cuisson.jpg',
    width: 1200,
    height: 800,
  },
  'salade-lentilles': {
    author: 'Joey Doll',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Lentil_salad_(29308018298).jpg',
    width: 1200,
    height: 800,
  },
  'soupe-pois-chiches': {
    author: 'A Healthier Michigan from Detroit, United States',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Mediterranean_Chickpea_Soup_(34817152586).jpg',
    width: 1200,
    height: 800,
  },
  'riz-au-lait': {
    author: 'Ross Berteig from Monrovia, California, USA',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Rice_pudding_cinnamon.jpg',
    width: 1200,
    height: 800,
  },
  'couscous-express': {
    author: 'Luca Nebuloni from Milan, Italy',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Couscous_with_vegetables_(6177185023).jpg',
    width: 1200,
    height: 800,
  },
};

/** Chemin de la photo depuis la racine du site. */
export const recipePhotoPath = (id: string) => `images/recettes/${id}.webp`;
