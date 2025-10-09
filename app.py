# app.py
from flask import Flask, redirect, request, session, url_for, render_template, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", os.urandom(24).hex())  # Use env var or generate

# Session configuration - CRITICAL FIXES
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = 3600  # 1 hour
app.config['SESSION_TYPE'] = 'filesystem'  # Important for persistence

# Spotify API credentials
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")
SPOTIFY_PLAYLIST_ID = os.getenv("SPOTIFY_PLAYLIST_ID")

# Spotify URLs
AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"

# Methods
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

    # Update session with new token
    if new_access_token:
        session["access_token"] = new_access_token
        session.modified = True
    
    return new_access_token

# Routes
@app.route("/")
def index():
    return render_template('index.html')

@app.route("/login")
def login():
    """Redirect to Spotify for authentication"""
    scope = "playlist-modify-public playlist-modify-private"
    auth_query = (
        f"{AUTH_URL}?response_type=code&client_id={SPOTIFY_CLIENT_ID}"
        f"&redirect_uri={SPOTIFY_REDIRECT_URI}&scope={scope}&show_dialog=true"
    )
    return redirect(auth_query)

@app.route("/callback")
def callback():
    """Spotify redirects here with a code"""
    code = request.args.get("code")
    error = request.args.get("error")
    
    if error:
        print(f"Spotify auth error: {error}")
        return redirect(url_for("index"))
    
    if not code:
        print("No code received from Spotify")
        return redirect(url_for("index"))
    
    # Request access token
    try:
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
        
        if response.status_code != 200:
            print(f"Token exchange failed: {response_data}")
            return redirect(url_for("index"))
        
        # Store tokens in session - MAKE SESSION PERMANENT
        session.permanent = True
        session["access_token"] = response_data.get("access_token")
        session["refresh_token"] = response_data.get("refresh_token")
        session.modified = True  # Force session save
        
        # print(f"Login successful! Token stored: {session.get('access_token')[:20]}...")
        # print(f"Session ID: {request.cookies.get('session')}")
        
        return redirect(url_for("index") + "?spotify_login=success")
        
    except Exception as e:
        # print(f"Exception during callback: {e}")
        return redirect(url_for("index"))

@app.route("/dashboard")
def dashboard():
    """Check login status"""
    has_token = "access_token" in session
    # print(f"Dashboard check - Has token: {has_token}")
    
    if has_token:
        # print(f"Token found: {session.get('access_token')[:20]}...")
        return jsonify({"status": "logged_in"}), 200
    
    # print("No token in session")
    # print(f"Session contents: {list(session.keys())}")
    return jsonify({"status": "unauthorized"}), 401

@app.route("/add_track", methods=["POST"])
def add_track():
    if "access_token" not in session:
        # print("Add track: No access token")
        return jsonify({"error": "Not authenticated"}), 401
    
    track_uri = request.json.get("track_uri")
    if not track_uri:
        return jsonify({"error": "No track URI provided"}), 400

    add_url = f"https://api.spotify.com/v1/playlists/{SPOTIFY_PLAYLIST_ID}/tracks"
    headers = {"Authorization": f"Bearer {session['access_token']}"}
    data = {"uris": [track_uri]}

    response = requests.post(add_url, headers=headers, json=data)

    # Handle token expiration
    if response.status_code == 401:
        print("🔄 Token expired, refreshing...")
        new_token = refresh_access_token()
        if not new_token:
            return jsonify({"error": "Session expired, please log in again"}), 401

        headers = {"Authorization": f"Bearer {new_token}"}
        response = requests.post(add_url, headers=headers, json=data)

    if response.status_code == 201:
        # print(f"Track added successfully: {track_uri}")
        return jsonify({"success": True, "message": "Track added!"}), 201
    else:
        # print(f"Failed to add track: {response.status_code} - {response.text}")
        return jsonify({"error": response.json()}), response.status_code

@app.route("/search", methods=["GET"])
def search():
    if "access_token" not in session:
        # print("Search: No access token")
        return jsonify({"error": "Not authenticated"}), 401

    query = request.args.get("q")
    if not query:
        return jsonify({"error": "No query provided"}), 400

    search_url = "https://api.spotify.com/v1/search"
    headers = {"Authorization": f"Bearer {session['access_token']}"}
    params = {"q": query, "type": "track", "limit": 10}

    response = requests.get(search_url, headers=headers, params=params)
    
    # Handle token expiration
    if response.status_code == 401:
        print("🔄 Token expired during search, refreshing...")
        new_token = refresh_access_token()
        if new_token:
            headers["Authorization"] = f"Bearer {new_token}"
            response = requests.get(search_url, headers=headers, params=params)
        else:
            return jsonify({"error": "Session expired, please log in again"}), 401

    if response.status_code == 200:
        print(f"Search successful for: {query}")
    else:
        print(f"Search failed: {response.status_code}")
    
    return response.json(), response.status_code

@app.route("/logout")
def logout():
    """Clear session and log out"""
    session.clear()
    print("🚪 User logged out")
    return redirect(url_for("index"))

if __name__ == "__main__":
    print(f"🎵 Spotify Client ID: {SPOTIFY_CLIENT_ID[:10]}...")
    print(f"🔗 Redirect URI: {SPOTIFY_REDIRECT_URI}")
    print(f"📝 Playlist ID: {SPOTIFY_PLAYLIST_ID}")
    app.run(debug=True)