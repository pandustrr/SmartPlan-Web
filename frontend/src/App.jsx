import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const html = document.documentElement;

    if (savedTheme === "dark") {
      setIsDarkMode(true);
      html.classList.add("dark");
    } else if (savedTheme === "light") {
      setIsDarkMode(false);
      html.classList.remove("dark");
    } else {
      // Use system preference
      const systemIsDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(systemIsDark);
      if (systemIsDark) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newDarkMode = !isDarkMode;

    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    localStorage.setItem("theme", newDarkMode ? "dark" : "light");

    console.log("Dark mode toggled to:", newDarkMode);
    console.log("HTML classes:", html.className);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Router>
        <Routes>
          <Route
            path="/user"
            element={
              <Dashboard
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              />
            }
          />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
