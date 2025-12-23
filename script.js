// Loading Screen
const loadingScreen = document.getElementById('loadingScreen');

// Body'ye loading class ekle
document.body.classList.add('loading');

// 3 saniye sonra loading screen'i kaldır
setTimeout(() => {
    loadingScreen.classList.add('fade-out');
    document.body.classList.remove('loading');
    
    // Animasyon bittikten sonra elementi tamamen kaldır
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}, 3000);

// DOM Elementleri
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

// Scroll olayı - Navigasyon stilini değiştirme
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Aktif bölümü belirleme
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinksItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Mobil menü toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Mobil menü linklerine tıklayınca menüyü kapat
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Form gönderimi
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        setTimeout(() => {
            alert('Mesajınız için teşekkürler! E-posta istemciniz açılacak.');
        }, 100);
    });
}

// Skill Progress Animation with Intersection Observer
const skillProgress = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.width = entry.target.style.width || '0%';
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

skillProgress.forEach(skill => {
    skillObserver.observe(skill);
});

// Sayfa yükleme animasyonu
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Hareketli arka plan elementlerini oluştur
    createFloatingOrbs();
    createAnimatedLines();
    createParallaxElements();
});

// Hareketli küreler oluşturma
function createFloatingOrbs() {
    const orbsContainer = document.createElement('div');
    orbsContainer.className = 'floating-orbs';
    
    // 6 adet yüzen küre oluştur
    for (let i = 0; i < 6; i++) {
        const orb = document.createElement('div');
        orb.className = 'orb';
        orbsContainer.appendChild(orb);
    }
    
    document.body.appendChild(orbsContainer);
}

// Hareketli çizgiler oluşturma
function createAnimatedLines() {
    const linesContainer = document.createElement('div');
    linesContainer.className = 'animated-lines';
    
    // 3 adet hareketli çizgi oluştur
    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.className = 'line';
        linesContainer.appendChild(line);
    }
    
    document.body.appendChild(linesContainer);
}

// Paralaks elementleri oluşturma
function createParallaxElements() {
    const parallaxContainer = document.createElement('div');
    parallaxContainer.className = 'parallax-container';
    parallaxContainer.style.position = 'fixed';
    parallaxContainer.style.top = '0';
    parallaxContainer.style.left = '0';
    parallaxContainer.style.width = '100%';
    parallaxContainer.style.height = '100%';
    parallaxContainer.style.pointerEvents = 'none';
    parallaxContainer.style.zIndex = '-1';
    
    // 3 adet paralaks element oluştur
    for (let i = 1; i <= 3; i++) {
        const element = document.createElement('div');
        element.className = `parallax-element parallax-${i}`;
        parallaxContainer.appendChild(element);
    }
    
    document.body.appendChild(parallaxContainer);
}

// Mouse takip eden partikül efekti
function createMouseTrail() {
    const trail = [];
    const maxTrailLength = 20;
    
    document.addEventListener('mousemove', (e) => {
        // Rastgele partikül oluştur
        if (Math.random() > 0.9) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = e.clientX + 'px';
            particle.style.top = e.clientY + 'px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.borderRadius = '50%';
            particle.style.background = `rgba(${Math.random() > 0.5 ? '94, 23, 235' : '0, 194, 255'}, 0.6)`;
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            particle.style.boxShadow = `0 0 6px rgba(${Math.random() > 0.5 ? '94, 23, 235' : '0, 194, 255'}, 0.8)`;
            
            document.body.appendChild(particle);
            
            // Partikülü animasyonla kaybet
            setTimeout(() => {
                particle.style.transition = 'all 1s ease-out';
                particle.style.transform = 'scale(0)';
                particle.style.opacity = '0';
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 1000);
            }, 100);
        }
    });
}

// Scroll tabanlı paralaks efekti
function initScrollParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Tüm efektleri başlat
createMouseTrail();
initScrollParallax();

// Yumuşak kaydırma işlevi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Projeler için hover efekti
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.classList.add('glow');
    });

    card.addEventListener('mouseleave', () => {
        card.classList.remove('glow');
    });
});

// Servis kartları için hover efekti
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.classList.add('glow');
    });

    card.addEventListener('mouseleave', () => {
        card.classList.remove('glow');
    });
}); 