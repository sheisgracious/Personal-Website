document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");
  const vinylRecord = document.querySelector(".vinyl-record");
  const loadingPage = document.querySelector(".loading-page");
  const mainContent = document.querySelector(".main-content");

  // Loading Page Animation
  mainContent.style.display = "none";
  vinylRecord.style.opacity = 1;

  setTimeout(() => {
    vinylRecord.classList.add("zoom-out");
  }, 2000);

  setTimeout(() => {
    loadingPage.style.opacity = 0;

    setTimeout(() => {
      loadingPage.style.display = "none";
      mainContent.style.display = "block";
      mainContent.style.opacity = 0;

      setTimeout(() => {
        mainContent.style.opacity = 1;
      }, 50);
    }, 500);
  }, 2500);

  // Sticky Navigation
  const headerOffset = header.offsetTop;

  window.addEventListener("scroll", function () {
    const scrollY = window.pageYOffset;

    if (scrollY > headerOffset + 350) {
      header.classList.add("fixed");
    } else {
      header.classList.remove("fixed");
    }
  });

  // Active Navigation Link
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Modal Functionality
  const modal = document.querySelector(".modal");
  const overlay = document.querySelector(".overlay");
  const openModalBtn = document.querySelector(".add-music-btn");
  const closeModalBtn = document.querySelector(".btn-close");

  const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  };

  const openModal = function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
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

  // ========== MUSIC PLAYER FEATURES ==========

  // Scroll-linked Progress Bar
  window.addEventListener("scroll", () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;

    const progressFill = document.getElementById("progress");
    if (progressFill) {
      progressFill.style.width = progress + "%";
    }

    // Update time display based on scroll
    const currentTime = document.querySelectorAll(".time")[0];
    const totalTime = 225; // 3:45 in seconds
    const currentSeconds = Math.floor((progress / 100) * totalTime);
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;

    if (currentTime) {
      currentTime.textContent = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
  });

  // Update Now Playing based on scroll position
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
      "about-section": {
        title: "About Gracious",
        subtitle: "Portfolio Section",
      },
      "experience-section": {
        title: "Professional Experience",
        subtitle: "3 tracks · 2024",
      },
      "projects-section": {
        title: "Featured Projects",
        subtitle: "5 albums · 2024",
      },
      "contact-section": { title: "Drop A Beat", subtitle: "Contact · 2024" },
    };

    if (current && titles[current]) {
      if (nowPlayingTitle) nowPlayingTitle.textContent = titles[current].title;
      if (nowPlayingSubtitle)
        nowPlayingSubtitle.textContent = titles[current].subtitle;
    }
  });

  // Play Button - Scroll to top
  const heroPlayBtn = document.querySelector(".play-btn");
  const playerPlayBtn = document.querySelector(".control-btn.play");
  let isPlaying = false;

  if (heroPlayBtn) {
    heroPlayBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (playerPlayBtn) {
    playerPlayBtn.addEventListener("click", () => {
      isPlaying = !isPlaying;
      playerPlayBtn.textContent = isPlaying ? "⏸" : "▶";

      // Optional: Auto-scroll when playing
      if (isPlaying) {
        smoothScroll();
      }
    });
  }

  // Auto-scroll functionality
  let scrollInterval;
  function smoothScroll() {
    if (scrollInterval) clearInterval(scrollInterval);

    scrollInterval = setInterval(() => {
      if (isPlaying) {
        window.scrollBy(0, 1);

        // Stop at bottom
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
          isPlaying = false;
          if (playerPlayBtn) playerPlayBtn.textContent = "▶";
          clearInterval(scrollInterval);
        }
      } else {
        clearInterval(scrollInterval);
      }
    }, 50);
  }

  // Track hover effect - show play button
  const experienceItems = document.querySelectorAll(".experience-item");

  experienceItems.forEach((item, index) => {
    const jobNumber = item.querySelector(".job-number");
    const originalNumber = jobNumber.textContent;

    item.addEventListener("mouseenter", function () {
      jobNumber.textContent = "▶";
      jobNumber.style.color = "#1db954";
    });

    item.addEventListener("mouseleave", function () {
      jobNumber.textContent = originalNumber;
      jobNumber.style.color = "#b3b3b3";
    });
  });

  // Progress bar click to scroll
  const progressBar = document.querySelector(".progress");

  if (progressBar) {
    progressBar.addEventListener("click", function (e) {
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

  // Next/Previous Track buttons
  const nextBtn = document.querySelectorAll(".control-btn")[3]; // ⏭
  const prevBtn = document.querySelectorAll(".control-btn")[1]; // ⏮

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const currentSection = getCurrentSection();
      const sectionIds = [
        "about-section",
        "experience-section",
        "projects-section",
        "contact-section",
      ];
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

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const currentSection = getCurrentSection();
      const sectionIds = [
        "about-section",
        "experience-section",
        "projects-section",
        "contact-section",
      ];
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

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Contact Form Success Message
  const contactForm = document.querySelector(".contact-form form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      // Form will submit to Formspree, but we can show a message
      setTimeout(() => {
        const successMessage = document.getElementById("successMessage");
        if (successMessage) {
          successMessage.textContent = "Message sent successfully!";
          successMessage.style.display = "block";
          successMessage.style.color = "#1db954";
        }
      }, 1000);
    });
  }
});
