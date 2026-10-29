Act as a Senior Frontend React Developer. Build a fully functional, production-ready movie & web series streaming web application inspired by Bangladesh BDIX FTP portals like "Banglaplex.biz", named "Cine Download Zone" using React, Tailwind CSS, and Lucide React icons.

Key UI & Feature Requirements:

1. Banglaplex Layout & Navigation:
   - Dark theme (#0f1015 main background, #181a20 cards, #10b981 emerald/green action highlights).
   - Top Header with CineZone logo, real-time Search Bar, and Category Pills.
   - Distinct Categories focused on regional preferences:
     * "Bangla Dubbed Movies"
     * "South Indian (Bangla Dubbed)"
     * "Hollywood Action"
     * "Trending Web Series"
   - Movie Cards: High-res poster, Title, Release Year, and Overlay Quality Badges (e.g., "Bangla Dubbed", "1080p Dual Audio", "WEB-DL").

2. TMDB API + Live Search & Fallback Dataset:
   - Connect TMDB API to auto-fetch popular, action, and sci-fi movies.
   - Real-time search with instant filtering.
   - CRITICAL FAILSAFE: Include local fallback movie objects inside code with pre-set tags like "Bangla Dubbed" so the screen is NEVER blank even if the API fails.

3. Movie & Series Player Modal (Stream + Download):
   - Clicking a card opens a modal overlay.
   - Full-width Iframe Video Player.
   - Below the player:
     * Multi-Server Switcher Buttons:
       - Server 1 (VidLink): https://vidlink.pro/movie/{tmdb_id}
       - Server 2 (Embed.su): https://embed.su/embed/movie/{tmdb_id}
       - Server 3 (VidSrc): https://vidsrc.cc/v2/embed/movie/{tmdb_id}
     * High-speed Download Buttons: "Download 1080p", "Download 720p" (opens direct video/server link).
     * Season & Episode Selector pills if the item is a Web Series (Season 1 -> Ep 1, Ep 2...).

4. Single File Output:
   - Provide the complete, clean, working code in a single App.jsx file.
   - Include broken image fallback logic (onError handler).
