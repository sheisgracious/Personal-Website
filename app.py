# app.py
from flask import Flask, redirect, request, session, url_for, render_template
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Secure session handling

# Spotify API credentials
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")
SPOTIFY_PLAYLIST_ID = os.getenv("SPOTIFY_PLAYLIST_ID")

# Spotify URLs
AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"

# methods
def refresh_access_token():
    """Refresh the Spotify access token using the stored refresh token."""
    refresh_token = session.get("refresh_token")
    if not refresh_token:
        return None  

    response = requests.post(
        TOKEN_URL,
        data={
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": SPOTIFY_CLIENT_ID,
            "client_secret": SPOTIFY_CLIENT_SECRET,
        },
    )

    response_data = response.json()
    new_access_token = response_data.get("access_token")

    # Update with new token
    session["access_token"] = new_access_token
    return new_access_token

# Routes
@app.route("/")
def index():
    return render_template('index.html')

@app.route("/login")
def login():
    '''Redirect to Spotify for authentication'''

    scope = "playlist-modify-public streaming"
    auth_query = f"{AUTH_URL}?response_type=code&client_id={SPOTIFY_CLIENT_ID}&redirect_uri={SPOTIFY_REDIRECT_URI}&scope={scope}"
    return redirect(auth_query)

@app.route("/callback")
def callback():
    '''Spotify redirects here with a code'''
    code = request.args.get("code")
    if code:
        # Request access token
        response = requests.post(
            TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": SPOTIFY_REDIRECT_URI,
                "client_id": SPOTIFY_CLIENT_ID,
                "client_secret": SPOTIFY_CLIENT_SECRET,
            },
        )
        response_data = response.json()
        session["access_token"] = response_data.get("access_token")
        session["refresh_token"] = response_data.get("refresh_token")
        return redirect(url_for("dashboard"))
    return "Authorization failed."

@app.route("/dashboard")
def dashboard():
    '''Display playlist management options'''
    if "access_token" in session:
        return "Welcome! Add your vibe to the playlist."
    return redirect(url_for("login"))

@app.route("/add_track", methods=["POST"])
def add_track():
    if "access_token" not in session:
        return redirect(url_for("login"))
    
    track_uri = request.json.get("track_uri")
    if not track_uri:
        return {"error": "No track URI provided"}, 400

    add_url = f"https://api.spotify.com/v1/playlists/{SPOTIFY_PLAYLIST_ID}/tracks"
    headers = {"Authorization": f"Bearer {session['access_token']}"}
    data = {"uris": [track_uri]}

    response = requests.post(add_url, headers=headers, json=data)

    if response.status_code == 401:
            new_token = refresh_access_token()
            if not new_token:
                return redirect(url_for("login"))  

            headers = {"Authorization": f"Bearer {new_token}"}
            response = requests.post(add_url, headers=headers, json=data)


    return response.json(), response.status_code


@app.route("/search", methods=["GET"])
def search():
    if "access_token" not in session:
        return redirect(url_for("login"))

    query = request.args.get("q")
    if not query:
        return {"error": "No query provided"}, 400

    search_url = "https://api.spotify.com/v1/search"
    headers = {"Authorization": f"Bearer {session['access_token']}"}
    params = {"q": query, "type": "track", "limit": 5}

    response = requests.get(search_url, headers=headers, params=params)
    if response.status_code == 401:
        new_token = refresh_access_token()
        if new_token:
            headers["Authorization"] = f"Bearer {new_token}"
            response = requests.get(search_url, headers=headers, params=params)
        else:
            return redirect(url_for("login"))

    return response.json(), response.status_code



if __name__ == "__main__":
    app.run(debug=True)


