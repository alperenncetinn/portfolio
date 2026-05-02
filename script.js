// Tema ve dil kontrolü
const themeToggle = document.getElementById('themeToggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const languageToggle = document.querySelector('.language-toggle');
const languageButtons = document.querySelectorAll('[data-language-option]');
const languageStorageKey = 'portfolio-language';
let currentLanguage = 'tr';

const uiText = {
    tr: {
        title: 'Alperen Çetin | Software Engineer',
        languageLabel: 'Dil seçimi',
        themeToLight: 'Gündüz moduna geç',
        themeToDark: 'Gece moduna geç',
        contactAlert: 'Mesajınız için teşekkürler! E-posta istemciniz açılacak.'
    },
    en: {
        title: 'Alperen Çetin | Software Engineer',
        languageLabel: 'Language selection',
        themeToLight: 'Switch to day mode',
        themeToDark: 'Switch to night mode',
        contactAlert: 'Thanks for your message! Your email client will open.'
    }
};

const textTranslations = {
    'Ana Sayfa': 'Home',
    'Hakkımda': 'About',
    'Projeler': 'Projects',
    'Hizmetler': 'Services',
    'İletişim': 'Contact',
    'Yeni projelere açığım': 'Open to new projects',
    'Merhaba, Ben': 'Hi, I am',
    'Full Stack Developer & Bilgisayar Mühendisliği öğrencisi. Modern teknolojilerle kullanıcı odaklı çözümler geliştiriyor, fikirleri işlevsel uygulamalara dönüştürüyorum.': 'Full Stack Developer & Computer Engineering student. I build user-focused solutions with modern technologies and turn ideas into functional applications.',
    'Projelerimi Keşfet': 'Explore My Projects',
    'İletişime Geç': 'Get in Touch',
    'Tamamlanan Proje': 'Completed Projects',
    'Yıl Deneyim': 'Years Experience',
    'Teknoloji Stack': 'Technology Stack',
    'Blog Yazısı': 'Blog Posts',
    'Yazılım Mühendisi Profili': 'Software Engineer Profile',
    'Teknoloji tutkusu ve sürekli öğrenme motivasyonuyla projeler geliştiriyorum': 'I build projects with a passion for technology and a constant drive to learn',
    'Profesyonel Profil': 'Professional Profile',
    "Bilgisayar Mühendisliği son sınıf öğrencisiyim (4. sınıfı tamamladım) ve 3+ yıldır aktif yazılım geliştirme deneyimine sahibim. Eğitimim boyunca sadece teorik değil, uygulamalı projeler geliştirerek pratik yetkinliğimi güçlendirdim. GitHub'ımda web, mobil ve yapay zeka / veri odaklı projeler üzerinde çalıştığım açık şekilde görülebilir.": 'I am a senior Computer Engineering student and have 3+ years of active software development experience. Throughout my education, I strengthened my practical skills by building applied projects, not only studying theory. My GitHub clearly shows work across web, mobile, AI, and data-focused projects.',
    "Vestel'de tamamladığım staj programı süresince kurumsal yazılım geliştirme süreçleri, ekip çalışması ve sürdürülebilir kod uygulamaları konusunda deneyim kazandım. Bu süreç, yazılım mühendisliği disiplinini gerçek iş hayatı pratiği ile birleştirmemde önemli bir adım oldu.": 'During my internship at Vestel, I gained experience in enterprise software development processes, teamwork, and sustainable coding practices. This was an important step in connecting software engineering discipline with real-world practice.',
    "Android ve Python tabanlı projeler geliştirerek; Google Play Store'a yayımlanan uygulamalar dahil olmak üzere kullanıcı odaklı çözümler ürettim. Backend ve veri uygulamaları üzerine yaptığım çalışmalar, gerçek dünya verileri ve modeller kullanarak operasyonel değeri yüksek çözümler ortaya koymama olanak sağladı.": 'By building Android and Python-based projects, including applications published on Google Play, I created user-focused solutions. My work on backend and data applications helped me produce operationally valuable solutions using real-world data and models.',
    'Freelance olarak farklı sektörlerden müşterilere danışmanlık ve yazılım geliştirme hizmeti vererek; proje yaşam döngüsü, müşteri iletişimi ve ölçeklenebilir çözüm üretme becerilerimi pekiştirdim. Şu anda uzun dönem staj ve profesyonel iş hayatına geçiş aşamasındayım; bu süreçte backend, mobil ve yapay zeka odaklı daha büyük ölçekli projelerde sorumluluk almak istiyorum.': 'As a freelancer, I have provided consulting and software development services to clients across different sectors, strengthening my project lifecycle, client communication, and scalable solution design skills. I am currently transitioning into long-term internship and professional work opportunities, with a focus on larger backend, mobile, and AI-driven projects.',
    'Teknik Yetkinlikler': 'Technical Skills',
    'Proje': 'Projects',
    'Yetkinliklerimi sadece oranlarla değil, geliştirdiğim gerçek projelerle okumak daha anlamlı. Aşağıda her teknoloji alanının portfolyodaki karşılığını görebilirsin.': 'It is more meaningful to read my skills through real projects, not only percentages. Below you can see how each technology area maps to the portfolio.',
    'Backend API, kimlik doğrulama, mimari': 'Backend API, authentication, architecture',
    'Android / Kotlin / Java': 'Android / Kotlin / Java',
    'Mobil uygulama, kullanıcı akışı, yayınlama': 'Mobile apps, user flows, publishing',
    'Python / AI / ML': 'Python / AI / ML',
    'RAG, veri analizi, tahmin modelleri': 'RAG, data analysis, prediction models',
    'React / TypeScript': 'React / TypeScript',
    'Dashboard, yönetim paneli, veri görselleştirme': 'Dashboards, admin panels, data visualization',
    'SQL / Data / Business Apps': 'SQL / Data / Business Apps',
    'Operasyonel veri, stok, satış ve raporlama': 'Operational data, inventory, sales, and reporting',
    'Deneyim': 'Experience',
    'Endüstriyel Analitik Dashboard': 'Industrial Analytics Dashboard',
    'Yapay Zeka Platformu': 'AI Platform',
    'Kurumsal Bildirim Sistemi': 'Enterprise Notification System',
    'Karar Destek Sistemi': 'Decision Support System',
    'Vestel - Stajyer': 'Vestel - Intern',
    'Remote-Kumanda:': 'Remote Control:',
    'Mobil Uygulama': 'Mobile Application',
    'Yazılım Süreçleri:': 'Software Processes:',
    'Kurumsal Geliştirme': 'Enterprise Development',
    'Mobil & Web uygulama geliştirme': 'Mobile & web application development',
    'CBÜ - Bilgisayar Mühendisliği': 'CBU - Computer Engineering',
    '4. Sınıf Öğrencisi': 'Senior Student',
    'Son Projelerim': 'Recent Projects',
    'Geliştirdiğim uygulamalar ve çözümler': 'Applications and solutions I have built',
    'CORTEX AI - Şirketler için Lokal Yapay Zeka': 'CORTEX AI - Local AI for Companies',
    '🧠 On-Premise RAG sistemi: Şirket verilerinizi (dokümanlar, Excel, raporlar) dış servislere çıkmadan, tamamen yerel altyapıda yapay zeka ile sorgulayın. Veri gizliliği, sabit maliyet ve tam kontrol.': '🧠 On-premise RAG system: Query your company data, including documents, spreadsheets, and reports, with AI on fully local infrastructure without sending it to external services. Data privacy, predictable cost, and full control.',
    'Detayları İncele': 'View Details',
    'Ses tabanlı yapay zeka sistemi ile kişiselleştirilmiş UPDRS skor tahmini ve uzaktan Parkinson izleme uygulaması.': 'A voice-based AI system for personalized UPDRS score prediction and remote Parkinson monitoring.',
    'Canlı Demo': 'Live Demo',
    'PolyMetrics Endüstriyel Dashboard': 'PolyMetrics Industrial Dashboard',
    'Endüstriyel sistemler için geliştirilmiş, tag, alarm ve istatistik verilerini anlık sağlayan bir analitik gösterge paneli (dashboard) projesi. Çok eksenli (multi-axis) zaman serisi analizi ve Microsoft SSO güvenliği içerir.': 'An analytics dashboard for industrial systems that delivers real-time tag, alarm, and statistics data. It includes multi-axis time series analysis and Microsoft SSO security.',
    'fabrika operasyonları için geliştirilmiş; ontoloji ve RAG tabanlı deterministik veri sorgulama, analiz ve platform yönetimi aracı.': 'A deterministic data querying, analytics, and platform management tool for factory operations, powered by ontology and RAG-based workflows.',
    'Justion - Karar Destek Sistemi': 'Justion - Decision Support System',
    'Performans değerlendirmelerindeki öznelliği; graf teorisi, NLP ve açıklanabilir yapay zeka (XAI) ile ortadan kaldıran şeffaf karar destek platformu.': 'A transparent decision support platform that reduces subjectivity in performance evaluations using graph theory, NLP, and explainable AI (XAI).',
    'Yazılım Mühendisliği dönem projesi - Kanban, UML, birim testleri.': 'Software Engineering term project with Kanban, UML, and unit tests.',
    'İncele': 'View',
    'AI destekli modern tarot uygulaması.': 'A modern AI-powered tarot application.',
    'ML tabanlı hisse senedi tahmin platformu.': 'An ML-based stock prediction platform.',
    'JWT kimlik doğrulaması ile güvenli RESTful API - Kitap koleksiyonu yönetimi.': 'A secure RESTful API with JWT authentication for managing book collections.',
    'PathToUni, YKS (TYT & AYT) sınavına hazırlanan öğrenciler için özel olarak tasarlanmış modern ve özelleştirilebilir bir sınav hazırlık uygulamasıdır. Tüm çalışma sürecinizi tek bir yerden yönetmenizi, ilerlemenizi takip etmenizi ve eksiklerinizi kolayca belirlemenizi sağlar.': 'PathToUni is a modern and customizable exam preparation app designed for students preparing for the YKS exams (TYT & AYT). It helps manage the entire study process, track progress, and identify weak areas from one place.',
    'Mobil': 'Mobile',
    '🎣 Fishify, balıkçılar için özel olarak geliştirilmiş bir balıkçılık asistanıdır. Hava durumu, deniz güvenliği, balık türü olasılıkları ve akıllı öneriler sunar. Kendi balıkçılık planınızı oluşturun, en iyi balık türlerini ve av saatlerini öğrenin, güvenli ve verimli bir balıkçılık deneyimi yaşayın!': '🎣 Fishify is a fishing assistant built specifically for anglers. It provides weather insights, sea safety information, fish species probabilities, and smart suggestions. Create your own fishing plan, discover the best species and fishing times, and enjoy a safer, more efficient fishing experience.',
    'Diyabet hastalarının hastaneye yeniden yatış olasılığı tahmin sistemi.': 'A system for predicting hospital readmission risk for diabetes patients.',
    "KOBİ'ler için yönetim sistemi.": 'A management system for SMEs.',
    'Caller ID destekli POS sistemi.': 'A POS system with Caller ID support.',
    'İşletim sistemleri final projesi.': 'Operating systems final project.',
    'E-ticaret fiyat takip sistemi.': 'E-commerce price tracking system.',
    'Ağ yönetimi rehberi.': 'Network management guide.',
    "Kitaplık yönetim API'si.": 'Library management API.',
    'Yazılarım': 'My Articles',
    'Yazılım geliştirme süreçleri ve teknoloji trendleri': 'Software development processes and technology trends',
    'Ağu': 'Aug',
    'Tem': 'Jul',
    "EF Core Deep Dive: ADO.NET'ten Entity Framework'e Kapsamlı Geçiş Rehberi": 'EF Core Deep Dive: A Complete Migration Guide from ADO.NET to Entity Framework',
    'Entity Framework Core ile modern veri erişimi, CRUD işlemleri, LINQ sorguları ve Code First yaklaşımı.': 'Modern data access with Entity Framework Core, CRUD operations, LINQ queries, and the Code First approach.',
    'Devamını Oku': 'Read More',
    'MediatR ve FluentValidation ile Clean Architecture': 'Clean Architecture with MediatR and FluentValidation',
    "MediatR ve FluentValidation kütüphanelerinin .NET projelerinde nasıl kullanılacağını keşfedin.": 'Discover how to use MediatR and FluentValidation in .NET projects.',
    '.NET Clean Architecture: Temiz Mimari Rehberi': '.NET Clean Architecture: Clean Architecture Guide',
    "Robert C. Martin'in Clean Architecture prensiplerinin .NET projelerinde uygulanması.": "Applying Robert C. Martin's Clean Architecture principles in .NET projects.",
    'AWS DevOps: CI/CD Süreçleri': 'AWS DevOps: CI/CD Processes',
    'DevOps kültürünün temelleri ve CI/CD süreçlerini AWS araçlarıyla optimize etme.': 'The fundamentals of DevOps culture and optimizing CI/CD processes with AWS tools.',
    'AWS Microservices & API Gateway': 'AWS Microservices & API Gateway',
    'Mikroservis mimarisi ve AWS API Gateway ile merkezi erişim noktası oluşturma.': 'Building a central access point with microservice architecture and AWS API Gateway.',
    'C# programlamada Abstract Class ve Interface kavramları arasındaki farklar.': 'The differences between Abstract Class and Interface concepts in C# programming.',
    'Yakında': 'Coming Soon',
    'Yeni Yazılar Geliyor': 'New Articles Are Coming',
    'Yazılım geliştirme ve teknoloji trendleri hakkında daha fazla içerik için takipte kalın.': 'Stay tuned for more content about software development and technology trends.',
    'Profesyonel Hizmetlerim': 'Professional Services',
    'Yazılım geliştirme ve danışmanlık hizmetleri': 'Software development and consulting services',
    'Web Uygulama Geliştirme': 'Web Application Development',
    "Responsive tasarım prensipleri ve modern framework'lerle SEO uyumlu, yüksek performanslı web uygulamaları geliştiriyorum.": 'I build SEO-friendly, high-performance web applications with responsive design principles and modern frameworks.',
    'Mobil Uygulama Geliştirme': 'Mobile Application Development',
    'Android platformunda native ve cross-platform mobil uygulamalar geliştiriyorum. Performans optimizasyonu ve UI/UX tasarımı.': 'I develop native and cross-platform mobile applications for Android, with performance optimization and UI/UX design.',
    'Kurumsal Yazılım Çözümleri': 'Enterprise Software Solutions',
    'Restoran, market, cafe gibi işletmeler için özelleştirilmiş yazılım çözümleri. İş süreçlerinizi dijitalleştiriyorum.': 'Customized software solutions for businesses such as restaurants, markets, and cafes. I help digitize business processes.',
    'Backend Geliştirme & API Tasarımı': 'Backend Development & API Design',
    "Ölçeklenebilir mikroservis mimarileri, güvenli RESTful API'ler ve veritabanı tasarımı. Cloud infrastructure çözümleri.": 'Scalable microservice architectures, secure RESTful APIs, and database design. Cloud infrastructure solutions.',
    'Proje teklifleri ve iş birliği fırsatları için': 'For project proposals and collaboration opportunities',
    'Bağlantı Kuralım': "Let's Connect",
    'Proje teklifleri, iş birliği fırsatları ve teknik danışmanlık için benimle iletişime geçebilirsiniz.': 'You can contact me for project proposals, collaboration opportunities, and technical consulting.',
    'İsim': 'Name',
    'E-posta': 'Email',
    'Konu': 'Subject',
    'Mesajınız': 'Your Message',
    'Gönder': 'Send',
    '- Tüm Hakları Saklıdır | Software Engineer': '- All Rights Reserved | Software Engineer'
};

const attributeTranslations = [
    { selector: '#name', attr: 'placeholder', tr: 'Adınız Soyadınız', en: 'Your full name' },
    { selector: '#email', attr: 'placeholder', tr: 'ornek@email.com', en: 'example@email.com' },
    { selector: '#subject', attr: 'placeholder', tr: 'Proje hakkında...', en: 'About the project...' },
    { selector: '#message', attr: 'placeholder', tr: 'Mesajınızı buraya yazın...', en: 'Write your message here...' }
];

const originalTextNodes = new WeakMap();
const translatableTextNodes = [];

function normalizeText(value) {
    return value.replace(/\s+/g, ' ').trim();
}

function collectTranslatableTextNodes() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            const key = normalizeText(node.nodeValue);
            return textTranslations[key] ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
    });

    let node = walker.nextNode();
    while (node) {
        translatableTextNodes.push(node);
        originalTextNodes.set(node, {
            value: node.nodeValue,
            key: normalizeText(node.nodeValue)
        });
        node = walker.nextNode();
    }
}

function withOriginalSpacing(originalValue, replacementValue) {
    const leading = originalValue.match(/^\s*/)?.[0] || '';
    const trailing = originalValue.match(/\s*$/)?.[0] || '';
    return `${leading}${replacementValue}${trailing}`;
}

function persistLanguage(language) {
    try {
        localStorage.setItem(languageStorageKey, language);
    } catch (error) {
        // localStorage kapalıysa dil seçimi yalnızca mevcut oturumda kalır.
    }
}

function getInitialLanguage() {
    try {
        return localStorage.getItem(languageStorageKey) === 'en' ? 'en' : 'tr';
    } catch (error) {
        return 'tr';
    }
}

function updateThemeToggleLabel() {
    if (!themeToggle) return;

    const labels = uiText[currentLanguage] || uiText.tr;
    const isLight = document.documentElement.dataset.theme === 'light';
    const label = isLight ? labels.themeToDark : labels.themeToLight;
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', label);
    themeToggle.title = label;
}

function applyTheme(theme) {
    const selectedTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = selectedTheme;
    updateThemeToggleLabel();

    if (themeMeta) {
        themeMeta.setAttribute('content', selectedTheme === 'light' ? '#f7fafc' : '#05070c');
    }
}

function applyLanguage(language, shouldPersist = true) {
    const selectedLanguage = language === 'en' ? 'en' : 'tr';
    currentLanguage = selectedLanguage;
    document.documentElement.lang = selectedLanguage;
    document.title = uiText[selectedLanguage].title;

    translatableTextNodes.forEach(node => {
        const original = originalTextNodes.get(node);
        if (!original) return;

        node.nodeValue = selectedLanguage === 'en'
            ? withOriginalSpacing(original.value, textTranslations[original.key])
            : original.value;
    });

    attributeTranslations.forEach(item => {
        document.querySelectorAll(item.selector).forEach(element => {
            element.setAttribute(item.attr, item[selectedLanguage]);
        });
    });

    languageButtons.forEach(button => {
        const isActive = button.dataset.languageOption === selectedLanguage;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });

    if (languageToggle) {
        languageToggle.setAttribute('aria-label', uiText[selectedLanguage].languageLabel);
    }

    updateThemeToggleLabel();

    if (shouldPersist) {
        persistLanguage(selectedLanguage);
    }
}

collectTranslatableTextNodes();
applyTheme('light');
applyLanguage(getInitialLanguage(), false);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
    });
}

languageButtons.forEach(button => {
    button.addEventListener('click', () => {
        applyLanguage(button.dataset.languageOption);
    });
});

// Loading Screen
const loadingScreen = document.getElementById('loadingScreen');

if (loadingScreen) {
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
}

// DOM Elementleri
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

// Scroll olayı - Navigasyon stilini değiştirme
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
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

    if (current) {
        navLinksItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    }
});

// Mobil menü toggle
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Mobil menü linklerine tıklayınca menüyü kapat
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        if (hamburger && navLinks) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

// Form gönderimi
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        setTimeout(() => {
            alert(uiText[currentLanguage].contactAlert);
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
    document.addEventListener('mousemove', (e) => {
        // Rastgele partikül oluştur
        if (Math.random() > 0.9) {
            const rootStyles = getComputedStyle(document.documentElement);
            const primaryTrail = rootStyles.getPropertyValue('--mouse-trail-primary').trim() || '0, 194, 255';
            const secondaryTrail = rootStyles.getPropertyValue('--mouse-trail-secondary').trim() || '94, 23, 235';
            const particleColor = Math.random() > 0.5 ? secondaryTrail : primaryTrail;
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = e.clientX + 'px';
            particle.style.top = e.clientY + 'px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.borderRadius = '50%';
            particle.style.background = `rgba(${particleColor}, 0.6)`;
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            particle.style.boxShadow = `0 0 6px rgba(${particleColor}, 0.8)`;

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
