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

  // Sidebar collapse functionality
  // const sidebar = document.getElementById("sidebar");
  // const collapseBtn = document.getElementById("collapseBtn");
  // const collapseIcon = document.getElementById("collapseIcon");

  // if (collapseBtn) {
  //   collapseBtn.addEventListener("click", () => {
  //     sidebar.classList.toggle("collapsed");
  //     collapseIcon.textContent = sidebar.classList.contains("collapsed")
  //       ? "▶"
  //       : "◀";
  //   });
  // }

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

  // Modal Functionality
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

  if (openModalBtn) {
    openModalBtn.addEventListener("click", openModal);
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


