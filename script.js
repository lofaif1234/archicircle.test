document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        const isExpanded = mobileToggle.classList.contains('active');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Dynamic Text Swapping for About Hero
    const dynamicText = document.getElementById('dynamic-text');
    if (dynamicText) {
        const phrases = ["de la Vida", "del arte", "del diseño", "del modelado 3D"];
        let currentIndex = 0;

        setInterval(() => {
            dynamicText.classList.add('text-fade-out');

            setTimeout(() => {
                currentIndex = (currentIndex + 1) % phrases.length;
                dynamicText.textContent = phrases[currentIndex];
                dynamicText.classList.remove('text-fade-out');
            }, 300); 
        }, 2000);
    }

    // Scroll Reveal Animation System
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // If it's a container we want to stagger, handle its children
                if (target.classList.contains('stagger-container')) {
                    const children = target.querySelectorAll('.reveal-item');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('is-visible');
                        }, index * 150); // 150ms delay between items
                    });
                } else {
                    target.classList.add('is-visible');
                }
                
                revealObserver.unobserve(target);
            }
        });
    }, revealOptions);

    // Initial setup for reveal elements
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll, h1, h2, h3, .footer-col, .social-link-item');
    elementsToReveal.forEach(el => {
        if (!el.closest('.stagger-container')) {
            el.classList.add('reveal-item');
            revealObserver.observe(el);
        }
    });

    // Special handling for grids and rows (stagger containers)
    const containersToStagger = document.querySelectorAll('.pricing-grid, .social-icons-row, .footer-grid, .services-grid, .material-grid');
    containersToStagger.forEach(container => {
        container.classList.add('stagger-container');
        const children = container.children;
        Array.from(children).forEach(child => child.classList.add('reveal-item'));
        revealObserver.observe(container);
    });

    // Load CMS Content if the function is called
    if (typeof loadPageContent === 'function') {
        loadPageContent();
    }
});

/**
 * loadPageContent - Automatically detects the current page and loads corresponding JSON data.
 */
async function loadPageContent() {
    const path = window.location.pathname;
    let jsonFile = '';

    // Simple detection based on filename
    if (path === '/' || path.endsWith('index.html')) {
        jsonFile = '/data/home.json';
    } else if (path.endsWith('sobre-nosotros.html')) {
        jsonFile = '/data/about.json';
    } else if (path.endsWith('materiales.html')) {
        jsonFile = '/data/materials.json';
    } else if (path.endsWith('maquinaria.html')) {
        jsonFile = '/data/machines.json';
    } else if (path.endsWith('contacto.html')) {
        jsonFile = '/data/contact.json';
    }

    if (!jsonFile) return;

    try {
        const response = await fetch(jsonFile);
        if (!response.ok) throw new Error('Failed to load ' + jsonFile);
        const data = await response.json();

        const mapping = {
            'title': 'intro-title',
            'description': 'intro-description',
            'hero_image': 'intro-img'
        };

        for (const [key, elementId] of Object.entries(mapping)) {
            const element = document.getElementById(elementId);
            if (element && data[key]) {
                if (element.tagName === 'IMG') {
                    element.src = data[key];
                } else {
                    element.innerHTML = data[key];
                }
            }
        }
    } catch (error) {
        console.error('Error loading CMS content:', error);
    }
}

// Netlify Identity Widget handling
if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
        if (!user) {
            window.netlifyIdentity.on("login", () => {
                document.location.href = "/admin/";
            });
        }
    });
}
