// static/script.js
document.addEventListener("DOMContentLoaded", function () {
  const loadingPage = document.querySelector(".loading-page");
  const mainContent = document.querySelector(".main-content");
  const vinylRecord = document.querySelector(".vinyl-record");

  // Check if loading animation has been shown this session
  const hasSeenLoading = sessionStorage.getItem("hasSeenLoading");

  if (!hasSeenLoading) {
    // Show loading animation
    vinylRecord.style.opacity = 1;

    setTimeout(() => {
      vinylRecord.classList.add("zoom-out");
    }, 2000);

    setTimeout(() => {
      loadingPage.classList.add("hide");
      mainContent.classList.add("show");
      // Set flag in sessionStorage
      sessionStorage.setItem("hasSeenLoading", "true");
    }, 2500);
  } else {
    // Skip loading animation
    loadingPage.style.display = "none";
    mainContent.style.display = "block";
    mainContent.classList.add("show");
  }

  // Project Carousel Navigation
  const carousel = document.getElementById("projectCarousel");
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");

  if (carousel && prevBtn && nextBtn) {
    const scrollAmount = carousel.offsetWidth;

    nextBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    // Update button states based on scroll position
    carousel.addEventListener("scroll", () => {
      prevBtn.disabled = carousel.scrollLeft <= 0;
      nextBtn.disabled =
        carousel.scrollLeft >= carousel.scrollWidth - carousel.offsetWidth - 1;
    });

    // Initial button state
    prevBtn.disabled = true;
  }

  // Smooth scroll progress bar
  window.addEventListener("scroll", () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;

    const progressFill = document.getElementById("progressFill");
    if (progressFill) {
      progressFill.style.width = progress + "%";
    }

    // Update time display
    const currentTime = document.getElementById("currentTime");
    const totalSeconds = 225; // 3:45
    const currentSeconds = Math.floor((progress / 100) * totalSeconds);
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;

    if (currentTime) {
      currentTime.textContent = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
  });

  // Update now playing based on scroll position
  const sections = document.querySelectorAll("section[id]");
  const nowPlayingTitle = document.querySelector(".now-playing-info h4");
  const nowPlayingSubtitle = document.querySelector(".now-playing-info p");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    const titles = {
      hero: { title: "Gracious Ogyiri Asare", subtitle: "Welcome" },
      about: { title: "About Me", subtitle: "Gracious" },
      experience: {
        title: "Experience",
        subtitle: "Gracious",
      },
      projects: { title: "Featured Projects", subtitle: "Gracious" },
      contact: { title: "Contact", subtitle: "Drop A Beat" },
    };

    if (current && titles[current]) {
      if (nowPlayingTitle) nowPlayingTitle.textContent = titles[current].title;
      if (nowPlayingSubtitle)
        nowPlayingSubtitle.textContent = titles[current].subtitle;
    }
  });

  // Active nav state
  const navItems = document.querySelectorAll(".nav-item");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 300) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active");
      }
    });
  });

  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Play/Pause functionality with auto-scroll
  const playBtn = document.getElementById("playBtn");
  let isPlaying = false;
  let scrollInterval;

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      isPlaying = !isPlaying;
      playBtn.textContent = isPlaying ? "⏸" : "▶";

      if (isPlaying) {
        smoothScroll();
      } else {
        clearInterval(scrollInterval);
      }
    });
  }

  function smoothScroll() {
    if (scrollInterval) clearInterval(scrollInterval);

    scrollInterval = setInterval(() => {
      if (isPlaying) {
        window.scrollBy(0, 1);

        // Stop at bottom
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
          isPlaying = false;
          if (playBtn) playBtn.textContent = "▶";
          clearInterval(scrollInterval);
        }
      } else {
        clearInterval(scrollInterval);
      }
    }, 50);
  }

  // Get current section
  function getCurrentSection() {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });
    return current;
  }

  // Next/Previous track buttons
  const nextTBtn = document.getElementById("nextBtn");
  const prevTBtn = document.getElementById("prevBtn");

  if (nextTBtn) {
    nextTBtn.addEventListener("click", () => {
      const currentSection = getCurrentSection();
      const sectionIds = ["hero", "about", "experience", "projects", "contact"];
      const currentIndex = sectionIds.indexOf(currentSection);

      if (currentIndex < sectionIds.length - 1) {
        const nextSection = document.getElementById(
          sectionIds[currentIndex + 1]
        );
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  if (prevTBtn) {
    prevTBtn.addEventListener("click", () => {
      const currentSection = getCurrentSection();
      const sectionIds = ["hero", "about", "experience", "projects", "contact"];
      const currentIndex = sectionIds.indexOf(currentSection);

      if (currentIndex > 0) {
        const prevSection = document.getElementById(
          sectionIds[currentIndex - 1]
        );
        if (prevSection) {
          prevSection.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // Progress bar click to scroll
  const progressTrack = document.getElementById("progressTrack");

  if (progressTrack) {
    progressTrack.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollTo = documentHeight * percent;

      window.scrollTo({
        top: scrollTo,
        behavior: "smooth",
      });
    });
  }

  // ============= MODAL FUNCTIONALITY =============
  const modal = document.querySelector(".modal");
  const overlay = document.querySelector(".overlay");
  const openModalBtn = document.querySelector(".add-track-btn");
  const closeModalBtn = document.querySelector(".btn-close");

  const closeModal = function () {
    if (modal) modal.classList.add("hidden");
    if (overlay) overlay.classList.add("hidden");
  };

  const openModal = function () {
    if (modal) modal.classList.remove("hidden");
    if (overlay) overlay.classList.remove("hidden");
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (overlay) {
    overlay.addEventListener("click", closeModal);
  }

  // ============= SPOTIFY INTEGRATION =============

  // Check if user is logged in to Spotify
  async function checkSpotifyLogin() {
    try {
      const res = await fetch("/dashboard", {
        credentials: "same-origin",
      });

      console.log("Dashboard response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("Dashboard data:", data);

        const loginBtn = document.getElementById("spotify-login-modal");
        const searchSection = document.getElementById("spotify-search-section");

        if (loginBtn && searchSection) {
          loginBtn.style.display = "none";
          searchSection.style.display = "block";
          console.log("UI updated to show search");
        }
        return true;
      } else {
        console.log("Not logged in");
        return false;
      }
    } catch (err) {
      console.error("Error checking Spotify login:", err);
      return false;
    }
  }

  // Handle Spotify login button
  const spotifyLoginBtn = document.getElementById("spotify-login-modal");
  if (spotifyLoginBtn) {
    spotifyLoginBtn.addEventListener("click", function () {
      console.log("Login button clicked");
      sessionStorage.setItem("modalWasOpen", "true");
      window.location.href = "/login";
    });
  }

  // Reopen modal after returning from Spotify login
  if (sessionStorage.getItem("modalWasOpen")) {
    console.log("Reopening modal after login");

    setTimeout(() => {
      if (modal && overlay) {
        modal.classList.remove("hidden");
        overlay.classList.remove("hidden");

        setTimeout(() => {
          checkSpotifyLogin();
        }, 500);
      }
    }, 300);

    sessionStorage.removeItem("modalWasOpen");
  }

  // Open modal button handler 
  if (openModalBtn) {
    openModalBtn.addEventListener("click", () => {
      console.log("Add track button clicked");
      openModal();
      setTimeout(checkSpotifyLogin, 300);
    });
  }

  // Check login on page load
  checkSpotifyLogin();

  // Spotify track search and add functionality
  const searchBtn = document.getElementById("searchBtn");
  const trackSearchInput = document.getElementById("trackSearchInput");
  const searchResults = document.getElementById("searchResults");

  if (searchBtn && trackSearchInput) {
    // Allow Enter key to search
    trackSearchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchBtn.click();
      }
    });

    searchBtn.addEventListener("click", async () => {
      const query = trackSearchInput.value.trim();
      if (!query) {
        searchResults.innerHTML = "<p>Please enter a search term</p>";
        return;
      }

      searchResults.innerHTML = "<p>Searching...</p>";

      try {
        const res = await fetch(`/search?q=${encodeURIComponent(query)}`, {
          credentials: "same-origin",
        });

        if (res.status === 401) {
          searchResults.innerHTML = "<p>Please log in to Spotify first</p>";
          const loginBtn = document.getElementById("spotify-login-modal");
          const searchSection = document.getElementById(
            "spotify-search-section"
          );
          if (loginBtn && searchSection) {
            loginBtn.style.display = "block";
            searchSection.style.display = "none";
          }
          return;
        }

        const data = await res.json();
        searchResults.innerHTML = "";

        if (data.tracks && data.tracks.items.length > 0) {
          data.tracks.items.forEach((track) => {
            const div = document.createElement("div");
            div.classList.add("search-result");
            div.innerHTML = `
              <strong>${track.name}</strong> — ${track.artists[0].name}
              <button class="btn add-btn" data-uri="${track.uri}">Add</button>
            `;
            searchResults.appendChild(div);
          });

          // Add event listener for "Add" buttons
          document.querySelectorAll(".add-btn").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
              const uri = e.target.getAttribute("data-uri");
              const originalText = e.target.textContent;
              e.target.textContent = "Adding...";
              e.target.disabled = true;

              try {
                const response = await fetch("/add_track", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "same-origin",
                  body: JSON.stringify({ track_uri: uri }),
                });

                if (response.ok) {
                  e.target.textContent = "✅ Added!";
                  e.target.style.backgroundColor = "#1db954";
                  setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.disabled = false;
                    e.target.style.backgroundColor = "";
                  }, 2000);
                } else {
                  e.target.textContent = "❌ Failed";
                  e.target.disabled = false;
                  setTimeout(() => {
                    e.target.textContent = originalText;
                  }, 2000);
                }
              } catch (error) {
                console.error("Error adding track:", error);
                e.target.textContent = "❌ Error";
                e.target.disabled = false;
              }
            });
          });
        } else {
          searchResults.textContent = "No results found.";
        }
      } catch (error) {
        console.error("Search error:", error);
        searchResults.innerHTML = "<p>Error searching. Please try again.</p>";
      }
    });
  }

  // Contact Form Success Message
  const contactForm = document.querySelector(".contact-form form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      setTimeout(() => {
        const successMessage = document.getElementById("successMessage");
        if (successMessage) {
          successMessage.textContent = "Thank you! Message Received!";
          successMessage.style.display = "block";
          successMessage.style.color = "#8b5cf6";
          successMessage.style.font = "bold 1em Arial, sans-serif";
        }
      }, 1000);
    });
  }
});

// Clear form after submission
function clearForm() {
  const form = document.querySelector(".contact-form form");
  if (form) {
    form.reset();
  }
}
