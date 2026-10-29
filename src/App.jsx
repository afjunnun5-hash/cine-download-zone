import React, { useState, useEffect } from 'react';
import { Play, Heart, Search, Home, Compass, Star, X, Menu, Server } from 'lucide-react';

const TMDB_API_KEY = "89260c6943a055be3d0016e6d1c81525"; // Public TMDB API Key
const STREAM_SERVERS = [
  { name: "Server 1 (VidSrc)", url: (id) => `https://vidsrc.to/embed/movie/${id}` },
  { name: "Server 2 (Embed.su)", url: (id) => `https://embed.su/embed/movie/${id}` },
  { name: "Server 3 (VidSrc.cc)", url: (id) => `https://vidsrc.cc/v2/embed/movie/${id}` },
  { name: "Server 4 (2Embed)", url: (id) => `https://www.2embed.cc/embed/${id}` }
];

export default function App() {
  const [movies, setMovies] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeServerIndex, setActiveServerIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // TMDB API theke automatic notun trending movie fetch korar logic
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const formattedMovies = data.results.map((item) => ({
            id: item.id,
            title: item.title || item.original_title,
            year: item.release_date ? item.release_date.split('-')[0] : 'N/A',
            poster: item.poster_path 
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60',
            backdrop: item.backdrop_path 
              ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
              : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1000&auto=format&fit=crop&q=60',
            desc: item.overview || 'No description available.'
          }));
          setMovies(formattedMovies);
          setFeatured(formattedMovies[0]);
        }
      } catch (error) {
        console.error("Error fetching movies from TMDB:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  // Search functionality (Automatic API Search)
  useEffect(() => {
    if (!searchQuery.trim()) return;
    
    const searchMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}`
        );
        const data = await response.json();
        if (data.results) {
          const formatted = data.results.map((item) => ({
            id: item.id,
            title: item.title || item.original_title,
            year: item.release_date ? item.release_date.split('-')[0] : 'N/A',
            poster: item.poster_path 
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60',
            backdrop: item.backdrop_path 
              ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
              : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1000&auto=format&fit=crop&q=60',
            desc: item.overview || 'No description available.'
          }));
          setMovies(formatted);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    const timer = setTimeout(() => searchMovies(), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#141416] flex items-center justify-center">
        <div className="text-emerald-500 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="tracking-widest font-mono text-sm">FETCHING LATEST MOVIES...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#141416] text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#1a1c1f] p-6 flex flex-col transition-transform duration-300 z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between lg:justify-center mb-10">
          <h1 className="text-xl font-bold tracking-wider text-white">
            CINE<span className="text-emerald-500">ZONE</span>
          </h1>
          <button className="lg:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Menu</p>
            <a href="#" className="flex items-center gap-4 text-emerald-500 font-medium px-2"><Home size={20} /> Home</a>
            <a href="#" className="flex items-center gap-4 text-gray-400 hover:text-white transition px-2"><Heart size={20} /> Watchlist</a>
            <a href="#" className="flex items-center gap-4 text-gray-400 hover:text-white transition px-2"><Compass size={20} /> Discover</a>
            <a href="#" className="flex items-center gap-4 text-gray-400 hover:text-white transition px-2"><Star size={20} /> Popular</a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <header className="px-8 py-6 flex items-center justify-between sticky top-0 z-40 bg-[#141416]/80 backdrop-blur-md">
          <button className="lg:hidden text-gray-400" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search any movie live..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1c1f] text-sm text-white rounded-full py-2.5 pl-11 pr-4 focus:outline-none border border-gray-800 focus:border-emerald-500"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-emerald-500 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Auto-Sync Active
            </span>
          </div>
        </header>

        {featured && !searchQuery && (
          <div className="px-8 mb-10">
            <div className="relative w-full h-[380px] rounded-3xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10"></div>
              <img 
                src={featured.backdrop} 
                alt={featured.title} 
                onError={handleImageError}
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition duration-700" 
              />
              
              <div className="absolute bottom-0 left-0 z-20 p-8 max-w-2xl">
                <h2 className="text-3xl font-bold mb-3">{featured.title}</h2>
                <p className="text-gray-300 text-sm mb-5 line-clamp-2">{featured.desc}</p>
                <button 
                  onClick={() => { setSelectedMovie(featured); setActiveServerIndex(0); }}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium flex items-center gap-2 transition"
                >
                  <Play size={18} fill="currentColor" /> Play Movie
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="px-8 pb-10 flex-1">
          <h3 className="text-lg font-semibold mb-6">{searchQuery ? 'Search Results' : 'Trending Movies Today'}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map(movie => (
              <div 
                key={movie.id} 
                className="group relative rounded-xl overflow-hidden cursor-pointer bg-[#1a1c1f]"
                onClick={() => { setSelectedMovie(movie); setActiveServerIndex(0); }}
              >
                <div className="aspect-[2/3] w-full bg-gray-900">
                  <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    onError={handleImageError}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110 group-hover:opacity-40" 
                  />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 z-10">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/30">
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </div>
                  <p className="text-white font-medium text-center px-4 text-sm">{movie.title}</p>
                  <p className="text-gray-400 text-xs mt-1">{movie.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Video Player Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col">
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold">{selectedMovie.title} ({selectedMovie.year})</h3>
              <p className="text-xs text-gray-400">Click Play button inside the player frame below</p>
            </div>
            <button 
              onClick={() => setSelectedMovie(null)} 
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 w-full bg-black relative flex items-center justify-center p-2">
            <iframe 
              key={`${selectedMovie.id}-${activeServerIndex}`}
              src={STREAM_SERVERS[activeServerIndex].url(selectedMovie.id)} 
              className="w-full h-full max-w-6xl max-h-[80vh] rounded-lg border border-white/10"
              allowFullScreen
              frameBorder="0"
            ></iframe>
          </div>

          <div className="p-4 bg-[#1a1c1f] border-t border-white/10 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs text-gray-400 flex items-center gap-1 mr-2"><Server size={14} /> Change Stream Server:</span>
            {STREAM_SERVERS.map((server, idx) => (
              <button
                key={idx}
                onClick={() => setActiveServerIndex(idx)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                  activeServerIndex === idx 
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                {server.name}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}