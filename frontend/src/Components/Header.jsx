import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-amber-700 text-white"
      : "text-amber-900 hover:bg-amber-200";
  };

  return (
    <header className="bg-amber-100 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/recipes" className="text-4xl font-bold text-amber-800">
              Master Chef
            </Link>
          </div>

          <nav className="flex space-x-2">
            <Link
              to="/recipes"
              className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium ${isActive(
                "/recipes"
              )}`}
            >
              Recipes
            </Link>
            <Link
              to="/cooks"
              className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium ${isActive(
                "/cooks"
              )}`}
            >
              Cooks
            </Link>
            <Link
              to="/episodes"
              className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium ${isActive(
                "/episodes"
              )}`}
            >
              Episodes
            </Link>
            <Link
              to="/cuisines"
              className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium ${isActive(
                "/cuisines"
              )}`}
            >
              Cuisines
            </Link>
            <Link
              to="/ingredients"
              className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium ${isActive(
                "/ingredients"
              )}`}
            >
              Ingredients
            </Link>
            <Link
              to="/tools"
              className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium ${isActive(
                "/tools"
              )}`}
            >
              Tools
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
