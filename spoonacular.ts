const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  missedIngredientCount: number;
  usedIngredientCount: number;
  likes: number;
}

export interface SpoonacularDetailedRecipe extends SpoonacularRecipe {
  analyzedInstructions: Array<{
    steps: Array<{
      number: number;
      step: string;
    }>;
  }>;
  extendedIngredients: Array<{
    original: string;
    name: string;
    amount: number;
    unit: string;
  }>;
}

export class SpoonacularAPI {
  private apiKey: string;

  constructor() {
    this.apiKey = SPOONACULAR_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Spoonacular API key not found. Recipe features will be limited.');
    }
  }

  async findRecipesByIngredients(ingredients: string[], number: number = 12): Promise<SpoonacularRecipe[]> {
    if (!this.apiKey) {
      throw new Error('Spoonacular API key is required');
    }

    const ingredientList = ingredients.join(',+');
    const url = `${BASE_URL}/findByIngredients?apiKey=${this.apiKey}&ingredients=${ingredientList}&number=${number}&ranking=2&ignorePantry=true`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipes by ingredients:', error);
      throw error;
    }
  }

  async getRecipeInformation(id: number): Promise<SpoonacularDetailedRecipe> {
    if (!this.apiKey) {
      throw new Error('Spoonacular API key is required');
    }

    const url = `${BASE_URL}/${id}/information?apiKey=${this.apiKey}&includeNutrition=false`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipe information:', error);
      throw error;
    }
  }

  async searchRecipes(query: string, number: number = 12): Promise<{ results: SpoonacularRecipe[] }> {
    if (!this.apiKey) {
      throw new Error('Spoonacular API key is required');
    }

    const url = `${BASE_URL}/complexSearch?apiKey=${this.apiKey}&query=${encodeURIComponent(query)}&number=${number}&addRecipeInformation=true`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  }

  async getRandomRecipes(tags?: string, number: number = 6): Promise<{ recipes: SpoonacularRecipe[] }> {
    if (!this.apiKey) {
      throw new Error('Spoonacular API key is required');
    }

    let url = `${BASE_URL}/random?apiKey=${this.apiKey}&number=${number}`;
    if (tags) {
      url += `&tags=${tags}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching random recipes:', error);
      throw error;
    }
  }
}

export const spoonacularAPI = new SpoonacularAPI();
