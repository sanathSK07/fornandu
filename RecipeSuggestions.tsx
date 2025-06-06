import { useState, useEffect } from "react";
import { RefreshCw, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGroceryItems } from "@/hooks/useFirestore";
import { spoonacularAPI, SpoonacularRecipe } from "@/lib/spoonacular";
import { useToast } from "@/hooks/use-toast";

export default function RecipeSuggestions() {
  const { data: groceryItems } = useGroceryItems();
  const [recipes, setRecipes] = useState<SpoonacularRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getAvailableIngredients = () => {
    return groceryItems
      .filter(item => !item.isFinished)
      .map(item => item.name)
      .slice(0, 10); // Limit to avoid too long API calls
  };

  const fetchRecipes = async () => {
    const ingredients = getAvailableIngredients();
    
    if (ingredients.length === 0) {
      setRecipes([]);
      return;
    }

    setLoading(true);
    try {
      const fetchedRecipes = await spoonacularAPI.findRecipesByIngredients(ingredients, 6);
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast({
        title: "Error fetching recipes",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
      // Fallback to empty state
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [groceryItems]);

  const calculateMatchPercentage = (recipe: SpoonacularRecipe) => {
    const totalIngredients = recipe.usedIngredientCount + recipe.missedIngredientCount;
    if (totalIngredients === 0) return 0;
    return Math.round((recipe.usedIngredientCount / totalIngredients) * 100);
  };

  const handleRecipeClick = (recipe: SpoonacularRecipe) => {
    // Open recipe in new tab or show detailed view
    window.open(`https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Suggested Recipes</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Based on your available ingredients
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchRecipes}
            disabled={loading}
            className="text-primary"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm text-gray-500">Finding recipes for you...</p>
          </div>
        )}

        {!loading && groceryItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">Add some grocery items first</p>
            <p className="text-sm text-gray-400">We'll suggest recipes based on what you have</p>
          </div>
        )}

        {!loading && groceryItems.length > 0 && recipes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No recipes found</p>
            <p className="text-sm text-gray-400">Try adding more common ingredients to your pantry</p>
          </div>
        )}

        {!loading && recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipes.slice(0, 4).map((recipe) => {
              const matchPercentage = calculateMatchPercentage(recipe);
              return (
                <div
                  key={recipe.id}
                  className="border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleRecipeClick(recipe)}
                >
                  <img
                    src={recipe.image || '/api/placeholder/400/240'}
                    alt={recipe.title}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/api/placeholder/400/240';
                    }}
                  />
                  <div className="p-4">
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2 line-clamp-2">
                      {recipe.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{recipe.readyInMinutes} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                          {matchPercentage}% match
                        </Badge>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {recipes.length > 4 && (
          <Button variant="ghost" className="w-full mt-4 text-primary">
            View more recipes
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
