// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function () {
    // Bootstrap Navbar Enhancements
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('#navbarNav');

    navbarToggler.addEventListener('click', function () {
        if (!navbarCollapse.classList.contains('show')) {
            navbarCollapse.style.opacity = '0';
            setTimeout(() => {
                navbarCollapse.style.opacity = '1';
                navbarCollapse.style.transition = 'opacity 0.3s ease';
            }, 10);
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href !== '#') {
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    // Update active state
                    document.querySelectorAll('.nav-link').forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                    // Close navbar on mobile
                    if (navbarCollapse.classList.contains('show')) {
                        bootstrap.Collapse.getInstance(navbarCollapse).hide();
                    }
                }
            }
        });
    });
    // Search Button Functionality
    const searchBtn = document.querySelector('.search-btn');
    let searchOpen = false;
    let searchField;

    searchBtn.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent form submission
        if (!searchOpen) {
            searchField = document.createElement('input');
            searchField.type = 'text';
            searchField.className = 'search-field form-control me-2';
            searchField.placeholder = 'Search artists, songs...';
            this.parentNode.insertBefore(searchField, this);
            setTimeout(() => searchField.classList.add('expanded'), 10);
            searchField.focus();
            searchOpen = true;
        } else {
            searchField.classList.remove('expanded');
            setTimeout(() => {
                searchField.remove();
                searchOpen = false;
            }, 300);
        }
    });

    // Login Button Animation
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.addEventListener('mouseover', () => loginBtn.classList.add('pulse'));
    loginBtn.addEventListener('mouseout', () => loginBtn.classList.remove('pulse'));


    // Header animation on scroll
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        lastScrollTop = scrollTop;
    });

    // Music Player Functionality
    const playBtn = document.querySelector('.play-btn');
    const progressBar = document.querySelector('.progress');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const songInfo = document.querySelector('.song-info h3');
    const artistInfo = document.querySelector('.song-info p');
    const albumCover = document.querySelector('.song-info img');
    const currentTimeEl = document.querySelector('.time span:first-child');
    const totalTimeEl = document.querySelector('.time span:last-child');

    let isPlaying = false;
    let currentSong = 0;
    let progressInterval;
    let currentProgress = 0;

    const songs = [
        { title: "Vuma Dlozi Lami", artist: "Issa Sisdoh ft. Ancestral Rituals", cover: "https://cdn-images.dzcdn.net/images/cover/00155c32bca33d8143154e478fe18390/0x1900-000000-80-0-0.jpg", duration: "6:21", durationSeconds: 381 },
        { title: "Chobolo", artist: "Baxon ft. Juu Matere", cover: "https://cdn-images.dzcdn.net/images/cover/3b5772461e195a07518bb3c02fbf41e2/1900x1900-000000-80-0-0.jpg", duration: "3:54", durationSeconds: 234 },
        { title: "Isaku", artist: "Dj Latimmy", cover: "https://mzanzitunes.com/wp-content/uploads/2025/03/Screenshot-2025-03-13-at-20.13.30-578x381.png", duration: "3:53", durationSeconds: 233 },
        { title: "Tsena Rasta", artist: "Monnamogolo wa Thulaganyo", cover: "https://hdlost.com/images/cover/monnamogolo-wa-thulaganyo/monnamogolo-wa-thulaganyo-yame-le-ditsala.jpg", duration: "5:25", durationSeconds: 325 },
        { title: "Phika", artist: "Chokoma", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjmQ008CV5YaSdFeIcL5tHTn1dLAOGZolozQ&s", duration: "4:02", durationSeconds: 242 }
    ];

    playBtn.addEventListener('click', function () {
        isPlaying ? pauseSong() : playSong();
    });

    function playSong() {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        startProgress();
        animateAlbumCover(true);
    }

    function pauseSong() {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        clearInterval(progressInterval);
        animateAlbumCover(false);
    }

    function animateAlbumCover(play) {
        albumCover.style.transition = 'transform 0.5s ease';
        albumCover.style.transform = play ? 'rotate(360deg)' : 'rotate(0deg)';
    }

    function startProgress() {
        clearInterval(progressInterval);
        const duration = songs[currentSong].durationSeconds;
        const increment = 100 / (duration * 10);

        progressInterval = setInterval(() => {
            currentProgress += increment;
            if (currentProgress >= 100) {
                clearInterval(progressInterval);
                nextSong();
                return;
            }
            progressBar.style.width = `${currentProgress}%`;
            const currentSeconds = Math.floor((duration * currentProgress) / 100);
            currentTimeEl.textContent = formatTime(currentSeconds);
        }, 100);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    function loadSong(index) {
        currentProgress = 0;
        progressBar.style.width = '0%';
        const song = songs[index];
        songInfo.textContent = song.title;
        artistInfo.textContent = song.artist;
        albumCover.src = song.cover;
        totalTimeEl.textContent = song.duration;
        currentTimeEl.textContent = '0:00';
        playlistItems.forEach((item, i) => item.classList.toggle('active', i === index));
    }

    function nextSong() {
        currentSong = (currentSong + 1) % songs.length;
        loadSong(currentSong);
        if (isPlaying) playSong();
    }

    function prevSong() {
        currentSong = (currentSong - 1 + songs.length) % songs.length;
        loadSong(currentSong);
        if (isPlaying) playSong();
    }

    document.querySelector('.controls button:first-child').addEventListener('click', prevSong);
    document.querySelector('.controls button:last-child').addEventListener('click', nextSong);

    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentSong = index;
            loadSong(currentSong);
            playSong();
        });
    });

    document.querySelector('.progress-bar').addEventListener('click', function (e) {
        const clickPercentage = (e.offsetX / this.clientWidth) * 100;
        currentProgress = clickPercentage;
        progressBar.style.width = `${clickPercentage}%`;
        const song = songs[currentSong];
        currentTimeEl.textContent = formatTime(Math.floor((song.durationSeconds * clickPercentage) / 100));
        if (isPlaying) {
            clearInterval(progressInterval);
            startProgress();
        }
    });

    loadSong(0);

    // Artist Cards Animation
    const artistCards = document.querySelectorAll('.artist-card');
    artistCards.forEach(card => {
        card.addEventListener('mouseenter', () => card.querySelector('.play-overlay').style.opacity = '1');
        card.addEventListener('mouseleave', () => card.querySelector('.play-overlay').style.opacity = '0');
    });

    // Genre Cards Animation
    const genreCards = document.querySelectorAll('.genre-card');
    genreCards.forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'scale(1.05)');
        card.addEventListener('mouseleave', () => card.style.transform = 'scale(1)');
    });

    // Scroll Animations
    const fadeElements = document.querySelectorAll('.section-header, .artist-card, .genre-card, .event-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));

    // CTA Button Animation
    const ctaBtn = document.querySelector('.cta-btn');
    ctaBtn.addEventListener('mouseover', () => ctaBtn.classList.add('pulse'));
    ctaBtn.addEventListener('mouseout', () => ctaBtn.classList.remove('pulse'));

    // Event Tickets Button
    const ticketBtns = document.querySelectorAll('.ticket-btn');
    ticketBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const originalText = this.textContent;
            this.textContent = 'Redirecting...';
            this.classList.add('loading');
            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove('loading');
            }, 2000);
        });
    });

    // Parallax Effect for Hero
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });

    // Newsletter Signup in Footer
    const subscribeForm = document.querySelector('.subscribe-section form');
    const emailInput = subscribeForm.querySelector('input');
    const submitBtn = subscribeForm.querySelector('button');

    subscribeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const originalText = submitBtn.textContent;
        if (emailInput.validity.valid) {
            submitBtn.textContent = 'Thanks!';
            submitBtn.classList.add('success');
            emailInput.classList.add('success');
            setTimeout(() => {
                emailInput.value = '';
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('success');
                emailInput.classList.remove('success');
            }, 2000);
        } else {
            emailInput.classList.add('error');
            setTimeout(() => emailInput.classList.remove('error'), 500);
        }
    });
});