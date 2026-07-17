document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal, .fade-in');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    
    // Trigger once on load
    revealOnScroll();
    
    // Basic mobile menu toggle (for demonstration)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
        });

        // Close menu when a link is clicked
        const links = document.querySelectorAll('.nav-links li a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                hamburger.classList.remove('toggle');
            });
        });
    }

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });
    // --- Currency Converter ---
    const currencySelects = document.querySelectorAll('.currency-select');
    const priceElements = document.querySelectorAll('.dynamic-price');
    const currencyLabels = document.querySelectorAll('.dynamic-currency');

    let exchangeRates = null;

    async function fetchExchangeRates() {
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/UGX');
            const data = await response.json();
            exchangeRates = data.rates;
            
            const savedCurrency = localStorage.getItem('preferredCurrency');
            if (savedCurrency && exchangeRates[savedCurrency]) {
                currencySelects.forEach(select => select.value = savedCurrency);
                updatePrices(savedCurrency);
            }
        } catch (error) {
            console.error("Failed to load exchange rates", error);
        }
    }

    function updatePrices(currency) {
        if (!exchangeRates) return;
        const rate = exchangeRates[currency];
        
        priceElements.forEach(el => {
            const basePrice = parseFloat(el.getAttribute('data-base-price'));
            const convertedPrice = basePrice * rate;
            
            if (currency === 'UGX') {
                el.textContent = convertedPrice.toLocaleString('en-US');
            } else {
                el.textContent = convertedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
        });
        
        currencyLabels.forEach(el => {
            el.textContent = currency;
        });
    }

    if (currencySelects.length > 0) {
        currencySelects.forEach(select => {
            select.addEventListener('change', (e) => {
                const selected = e.target.value;
                localStorage.setItem('preferredCurrency', selected);
                // Sync all selectors on the page
                currencySelects.forEach(s => s.value = selected);
                updatePrices(selected);
            });
        });
        fetchExchangeRates();
    }
    
    // --- Custom Cursor ---
    // Only on desktop
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, select, .room-card, .drawer-input').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }
    
    // --- Digital Concierge Drawer ---
    const drawer = document.getElementById('concierge-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const closeBtn = document.getElementById('close-drawer');
    const openBtns = document.querySelectorAll('.open-drawer');

    if(drawer && overlay) {
        const toggleDrawer = () => {
            drawer.classList.toggle('open');
            overlay.classList.toggle('open');
        };

        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleDrawer();
            });
        });

        if(closeBtn) closeBtn.addEventListener('click', toggleDrawer);
        overlay.addEventListener('click', toggleDrawer);

        const sendBtn = document.getElementById('send-whatsapp');
        if(sendBtn) {
            sendBtn.addEventListener('click', () => {
                const name = document.getElementById('guest-name').value || 'Guest';
                const date = document.getElementById('check-in').value || 'an upcoming date';
                const room = document.getElementById('room-pref').value || 'a room';
                const msg = `Hello Karibu Concierge! I am ${name} and I would like to book ${room} starting ${date}. Is there availability?`;
                window.open(`https://wa.me/256772662001?text=${encodeURIComponent(msg)}`, '_blank');
            });
        }

        // Set minimum date for check-in to today
        const checkInInput = document.getElementById('check-in');
        if (checkInInput) {
            const today = new Date().toISOString().split('T')[0];
            checkInInput.setAttribute('min', today);
        }
    }
});

// --- Preloader ---
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.transform = 'translateY(-100%)';
            setTimeout(() => preloader.remove(), 1000);
        }
    }, 1200);
});
