// carousel.js - универсальный менеджер для всех разделов
document.addEventListener('DOMContentLoaded', async function() {
    // Универсальный класс для управления отображением карточек
    class UniversalCardsManager {
        constructor(config) {
            this.sectionClass = config.sectionClass;
            this.jsonFile = config.jsonFile;
            this.titleClass = config.titleClass || null;
            this.descriptionClass = config.descriptionClass || null;
            this.cardData = [];
            this.currentIndex = 0;
            this.visibleCards = 3;
            this.layoutMode = null; // 'grid' или 'carousel'
            this.cardsContainer = null;
            this.containerElement = null;
            this.prevBtn = null;
            this.nextBtn = null;
            this.titleElement = null;
            this.descriptionElement = null;
        }

        // Инициализация
        async init() {
            const section = document.querySelector(this.sectionClass);
            if (!section) {
                console.warn(`Секция ${this.sectionClass} не найдена`);
                return;
            }
            
            // Находим элементы
            this.cardsContainer = section.querySelector('.cards, .carousel');
            this.containerElement = this.cardsContainer?.parentElement;
            this.prevBtn = section.querySelector('.prev, .carousel-prev');
            this.nextBtn = section.querySelector('.next, .carousel-next');
            
            if (this.titleClass) {
                this.titleElement = section.querySelector(this.titleClass);
            }
            
            if (this.descriptionClass) {
                this.descriptionElement = section.querySelector(this.descriptionClass);
            }
            
            if (!this.cardsContainer) {
                console.warn('Контейнер карточек не найден в секции', this.sectionClass);
                return;
            }
            
            // Загружаем данные
            this.cardData = await this.loadCards();
            
            if (this.cardData.length > 0) {
                this.initLayout();
            } else {
                this.cardsContainer.innerHTML = '<p>Нет данных для отображения</p>';
            }
        }
        
        // Загрузка данных из JSON
        async loadCards() {
            try {
                const response = await fetch(this.jsonFile);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error(`Ошибка загрузки данных из ${this.jsonFile}:`, error);
                return [];
            }
        }
        
        // Определяем и инициализируем layout
        initLayout() {
            // Определяем режим отображения на основе количества карточек
            if (this.cardData.length <= 4) {
                this.layoutMode = 'grid';
                this.showAsGrid();
            } else {
                this.layoutMode = 'carousel';
                this.showAsCarousel();
            }
            
            // Добавляем обработчики для свайпа (только для карусели)
            if (this.layoutMode === 'carousel') {
                this.setupSwipe();
            }
        }
        
        // Показать как сетку
        showAsGrid() {
            if (!this.cardsContainer || !this.containerElement) return;
            
            // Устанавливаем классы для сетки
            this.containerElement.classList.add('grid-layout');
            this.containerElement.classList.remove('carousel-layout');
            this.cardsContainer.classList.add('cards-grid');
            this.cardsContainer.classList.remove('cards-carousel');
            
            // Добавляем класс для количества карточек
            const gridClass = this.getGridClass();
            this.cardsContainer.classList.add(gridClass);
            
            // Очищаем контейнер
            this.cardsContainer.innerHTML = '';
            
            // Создаем и добавляем карточки в сетку
            this.cardData.forEach(card => {
                const cardElement = this.createGridCard(card);
                this.cardsContainer.appendChild(cardElement);
            });
            
            // Скрываем кнопки навигации
            if (this.prevBtn) this.prevBtn.style.display = 'none';
            if (this.nextBtn) this.nextBtn.style.display = 'none';
            
            // Скрываем описание если оно есть (для ИИ раздела)
            if (this.descriptionElement && this.cardData.length > 0) {
                this.descriptionElement.style.display = 'block';
            }
        }
        
        // Определяем класс сетки в зависимости от количества карточек
        getGridClass() {
            const count = this.cardData.length;
            if (count === 1) return 'grid-1';
            if (count === 2) return 'grid-2';
            if (count === 3) return 'grid-3';
            return 'grid-4'; // для 4 карточек
        }
        
        // Показать как карусель
        showAsCarousel() {
            if (!this.cardsContainer || !this.containerElement) return;
            
            // Устанавливаем классы для карусели
            this.containerElement.classList.add('carousel-layout');
            this.containerElement.classList.remove('grid-layout');
            this.cardsContainer.classList.add('cards-carousel');
            this.cardsContainer.classList.remove('cards-grid');
            
            // Удаляем классы сетки
            this.cardsContainer.classList.remove('grid-1', 'grid-2', 'grid-3', 'grid-4');
            
            // Показываем кнопки навигации
            if (this.prevBtn) this.prevBtn.style.display = 'flex';
            if (this.nextBtn) this.nextBtn.style.display = 'flex';
            
            // Скрываем описание если оно есть (для ИИ раздела)
            if (this.descriptionElement && this.cardData.length > 4) {
                this.descriptionElement.style.display = 'none';
            }
            
            this.updateVisibleCards();
            this.renderCarouselCards();
            
            // Обработчики событий для кнопок навигации
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => {
                    this.scrollCarousel(-1);
                });
            }
            
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => {
                    this.scrollCarousel(1);
                });
            }
        }
        
        // Создать карточку для сетки
        createGridCard(card) {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'grid-card';
            cardDiv.dataset.id = card.id;
            
            cardDiv.innerHTML = `
                <div class="grid-card-image">
                    <img src="${card.image}" alt="${card.title}" loading="lazy">
                </div>
                <div class="grid-card-content">
                    <h3 class="grid-card-title">${card.title}</h3>
                    <p class="grid-card-description">${card.description}</p>
                    <p class="grid-card-postscription">${card.postscription}</p>
                </div>
            `;
            
            cardDiv.addEventListener('click', () => {
                openModal(card);
            });
            
            return cardDiv;
        }
        
        // Создать карточку для карусели
        createCarouselCard(card) {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'carousel-card';
            cardDiv.dataset.id = card.id;
            
            cardDiv.innerHTML = `
                <div class="carousel-card-image">
                    <img src="${card.image}" alt="${card.title}" loading="lazy">
                </div>
                <div class="carousel-card-content">
                    <h3 class="carousel-card-title">${card.title}</h3>
                    <p class="carousel-card-description">${card.description}</p>
                    <p class="carousel-card-postscription">${card.postscription}</p>
                </div>
            `;
            
            cardDiv.addEventListener('click', () => {
                openModal(card);
            });
            
            return cardDiv;
        }
        
        // Обновить количество видимых карточек
        updateVisibleCards() {
            if (window.innerWidth <= 768) {
                this.visibleCards = 1;
            } else if (window.innerWidth <= 1024) {
                this.visibleCards = 2;
            } else {
                this.visibleCards = 3;
            }
        }
        
        // Рендер карточек карусели
        renderCarouselCards() {
            if (!this.cardsContainer || this.cardData.length === 0) return;
            
            this.cardsContainer.innerHTML = '';
            
            // Отображаем карточки
            const cardsToShow = Math.min(this.visibleCards, this.cardData.length);
            for (let i = 0; i < cardsToShow; i++) {
                const index = (this.currentIndex + i) % this.cardData.length;
                const cardElement = this.createCarouselCard(this.cardData[index]);
                this.cardsContainer.appendChild(cardElement);
            }
        }
        
        // Прокрутка карусели
        scrollCarousel(direction) {
            if (this.layoutMode !== 'carousel') return;
            
            this.currentIndex += direction;
            
            // Циклическая прокрутка
            if (this.currentIndex < 0) {
                this.currentIndex = this.cardData.length - this.visibleCards;
            } else if (this.currentIndex >= this.cardData.length) {
                this.currentIndex = 0;
            }
            
            this.renderCarouselCards();
        }
        
        // Настройка свайпа
        setupSwipe() {
            if (!this.cardsContainer || this.layoutMode !== 'carousel') return;
            
            let startX = 0;
            let endX = 0;
            const swipeThreshold = 50;
            
            this.cardsContainer.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });
            
            this.cardsContainer.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        this.scrollCarousel(1);
                    } else {
                        this.scrollCarousel(-1);
                    }
                }
            });
        }
        
        // Обновить layout при ресайзе
        updateLayout() {
            if (this.layoutMode === 'grid') {
                // При ресайзе обновляем адаптивность сетки
                this.updateGridResponsive();
            } else if (this.layoutMode === 'carousel') {
                this.updateVisibleCards();
                this.renderCarouselCards();
            }
        }
        
        // Обновить адаптивность сетки
        updateGridResponsive() {
            // Классы CSS сами адаптируются под размер экрана
            // Здесь можно добавить дополнительную логику если нужно
        }
    }

    // Создаем менеджеры для всех разделов
    const architectureManager = new UniversalCardsManager({
        sectionClass: '.architecture',
        jsonFile: 'architecture.json',
        titleClass: '.archit-title'
    });
    
    const designManager = new UniversalCardsManager({
        sectionClass: '.design',
        jsonFile: 'design.json',
        titleClass: '.design-title'
    });
    
    const iiManager = new UniversalCardsManager({
        sectionClass: '.II',
        jsonFile: 'II.json',
        titleClass: '.II-title',
        descriptionClass: '.II-description'
    });
    
    // Инициализируем все разделы
    await Promise.all([
        architectureManager.init(),
        designManager.init(),
        iiManager.init()
    ]);
    
    // Обработчик ресайза
    window.addEventListener('resize', () => {
        architectureManager.updateLayout();
        designManager.updateLayout();
        iiManager.updateLayout();
    });
    
    // Функция для открытия модального окна
    function openModal(cardData) {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalContent = document.getElementById('modalContent');
        
        const images = cardData.images || [cardData.image];
        
        const galleryHTML = images.map((img, index) => `
            <div class="modal-gallery-item ${index === 0 ? 'active' : ''}">
                <img src="${img}" alt="${cardData.title} - фото ${index + 1}" loading="lazy">
            </div>
        `).join('');
        
        const galleryNavHTML = images.length > 1 ? `
            <div class="modal-gallery-nav">
                ${images.map((_, index) => `
                    <button class="gallery-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
                `).join('')}
            </div>
            <button class="gallery-prev">‹</button>
            <button class="gallery-next">›</button>
        ` : '';
        
        modalContent.innerHTML = `
            <div class="modal-gallery-container">
                <div class="modal-gallery">
                    ${galleryHTML}
                </div>
                ${galleryNavHTML}
            </div>
            <div class="modal-text">
                <h2 class="modal-title">${cardData.title}</h2>
                <div class="modal-description">
                    ${cardData.detailedDescription || cardData.description}
                    ${cardData.detailedDescription ? `<p><strong>Краткое описание:</strong> ${cardData.description}</p>` : ''}
                </div>
                <div class="modal-details">
                    <p>${cardData.postscription}</p>
                </div>
            </div>
        `;
        
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (images.length > 1) {
            initGallery();
        }
    }
    
    // Функция для управления галереей
    function initGallery() {
        const galleryItems = document.querySelectorAll('.modal-gallery-item');
        const dots = document.querySelectorAll('.gallery-dot');
        const prevBtn = document.querySelector('.gallery-prev');
        const nextBtn = document.querySelector('.gallery-next');
        let currentIndex = 0;
        
        function showImage(index) {
            galleryItems.forEach(item => item.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            galleryItems[index].classList.add('active');
            dots[index].classList.add('active');
            currentIndex = index;
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showImage(index));
        });
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = galleryItems.length - 1;
                showImage(newIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let newIndex = currentIndex + 1;
                if (newIndex >= galleryItems.length) newIndex = 0;
                showImage(newIndex);
            });
        }
        
        document.addEventListener('keydown', function(e) {
            if (!document.querySelector('.modal-overlay.active')) return;
            
            if (e.key === 'ArrowLeft') {
                let newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = galleryItems.length - 1;
                showImage(newIndex);
            } else if (e.key === 'ArrowRight') {
                let newIndex = currentIndex + 1;
                if (newIndex >= galleryItems.length) newIndex = 0;
                showImage(newIndex);
            }
        });
    }
    
    // Инициализация модальных окон
    function initModals() {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', function(e) {
                if (e.target === modalOverlay) {
                    closeModal();
                }
            });
        }
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }
    
    function closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    initModals();
});