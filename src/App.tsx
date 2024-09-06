import React from "react";
import { Header } from "./components/header";
import { Admin } from "./pages/admin";
import { Login } from "./pages/login"; // Import the Login component
import { Home } from "./pages/home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { appwrite } from "./lib"; // Import the Appwrite instance

// A higher-order component to protect routes
const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(
    null
  );

  React.useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await appwrite.account.get(); // Check if the user is logged in
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return <p>Loading...</p>; // Optionally add a loading state
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="app">
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={<ProtectedRoute element={<Admin />} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export { App };
