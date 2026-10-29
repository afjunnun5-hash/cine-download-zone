import React, { useState, useEffect } from 'react';
import { Play, Heart, Search, Home, Compass, Star, X, Menu, Server, ExternalLink, Film, Flame } from 'lucide-react';

const TMDB_API_KEY = "89260c6943a055be3d0016e6d1c81525";

// ব্যাকআপ ডাটা (ক্যাটাগরি অনুযায়ী সাজানো)
const FALLBACK_CATEGORIES = {
  popular: [
    { id: 533535, title: "Deadpool & Wolverine", year: "2024", genre: "Action/Comedy", poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", backdrop: "https://image.tmdb.org/t/p/original/9l1eZiJHmhr5jIlthMdJN5WYoff.jpg", desc: "Wolverine team up with Deadpool to defeat a common enemy." },
    { id: 872585, title: "Oppenheimer", year: "2023", genre: "Drama/History", poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", backdrop: "https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBRoOoA0i.jpg", desc: "The story of J. Robert Oppenheimer's atomic bomb creation." },
    { id: 603692, title: "John Wick: Chapter 4", year: "2023", genre: "Action/Thriller", poster: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg", backdrop: "https://image.tmdb.org/t/p/original/7I6VUdPj6tQECNHdviJkUHD2u89.jpg", desc: "John Wick uncovers a path to defeating The High Table." },
    { id: 1011985, title: "Kung Fu Panda 4", year: "2024", genre: "Animation", poster: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3A1A31A7.jpg", backdrop: "https://image.tmdb.org/t/p/original/1X28aw1P3isM319vhR3ioS2P9v1.jpg", desc: "Po must train a new Dragon Warrior." }
  ],
  action: [
    { id: 155, title: "The Dark Knight", year: "2008", genre: "Action/Crime", poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", desc: "Batman battles the Joker in Gotham City." },
    { id: 634649, title: "Spider-Man: No Way Home", year: "2021", genre: "Action/Sci-Fi", poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1R80vEVG84uR08.jpg", desc: "Spider-Man deals with multiversal threats." },
    { id: 299536, title: "Avengers: Infinity War", year: "2018", genre: "Action/Sci-Fi", poster: "https://image.tmdb.org/t/p/w500/7WsyChLLEz3IawhUlGzsd3A1Gv1.jpg", desc: "Avengers fight Thanos to save the universe." }
  ],
  scifi: [
    { id: 27205, title: "Inception", year: "2010", genre: "Sci-Fi/Action", poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", desc: "A thief who steals corporate secrets through dream-sharing." },
    { id: 157336, title: "Interstellar", year: "2014", genre: "Sci-Fi/Drama", poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", desc: "Explorers travel through a space wormhole." },
    { id: 76600, title: "Avatar: The Way of Water", year: "2022", genre: "Sci-Fi/Adventure", poster: "https://image.tmdb.org/t/p/w500/t6HIqrB5F9Z8Vl4sUq27Z86L8gZ.jpg", desc: "Jake Sully protects his family on Pandora." }
  ]
};

const STREAM_SERVERS = [
  { name: "Server 1 (VidSrc CC)", url: (id) => `https://vidsrc.cc/v2/embed/movie/${id}` },
  { name: "Server 2 (Embed.su)", url: (id) => `https://embed.su/embed/movie/${id}` },
  { name: "Server 3 (VidSrc.to)", url: (id) => `https://vidsrc.to/embed/movie/${id}` },
  { name: "Server 4 (AutoEmbed)", url: (id) => `https://autoembed.co/movie/tmdb/${id}` }
];

export default function App() {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [featured, setFeatured] = useState(FALLBACK_CATEGORIES.popular[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeServerIndex, setActiveServerIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // TMDB API থেকে ক্যাটাগরি অনুযায়ী মুভি টানা
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const [popRes, actRes, sciRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=878`)
        ]);

        const formatMovies = (data) => data.results?.map(item => ({
          id: item.id,
          title: item.title || item.original_title,
          year: item.release_date ? item.release_date.split('-')[0] : 'N/A',
          poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
          backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1000',
          desc: item.overview || 'No description available.'
        })) || [];

        if (popRes.ok) {
          const popData = await popRes.json();
          const actData = await actRes.json();
          const sciData = await sciRes.json();

          const newCategories = {
            popular: formatMovies(popData),
            action: formatMovies(actData),
            scifi: formatMovies(sciData)
          };

          setCategories(newCategories);
          if (newCategories.popular.length > 0) {
            setFeatured(newCategories.popular[0]);
          }
        }
      } catch (err) {
        console.log("Using backup categories data.");
      }
    };

    fetchAllCategories();
  }, []);

  // সার্চ লজিক
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchMovies = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.results) {
          setSearchResults(data.results.map(item => ({
            id: item.id,
            title: item.title || item.original_title,
            year: item.release_date ? item.release_date.split('-')[0] : 'N/A',
            poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
            desc: item.overview || 'No description available.'
          })));
        }
      } catch (err) {
        console.error(err);
      }
    };

    const timer = setTimeout(() => searchMovies(), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const MovieGrid = ({ title, moviesList, icon: Icon }) => (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="text-emerald-500" size={20} />}
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {moviesList.map(movie => (
          <div 
            key={movie.id} 
            className="group relative rounded-xl overflow-hidden cursor-pointer bg-[#1a1c1f] hover:ring-2 hover:ring-emerald-500 transition"
            onClick={() => { setSelectedMovie(movie); setActiveServerIndex(0); }}
          >
            <div className="aspect-[2/3] w-full bg-gray-900">
              <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110 group-hover:opacity-40" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 z-10 p-2">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/30">
                <Play size={20} fill="currentColor" className="ml-1 text-white" />
              </div>
              <p className="text-white font-medium text-center text-xs line-clamp-1">{movie.title}</p>
              <p className="text-emerald-400 text-[10px] mt-0.5">{movie.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Categories</p>
            <a href="#popular" className="flex items-center gap-4 text-emerald-500 font-medium px-2"><Flame size={18} /> Popular</a>
            <a href="#action" className="flex items-center gap-4 text-gray-400 hover:text-white transition px-2"><Film size={18} /> Action Blockbusters</a>
            <a href="#scifi" className="flex items-center gap-4 text-gray-400 hover:text-white transition px-2"><Compass size={18} /> Sci-Fi World</a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto px-6 md:px-10 py-6">
        <header className="flex items-center justify-between mb-8 sticky top-0 z-40 bg-[#141416]/90 backdrop-blur-md py-2">
          <button className="lg:hidden text-gray-400" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search 10,000+ movies..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1c1f] text-sm text-white rounded-full py-2.5 pl-11 pr-4 focus:outline-none border border-gray-800 focus:border-emerald-500"
            />
          </div>
          
          <span className="text-xs text-emerald-500 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full">
            Live TMDB Engine
          </span>
        </header>

        {/* Search Results / Categories View */}
        {searchQuery ? (
          <MovieGrid title={`Search Results for "${searchQuery}"`} moviesList={searchResults} icon={Search} />
        ) : (
          <>
            {featured && (
              <div className="mb-10 relative w-full h-[320px] md:h-[380px] rounded-3xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10"></div>
                <img src={featured.backdrop} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 z-20 p-8 max-w-2xl">
                  <span className="text-emerald-500 text-xs font-semibold uppercase tracking-widest mb-2 block">Featured Movie</span>
                  <h2 className="text-3xl font-bold mb-3">{featured.title}</h2>
                  <p className="text-gray-300 text-xs md:text-sm mb-5 line-clamp-2">{featured.desc}</p>
                  <button 
                    onClick={() => { setSelectedMovie(featured); setActiveServerIndex(0); }}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium flex items-center gap-2 transition text-sm"
                  >
                    <Play size={16} fill="currentColor" /> Watch Now
                  </button>
                </div>
              </div>
            )}

            <div id="popular">
              <MovieGrid title="Popular & Trending" moviesList={categories.popular} icon={Flame} />
            </div>
            
            <div id="action">
              <MovieGrid title="Action Hits" moviesList={categories.action} icon={Film} />
            </div>

            <div id="scifi">
              <MovieGrid title="Sci-Fi & Fantasy" moviesList={categories.scifi} icon={Compass} />
            </div>
          </>
        )}
      </main>

      {/* Video Player Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col">
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
            <div>
              <h3 className="text-base md:text-lg font-bold">{selectedMovie.title} ({selectedMovie.year})</h3>
              <p className="text-xs text-gray-400">If stream freezes, change server below</p>
            </div>
            <button 
              onClick={() => setSelectedMovie(null)} 
              className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 w-full bg-black relative flex items-center justify-center p-2">
            <iframe 
              key={`${selectedMovie.id}-${activeServerIndex}`}
              src={STREAM_SERVERS[activeServerIndex].url(selectedMovie.id)} 
              className="w-full h-full max-w-5xl max-h-[75vh] rounded-lg border border-white/10"
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              frameBorder="0"
            ></iframe>
          </div>

          <div className="p-4 bg-[#1a1c1f] border-t border-white/10 flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <span className="text-xs text-gray-400 flex items-center gap-1 mr-2"><Server size={14} /> Servers:</span>
            {STREAM_SERVERS.map((server, idx) => (
              <button
                key={idx}
                onClick={() => setActiveServerIndex(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  activeServerIndex === idx 
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                {server.name}
              </button>
            ))}
            <a 
              href={STREAM_SERVERS[activeServerIndex].url(selectedMovie.id)} 
              target="_blank" 
              rel="noreferrer"
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-emerald-400 hover:bg-white/20 border border-emerald-500/30 flex items-center gap-1"
            >
              Direct Stream <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
