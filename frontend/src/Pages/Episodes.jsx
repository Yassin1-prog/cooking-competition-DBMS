import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import episodeService from "../api/episodeService";

function Episodes() {
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    setIsLoading(true);
    try {
      const response = await episodeService.getAllEpisodes();
      if (response.status === "success") {
        setEpisodes(response.data);
      } else {
        setError("Failed to fetch episodes");
      }
    } catch (err) {
      setError("Failed to fetch episodes");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Group episodes by year
  const groupedEpisodes = episodes.reduce((acc, episode) => {
    const year = episode.year_filmed;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(episode);
    return acc;
  }, {});

  // Sort years in descending order
  const sortedYears = Object.keys(groupedEpisodes).sort((a, b) => b - a);

  const renderStars = (rating) => {
    const fullStars = "⭐".repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? "⭐" : "";
    return fullStars + halfStar;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-amber-800">Episodes</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto"></div>
          <p className="mt-3 text-amber-800">Loading episodes...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {sortedYears.map((year) => (
            <div key={year} className="space-y-4">
              <h3 className="text-2xl font-semibold text-amber-700 border-b border-amber-200 pb-2">
                {year}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedEpisodes[year].reverse().map((episode) => (
                  <div
                    key={episode.episode_id}
                    onClick={() => navigate(`/episodes/${episode.episode_id}`)}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200 hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-xl font-semibold text-amber-800">
                          Episode {episode.episode_id}
                        </h4>
                        <div className="text-amber-500">
                          {renderStars(episode.user_rating)}
                        </div>
                      </div>
                      <div className="text-amber-600 text-sm">
                        Rating: {episode.user_rating}/10
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Episodes;
