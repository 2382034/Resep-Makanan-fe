import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";

// Layouts
import BaseLayout from "./layouts/BaseLayout";
import RootLayout from "./layouts/RootLayout";

// Core & Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";


// --- Import Recipes Pages ---
import Recipes from "./pages/Recipes";
import AddRecipes from "./pages/AddRecipes";
import RecipesDetail from "./pages/RecipesDetail";
import EditRecipes from "./pages/EditRecipes";
// --- End Import Recipes Pages ---

// Utils & Providers
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";
import { AuthProvider } from "./utils/AuthProvider";

const queryClient = new QueryClient();

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        {/* Public Layout */}
        <Route path="/" element={<BaseLayout />}>
          <Route
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Route>

        {/* Private Layout */}
        <Route path="/" element={<RootLayout />}>
          {/* Home */}
          <Route
            index // Default route for '/' under RootLayout
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          {/* --- Recipes Routes --- */}
          <Route
            path="recipes" // Route to list all recipes
            element={
              <PrivateRoute>
                <Recipes />
              </PrivateRoute>
            }
          />
          <Route
            path="add-recipe" // Route to add a new recipe
            element={
              <PrivateRoute>
                <AddRecipes />
              </PrivateRoute>
            }
          />
          <Route
            path="recipes/:id" // Route to view recipe details
            element={
              <PrivateRoute>
                <RecipesDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="recipes/edit/:id" // Route to edit a recipe
            element={
              <PrivateRoute>
                <EditRecipes />
              </PrivateRoute>
            }
          />
          {/* --- End Recipes Routes --- */}

        </Route> {/* End RootLayout Routes */}
      </Route> // End Base Route
    )
  );

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;