document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector('header');
    const headerOffset = header.offsetTop; // Get the initial position of the header
    const navLinks = document.querySelectorAll('.nav-link');

    const initialTop = header.getBoundingClientRect().top + window.pageYOffset;

    // Loading Page 
    const vinylRecord = document.querySelector('.vinyl-record');
    const loadingPage = document.querySelector('.loading-page');
    const mainContent = document.querySelector('.main-content');

    mainContent.style.display = 'none';

    vinylRecord.style.opacity = 1;

    setTimeout(() => {
        vinylRecord.classList.add('zoom-out');
    }, 2000); 

    setTimeout(() => {
        loadingPage.style.opacity = 0;

        setTimeout(() => {
            loadingPage.style.display = 'none';
            mainContent.style.display = 'block';
            mainContent.style.opacity = 0; // Start hidden

            setTimeout(() => {
                mainContent.style.opacity = 1; // Fade in
            }, 50);
        }, 500);
    }, 2500);



    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset; // Get the current scroll position
    
        if (scrollY > headerOffset + 350) {
            // If scrolled past the header's position
            header.classList.add('fixed'); // Add fixed class
        } else {
            // If scrolled back above the header's position
            header.classList.remove('fixed'); // Remove fixed class
        }
    });


    // hover album effect
    const albumCover = document.querySelector('.album-cover img');
    const originalImage = albumCover.src; // Store the original image source

    document.querySelectorAll('.experience-item').forEach(item => {
        item.addEventListener('mouseover', function() {
            albumCover.src = item.dataset.logo; // Change to hover image
        });

        item.addEventListener('mouseout', function() {
            albumCover.src = originalImage; // Reset to original image
        });
    });

    console.log('Script is running');


  


    // Sticky Navigation
    // let lastScrollTop = 0;
    // const header = document.querySelector('header');
    // const navLinks = document.querySelectorAll('.nav-link');
    // console.log('Header:', header);
    // window.addEventListener('scroll', () => {
    //     console.log('Scroll Top:', window.pageYOffset);
    //     header.style.setProperty('top', '0'); // Force showing the navbar for testing
    // });
    
//     window.addEventListener('scroll', () => {
//         console.log('Scroll event detected');
//         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//         console.log('Scroll Top:', scrollTop);
//         // Show/hide header on scroll
//         if (scrollTop > lastScrollTop) {
//             header.style.top = '-70px'; // Direct assignment without 'important'
//  // Hide the navbar
//             console.log('Scrolling down, hiding header');
//         } else {
//             header.style.top = '0'; // Direct assignment without 'important'
//  // Show the navbar
//             console.log('Scrolling up, showing header');
//         }
//         lastScrollTop = scrollTop;
    
//         // Active link highlight
//         navLinks.forEach(link => {
//             const section = document.querySelector(link.getAttribute('href'));
//             const sectionTop = section.offsetTop;
//             const sectionHeight = section.offsetHeight;
    
//             if (scrollTop >= sectionTop - header.offsetHeight && scrollTop < sectionTop + sectionHeight - header.offsetHeight) {
//                 navLinks.forEach(link => link.classList.remove('active'));
//                 link.classList.add('active');
//             }
//         });
//     });
    
});