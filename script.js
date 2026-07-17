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
});
