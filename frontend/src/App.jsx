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
            <Route path="*" element={<Navigate to="/cuisines" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
