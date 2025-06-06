import { useState, useEffect } from "react";
import { Search, Clock, Heart, ExternalLink, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGroceryItems } from "@/hooks/useFirestore";
import { spoonacularAPI, SpoonacularRecipe } from "@/lib/spoonacular";
import { useToast } from "@/hooks/use-toast";

export default function Recipes() {
  const { data: groceryItems } = useGroceryItems();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRecipes, setSuggestedRecipes] = useState<SpoonacularRecipe[]>([]);
  const [searchResults, setSearchResults] = useState<SpoonacularRecipe[]>([]);
  const [randomRecipes, setRandomRecipes] = useState<SpoonacularRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("suggested");
  const { toast } = useToast();

  const getAvailableIngredients = () => {
    return groceryItems
      .filter(item => !item.isFinished)
      .map(item => item.name)
      .slice(0, 10);
  };

  const fetchSuggestedRecipes = async () => {
    const ingredients = getAvailableIngredients();
    if (ingredients.length === 0) {
      setSuggestedRecipes([]);
      return;
    }

    setLoading(true);
    try {
      const recipes = await spoonacularAPI.findRecipesByIngredients(ingredients, 12);
      setSuggestedRecipes(recipes);
    } catch (error) {
      console.error("Error fetching suggested recipes:", error);
      toast({
        title: "Error fetching recipes",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomRecipes = async () => {
    setLoading(true);
    try {
      const result = await spoonacularAPI.getRandomRecipes("", 12);
      setRandomRecipes(result.recipes);
    } catch (error) {
      console.error("Error fetching random recipes:", error);
      toast({
        title: "Error fetching recipes",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const result = await spoonacularAPI.searchRecipes(searchQuery, 12);
      setSearchResults(result.results);
      setActiveTab("search");
    } catch (error) {
      console.error("Error searching recipes:", error);
      toast({
        title: "Error searching recipes",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestedRecipes();
    fetchRandomRecipes();
  }, [groceryItems]);

  const calculateMatchPercentage = (recipe: SpoonacularRecipe) => {
    const totalIngredients = recipe.usedIngredientCount + recipe.missedIngredientCount;
    if (totalIngredients === 0) return 0;
    return Math.round((recipe.usedIngredientCount / totalIngredients) * 100);
  };

  const handleRecipeClick = (recipe: SpoonacularRecipe) => {
    window.open(`https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`, '_blank');
  };

  const RecipeGrid = ({ recipes }: { recipes: SpoonacularRecipe[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => {
        const matchPercentage = calculateMatchPercentage(recipe);
        return (
          <Card
            key={recipe.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleRecipeClick(recipe)}
          >
            <div className="relative">
              <img
                src={recipe.image || '/api/placeholder/400/240'}
                alt={recipe.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/400/240';
                }}
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-white/90 text-gray-800">
                  <Clock className="h-3 w-3 mr-1" />
                  {recipe.readyInMinutes}m
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {recipe.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {matchPercentage > 0 && (
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                      {matchPercentage}% match
                    </Badge>
                  )}
                  {recipe.likes && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Heart className="h-3 w-3 mr-1" />
                      {recipe.likes}
                    </div>
                  )}
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 md:pb-0">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Recipes
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex space-x-2 mb-6">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for recipes..."
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="suggested">Suggested</TabsTrigger>
                {searchResults.length > 0 && (
                  <TabsTrigger value="search">Search Results</TabsTrigger>
                )}
                <TabsTrigger value="random">Discover</TabsTrigger>
              </TabsList>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={activeTab === "suggested" ? fetchSuggestedRecipes : fetchRandomRecipes}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            <div className="mt-6">
              <TabsContent value="suggested">
                {loading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Finding recipes for you...</p>
                  </div>
                ) : groceryItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-2">Add some grocery items first</p>
                    <p className="text-sm text-muted-foreground">We'll suggest recipes based on what you have</p>
                  </div>
                ) : suggestedRecipes.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-2">No recipes found</p>
                    <p className="text-sm text-muted-foreground">Try adding more common ingredients to your pantry</p>
                  </div>
                ) : (
                  <RecipeGrid recipes={suggestedRecipes} />
                )}
              </TabsContent>

              <TabsContent value="search">
                {searchResults.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No search results found</p>
                  </div>
                ) : (
                  <RecipeGrid recipes={searchResults} />
                )}
              </TabsContent>

              <TabsContent value="random">
                {loading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading recipes...</p>
                  </div>
                ) : (
                  <RecipeGrid recipes={randomRecipes} />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
