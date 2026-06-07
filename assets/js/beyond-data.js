/* =========================================================
   "Off the clock" content — EDIT THIS FILE to add your stuff
   =========================================================

   HOW TO ADD A PHOTO
   ------------------
   1. Put the image in the matching folder, e.g.
        assets/img/beyond/cities/my-new-trip.jpg
      (Tip: also make a .webp next to it for speed — optional.
       On a Mac:  magick my-new-trip.jpg -quality 82 my-new-trip.webp )
   2. Add ONE line to the right category's `items` array below:
        { img: "assets/img/beyond/cities/my-new-trip.jpg", w: 1200, h: 1600,
          location: "Tokyo", caption: "Shibuya at night", alt: "Neon crossing" },
      - w/h = the image's pixel width/height (prevents layout jump).
      - location = small label, caption = short title, alt = description.
   3. Save. Done — it shows up automatically. No build step.

   HOW TO ADD A MUSIC VIDEO
   ------------------------
   Drop the clip in your Google Drive folder (sharing must be
   "Anyone with the link"), grab its file ID (the part after /file/d/
   in the share link), and add one line to `music.videos` below. It
   shows up inline next to the photos. YouTube works too (smoothest):
        { type: "youtube", id: "VIDEO_ID", title: "Clair de Lune" }
        { type: "drive",   id: "DRIVE_FILE_ID", title: "Nocturne" }
*/

window.BEYOND_DATA = {

  /* Numbers shown above the sections — set these to your real counts */
  stats: [
    { num: 12, suffix: "+", label: "Countries" },
    { num: 25, suffix: "+", label: "Cities explored" },
    { num: 15, suffix: "+", label: "Dives logged" },
    { num: 50, suffix: "+", label: "Cuisines tried" }
  ],

  /* Pins on the 3D globe — [latitude, longitude]. `home: true` glows amber. */
  places: [
    { lat: 12.97, lng: 77.59,  label: "Bengaluru", home: true },
    { lat: 28.36, lng: 75.59,  label: "Pilani" },
    { lat: 13.76, lng: 100.50, label: "Bangkok" },
    { lat: 8.05,  lng: 98.91,  label: "Krabi" },
    { lat: 40.71, lng: -74.01, label: "New York" },
    { lat: 37.77, lng: -122.42,label: "San Francisco" },
    { lat: 32.72, lng: -117.16,label: "San Diego" },
    { lat: 36.17, lng: -115.14,label: "Las Vegas" },
    { lat: 51.75, lng: -1.26,  label: "Oxford" }
  ],

  categories: [
    {
      id: "cities",
      kicker: "Exploring cities",
      title: "Cities, coastlines &<br>the roads between.",
      blurb: "Collecting skylines and side-streets — from golden temples to neon alleys.",
      items: [
        { img: "assets/img/beyond/cities/temple.jpg",   w: 1125, h: 1500, location: "Bangkok",       caption: "The Grand Palace",   alt: "Golden spires of the Grand Palace under a blue sky" },
        { img: "assets/img/goldengate.jpg",              w: 1050, h: 1400, location: "San Francisco", caption: "Golden Gate",         alt: "Harsh at a lookout over the Golden Gate Bridge" },
        { img: "assets/img/beyond/cities/chinatown.jpg", w: 1050, h: 1400, location: "Bangkok",       caption: "Chinatown nights",    alt: "Neon signs along Yaowarat road in Bangkok's Chinatown at night" },
        { img: "assets/img/beyond/cities/liberty.jpg",   w: 1050, h: 1400, location: "New York",      caption: "Lady Liberty",        alt: "The Statue of Liberty with Harsh in front" },
        { img: "assets/img/beyond/cities/sandiego.jpg",  w: 1800, h: 1350, location: "California",    caption: "San Diego dusk",      alt: "San Diego skyline across the water at dusk" },
        { img: "assets/img/beyond/cities/sphere.jpg",    w: 1500, h: 1125, location: "Las Vegas",     caption: "The Sphere",          alt: "Immersive cosmic visuals inside the Sphere in Las Vegas" },
        { img: "assets/img/beyond/cities/bellagio.jpg",  w: 1500, h: 844,  location: "Las Vegas",     caption: "Bellagio fountains",  alt: "The Bellagio fountains lit up at night" },
        { img: "assets/img/beyond/cities/nyc.jpg",       w: 1050, h: 1400, location: "New York",      caption: "Manhattan after dark",alt: "Manhattan skyscrapers glowing in the night fog" },
        { img: "assets/img/beyond/cities/sunset.jpg",    w: 1050, h: 1400, location: "Golden hour",   caption: "Coast road",          alt: "Sunset over a palm-lined coastal road" },
        { img: "assets/img/beyond/cities/vineyard.jpg",  w: 1050, h: 1400, location: "Off the grid",  caption: "Green miles",         alt: "Harsh walking a wooden path through lush greenery" }
      ]
    },

    {
      id: "furry",
      kicker: "Furry friends",
      title: "Making friends<br>of the four-legged kind.",
      blurb: "Every trip somehow ends with me befriending the local animals.",
      items: [
        { img: "assets/img/beyond/furry/samoyed.jpg",    w: 1050, h: 1400, location: "Thailand",     caption: "Samoyed squad",      alt: "Harsh kneeling with a group of fluffy white samoyeds" },
        { img: "assets/img/beyond/furry/cat-orange.jpg",  w: 1200, h: 1600, location: "Garden detour", caption: "Marigolds & a stray", alt: "Harsh crouching to greet an orange cat beside marigold flowers" },
        { img: "assets/img/beyond/furry/huskies.jpg",     w: 1125, h: 1500, location: "Thailand",     caption: "The husky pack",     alt: "Harsh surrounded by a pack of huskies and malamutes" },
        { img: "assets/img/beyond/furry/cat-white.jpg",   w: 1050, h: 1400, location: "Caught one",    caption: "Say hello",          alt: "Harsh holding up a friendly white cat outdoors" },
        { img: "assets/img/beyond/furry/cat-tabby.jpg",   w: 821,  h: 1800, location: "At home",       caption: "Floor-level friends",alt: "Harsh sitting on the floor petting a tabby cat" },
        { img: "assets/img/beyond/furry/cat.jpg",         w: 1050, h: 1400, location: "On the road",   caption: "A local regular",    alt: "A tuxedo cat sitting in the grass" }
      ]
    },

    {
      id: "activities",
      kicker: "Activities",
      title: "Underwater &<br>out on the water.",
      blurb: "Scuba below the surface, kayaks across it — the water is where I reset.",
      items: [
        { img: "assets/img/beyond/activities/scuba-dive.jpg", w: 2000, h: 1500, location: "Scuba",     caption: "Into the blue",  alt: "Scuba diver descending over a reef into deep blue water" },
        { img: "assets/img/beyond/activities/kayak.jpg",      w: 1800, h: 1674, location: "Thailand",  caption: "Karst kayaking", alt: "Kayaking on emerald water surrounded by limestone cliffs" },
        { img: "assets/img/beyond/activities/scuba-reef.jpg", w: 2000, h: 1500, location: "Scuba",     caption: "Over the reef",  alt: "Scuba diver gliding over a shallow reef" },
        { img: "assets/img/beyond/activities/coral.jpg",      w: 1600, h: 1200, location: "Underwater",caption: "Reef life",      alt: "Vibrant coral formations on the sea floor" },
        { img: "assets/img/beyond/activities/onwater.jpg",    w: 1400, h: 1050, location: "Open water",caption: "On the boat",    alt: "Harsh in a life jacket on a boat over open water" }
      ]
    },

    {
      id: "music",
      kicker: "At the piano",
      title: "When I'm not in a terminal,<br>I'm at the <em>keys.</em>",
      blurb: "Piano is my other language — a few covers and late-night takes. Give them a listen.",
      driveFolderId: "1sPulezzx62N8_qvIWaPA_epb2FBFCb4k",
      // Inline players (portrait phone videos from the Drive folder)
      videos: [
        { type: "drive", id: "12ZesD0LuiZwdgyEfM-7iSQiG_i4BB7Xg", title: "Kahani Suno" },
        { type: "drive", id: "1Je_EXKABXFVn8pVjER-VOGjc_vkLW5D-", title: "Kuch Kuch Hota Hai" },
        { type: "drive", id: "1GSI5auFG0mQelQAiagc1KtjjyGYp5eQn", title: "Kahin Toh" }
      ],
      items: [
        { img: "assets/img/beyond/music/piano-2.jpg", w: 1125, h: 1500, location: "Practice room", caption: "At the grand",        alt: "Harsh playing a grand piano by a window at night" },
        { img: "assets/img/beyond/music/piano-1.jpg", w: 1125, h: 1500, location: "After hours",    caption: "Just me & the keys", alt: "A grand piano keyboard lit by a warm lamp at night" }
      ]
    }
  ]
};
