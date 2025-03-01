import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import episodeService from "../api/episodeService";

function EpisodeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      setIsLoading(true);
      try {
        const response = await episodeService.getEpisodeById(id);
        if (response.status === "success") {
          setEpisode(response.data);
        } else {
          setError("Failed to fetch episode details");
        }
      } catch (err) {
        setError("Failed to fetch episode details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEpisodeDetails();
  }, []); // Removed unnecessary dependency 'id'

  const renderStars = (rating) => {
    const fullStars = "⭐".repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? "⭐" : "";
    return fullStars + halfStar;
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto"></div>
        <p className="mt-3 text-amber-800">Loading episode details...</p>
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error || "Episode not found"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate("/episodes")}
        className="text-amber-600 hover:text-amber-800 flex items-center gap-2"
      >
        ← Back to Episodes
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6 border border-amber-200">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-bold text-amber-800">
              Episode {episode.episode_id}
            </h2>
            <div className="text-amber-500 text-xl">
              {renderStars(episode.user_rating)}
            </div>
          </div>
          <p className="text-amber-600">Filmed in {episode.year_filmed}</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-amber-800">
          Featured Dishes
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          {episode.featuredItems.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-md p-6 border ${
                item.winner
                  ? "border-amber-400 ring-2 ring-amber-400"
                  : "border-amber-200"
              }`}
            >
              {item.winner && (
                <div className="text-amber-600 font-semibold mb-2 flex items-center gap-2">
                  👑 Winner
                </div>
              )}
              <div className="space-y-2">
                <h4 className="text-xl font-semibold text-amber-800">
                  {item.recipe_name}
                </h4>
                <p className="text-amber-600">{item.cuisine_name} Cuisine</p>
                <div className="pt-2 border-t border-amber-100">
                  <p className="text-amber-700">Cook: {item.cook_name}</p>
                  <p className="text-amber-600">
                    Grade: {item.average_grade}/5
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-amber-800">Judges</h3>
        <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {episode.judges.map((judge, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="text-amber-600">#{judge.position}</div>
                <div className="text-amber-800">{judge.judge_name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EpisodeDetails;
