import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./Components/Header";
import Cuisines from "./Pages/Cuisines";
import Ingredients from "./Pages/Ingredients";
import Tools from "./Pages/Tools";
import Episodes from "./Pages/Episodes";
import EpisodeDetails from "./Pages/EpisodeDetails";
import Cooks from "./Pages/Cooks";
import CookDetails from "./Pages/CookDetails";
import NewCook from "./Pages/NewCook";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-amber-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/cuisines" element={<Cuisines />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/episodes" element={<Episodes />} />
            <Route path="/episodes/:id" element={<EpisodeDetails />} />
            <Route path="/cooks" element={<Cooks />} />
            <Route path="/cooks/:id" element={<CookDetails />} />
            <Route path="/cooks/new" element={<NewCook />} />
            <Route path="/cooks/edit/:id" element={<NewCook />} />
            <Route path="*" element={<Navigate to="/cuisines" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
