document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
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
    }

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

    if (typeof IntersectionObserver !== 'undefined') {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    
                    if (target.classList.contains('stagger-container')) {
                        const children = target.querySelectorAll('.reveal-item');
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('is-visible');
                            }, index * 150);
                        });
                    } else {
                        target.classList.add('is-visible');
                    }
                    
                    revealObserver.unobserve(target);
                }
            });
        }, revealOptions);

        const elementsToReveal = document.querySelectorAll('.reveal-on-scroll, h1, h2, h3, .footer-col, .social-link-item');
        elementsToReveal.forEach(el => {
            if (!el.closest('.stagger-container')) {
                el.classList.add('reveal-item');
                revealObserver.observe(el);
            }
        });

        const containersToStagger = document.querySelectorAll('.pricing-grid, .social-icons-row, .footer-grid, .services-grid, .material-grid');
        containersToStagger.forEach(container => {
            container.classList.add('stagger-container');
            const children = container.children;
            Array.from(children).forEach(child => child.classList.add('reveal-item'));
            revealObserver.observe(container);
        });
    }

    // Auto-load CMS content
    loadPageContent();
});

/**
 * loadPageContent - Detects the page and loads JSON data.
 */
async function loadPageContent() {
    const path = window.location.pathname;
    let jsonFile = '';

    // Relative paths are safer for subfolder hosting (e.g. GitHub Pages)
    if (path === '/' || path.endsWith('index.html') || path.endsWith('/')) {
        jsonFile = 'data/home.json';
    } else if (path.endsWith('sobre-nosotros.html')) {
        jsonFile = 'data/about.json';
    } else if (path.endsWith('materiales.html')) {
        jsonFile = 'data/materials.json';
    } else if (path.endsWith('maquinaria.html')) {
        jsonFile = 'data/machines.json';
    } else if (path.endsWith('contacto.html')) {
        jsonFile = 'data/contact.json';
    }

    if (!jsonFile) return;

    try {
        console.log('Fetching CMS data from:', jsonFile);
        const response = await fetch(jsonFile);
        if (!response.ok) throw new Error('Could not find ' + jsonFile);
        const data = await response.json();

        // Update Text
        if (data.title && document.getElementById('intro-title')) {
            document.getElementById('intro-title').innerHTML = data.title;
        }
        if (data.description && document.getElementById('intro-description')) {
            document.getElementById('intro-description').innerHTML = data.description;
        }

        // Update Images (handles both <img> tags and background images)
        if (data.hero_image) {
            const imgElement = document.getElementById('intro-img');
            const bgElement = document.getElementById('intro-bg');

            if (imgElement) {
                imgElement.src = data.hero_image;
            }
            if (bgElement) {
                bgElement.style.backgroundImage = `url('${data.hero_image}')`;
            }
        }
    } catch (error) {
        console.warn('CMS Loader:', error.message);
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
