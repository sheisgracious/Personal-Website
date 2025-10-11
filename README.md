# Gracious Ogyiri Asare Personal Website

A music streaming platform-themed website inspired by Spotify and Apple Music, showcasing my experience, projects, and skills in an album-style format.

## Features

- **Music Streaming Platform Design**: Album covers, track listings, and playback controls reimagined as portfolio sections
- **Interactive Navigation**: Smooth scrolling with auto-play functionality and section-based "track" navigation
- **Animated Loading Screen**: Vinyl record spin animation on first visit and to load 
- **Contact Form**: Integrated with Formspree for direct messages
- **Responsive Design**: Optimized for desktop and mobile viewing
- **Spotify Integration**: Modal for sharing music 

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Flask (Python)
- **APIs**: Spotify API (for future playlist features)
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Icons**: Emoji-based navigation icons

## Getting Started

### Prerequisites
- Python 3.x
- pip

### Installation

1. Clone the repository
```bash
git clone https://github.com/sheisgracious/Personal-Website.git
cd Personal-Website
```

2. Install dependencies
```bash
pip install flask python-dotenv requests
```

3. Create a `.env` file in the root directory
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/callback
```

4. Run the application
```bash
python app.py
```

5. Open your browser and navigate to `http://localhost:5000`

## Project Structure

```
Personal-Website/
├── app.py                 # Flask application
├── static/
│   ├── styles.css        # Stylesheet
│   ├── script.js         # JavaScript 
│   └── assets/           # Images and media
│       ...
├── templates/
│   └── index.html        # Main HTML template
├── .env                  # Environment variables (not commited)
└── README.md
```

## Customization

### Changing Colors
You can change the color scheme by updating the `:root` CSS variables in `static/styles.css`:
```css
:root {
  --bg-primary: #0a0a0a;
  --accent-primary: #8b5cf6;
  /* ... other variables */
}
```

### Adding Projects
Edit the projects section in `templates/index.html` and add new project cards.

### Updating Experience
Modify the "track list" in the experience section of `templates/index.html`.

## Features in Development

- [x] Making accessiblity enhancements
- [x] Spotify playlist integration
- [x] Enhanced mobile responsiveness
- [x] Dark/Light mode toggle
- [ ] Additional section for Leadership & Other

## Acknowledgments

- Design inspired by Spotify and Apple Music
- Form handling by Formspree

---

Made with a love for music.


## 📄 License

MIT License

Copyright (c) Gracious Ogyiri Asare. All rights reserved.
