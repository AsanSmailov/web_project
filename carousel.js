

document.addEventListener('DOMContentLoaded', async function() {

    // Функция для загрузки и отображения карточек ИИ
    async function loadIICards() {
        try {
            const response = await fetch('II.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const cardsData = await response.json();
            const cardsContainer = document.querySelector('.II .cards');
            
            if (!cardsContainer) {
                console.warn('Контейнер для карточек ИИ не найден');
                return;
            }
            
            // Очищаем контейнер
            cardsContainer.innerHTML = '';
            
            // Создаем сетку для карточек
            const gridContainer = document.createElement('div');
            gridContainer.className = 'II-cards';
            
            // Создаем и добавляем карточки
            cardsData.forEach(card => {
                const cardElement = createIICard(card);
                gridContainer.appendChild(cardElement);
            });
            
            cardsContainer.appendChild(gridContainer);
            
        } catch (error) {
            console.error('Ошибка загрузки данных ИИ:', error);
            const cardsContainer = document.querySelector('.II .cards');
            if (cardsContainer) {
                cardsContainer.innerHTML = '<p>Не удалось загрузить концепции ИИ</p>';
            }
        }
    }

    // Функция для создания карточки ИИ
    function createIICard(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'II-card';
        cardDiv.dataset.id = card.id;
        
        cardDiv.innerHTML = `
            <div class="II-card-image">
                <img src="${card.image}" alt="${card.title}" loading="lazy">
            </div>
            <div class="II-card-content">
                <h3 class="II-card-title">${card.title}</h3>
                <p class="II-card-description">${card.description}</p>
                <p class="II-card-postscription">${card.postscription}</p>
            </div>
        `;
        
        // Добавляем обработчик клика для открытия модального окна
        cardDiv.addEventListener('click', function() {
            openModal(card);
        });
        
        return cardDiv;
    }

    loadIICards();

    // Загрузка данных из JSON
    async function loadCards(jsonFile) {
        try {
            const response = await fetch(jsonFile);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Ошибка загрузки данных из ${jsonFile}:`, error);
            return [];
        }
    }
    
    // Функция для создания карточки
    function createCard(card, sectionClass) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.id = card.id;
        cardDiv.dataset.section = sectionClass; // Добавляем информацию о секции
        
        cardDiv.innerHTML = `
            <div class="image-container">
                <img src="${card.image}" alt="${card.title}" loading="lazy">
            </div>
            <div class="description">
                <h3>${card.title}</h3>
                <p>${card.description}</p>
                <p class="postscription">${card.postscription}</p>
            </div>
        `;
        
        // Добавляем обработчик клика
        cardDiv.addEventListener('click', function() {
            openModal(card);
        });
        
        return cardDiv;
    }
    
    // Класс для управления каруселью
    class CarouselManager {
        constructor(sectionClass, jsonFile) {
            this.sectionClass = sectionClass;
            this.jsonFile = jsonFile;
            this.cardData = [];
            this.currentIndex = 0;
            this.visibleCards = 3;
            this.carousel = null;
            this.prevBtn = null;
            this.nextBtn = null;
        }

        
        // Инициализация карусели
        async init() {
            const section = document.querySelector(this.sectionClass);
            if (!section) {
                console.warn(`Секция ${this.sectionClass} не найдена`);
                return;
            }
            
            this.carousel = section.querySelector('.carousel');
            this.prevBtn = section.querySelector('.prev');
            this.nextBtn = section.querySelector('.next');
            
            if (!this.carousel) {
                console.warn('Карусель не найдена в секции', this.sectionClass);
                return;
            }
            
            // Загружаем данные
            this.cardData = await loadCards(this.jsonFile);
            
            if (this.cardData.length > 0) {
                this.initCarousel();
            } else {
                this.carousel.innerHTML = '<p>Нет данных для отображения</p>';
            }
        }
        
        // Получение циклического индекса
        getCircularIndex(index) {
            if (this.cardData.length === 0) return 0;
            return (index + this.cardData.length) % this.cardData.length;
        }
        
        // Отображение карточек с циклическим эффектом
        renderCards(startIndex, count) {
            if (!this.carousel || this.cardData.length === 0) {
                console.warn('Карусель не найдена или нет данных');
                return;
            }
            
            this.carousel.innerHTML = '';
            
            // Отображаем карточки в циклическом порядке
            for (let i = 0; i < count; i++) {
                const circularIndex = this.getCircularIndex(startIndex + i);
                const cardElement = createCard(this.cardData[circularIndex], this.sectionClass);
                this.carousel.appendChild(cardElement);
            }

            this.applyCardStyles();
        }
        
        updateVisibleCards() {
            if (window.innerWidth <= 768) {
                this.visibleCards = 1;
            } else if (window.innerWidth <= 1024) {
                this.visibleCards = 2;
            } else {
                this.visibleCards = 3;
            }
            
            this.renderCards(this.currentIndex, this.visibleCards);
        }
        
        applyCardStyles() {
            const cards = this.carousel.querySelectorAll('.card');
            cards.forEach(card => {
                if (window.innerWidth <= 768) {
                    card.style.flex = '0 0 95%';
                } else if (window.innerWidth <= 1024) {
                    card.style.flex = '0 0 calc(50% - 15px)';
                } else {
                    card.style.flex = '0 0 calc(33.333% - 15px)';
                }
            });
        }
        
        // Инициализация карусели после загрузки данных
        initCarousel() {
            this.updateVisibleCards();
            
            // Обработчики событий с циклической навигацией
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => {
                    this.currentIndex = this.getCircularIndex(this.currentIndex - 1);
                    this.renderCards(this.currentIndex, this.visibleCards);
                });
            }
            
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => {
                    this.currentIndex = this.getCircularIndex(this.currentIndex + 1);
                    this.renderCards(this.currentIndex, this.visibleCards);
                });
            }
            
            // Добавляем обработчики для свайпа
            this.setupSwipe();
        }
        
        setupSwipe() {
            if (!this.carousel) return;
            
            let startX = 0;
            let endX = 0;
            
            this.carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });
            
            this.carousel.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                this.handleSwipe(startX, endX);
            });
        }
        
        handleSwipe(startX, endX) {
            const swipeThreshold = 50;
            const diff = startX - endX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Свайп влево - следующая карточка
                    this.currentIndex = this.getCircularIndex(this.currentIndex + 1);
                } else {
                    // Свайп вправо - предыдущая карточка
                    this.currentIndex = this.getCircularIndex(this.currentIndex - 1);
                }
                this.renderCards(this.currentIndex, this.visibleCards);
            }
        }
    }
    
    // Создаем менеджеры для каждой карусели
    const architectureCarousel = new CarouselManager('.architecture', 'architecture.json');
    const designCarousel = new CarouselManager('.design', 'design.json'); 
    
    // Инициализируем обе карусели
    await Promise.all([
        architectureCarousel.init(),
        designCarousel.init()
    ]);
    
    // Обработчик ресайза для обеих каруселей
    window.addEventListener('resize', () => {
        architectureCarousel.updateVisibleCards();
        designCarousel.updateVisibleCards();
    });

    // Функция для открытия модального окна
    function openModal(cardData) {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalContent = document.getElementById('modalContent');
        
        // Получаем массив изображений (если есть) или используем одно изображение
        const images = cardData.images || [cardData.image];
        
        // Создаем галерею изображений
        const galleryHTML = images.map((img, index) => `
            <div class="modal-gallery-item ${index === 0 ? 'active' : ''}">
                <img src="${img}" alt="${cardData.title} - фото ${index + 1}" loading="lazy">
            </div>
        `).join('');
        
        // Создаем навигацию для галереи (если больше 1 фото)
        const galleryNavHTML = images.length > 1 ? `
            <div class="modal-gallery-nav">
                ${images.map((_, index) => `
                    <button class="gallery-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
                `).join('')}
            </div>
            <button class="gallery-prev">‹</button>
            <button class="gallery-next">›</button>
        ` : '';
        
        // Заполняем модальное окно данными
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
        
        // Показываем модальное окно
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Инициализируем галерею, если есть несколько изображений
        if (images.length > 1) {
            initGallery();
        }
    }

    // Функция для управления галереей в модальном окне
    function initGallery() {
        const galleryItems = document.querySelectorAll('.modal-gallery-item');
        const dots = document.querySelectorAll('.gallery-dot');
        const prevBtn = document.querySelector('.gallery-prev');
        const nextBtn = document.querySelector('.gallery-next');
        let currentIndex = 0;
        
        function showImage(index) {
            // Скрываем все изображения
            galleryItems.forEach(item => item.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Показываем выбранное изображение
            galleryItems[index].classList.add('active');
            dots[index].classList.add('active');
            currentIndex = index;
        }
        
        // Обработчики для точек
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showImage(index));
        });
        
        // Кнопка "предыдущее"
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = galleryItems.length - 1;
                showImage(newIndex);
            });
        }
        
        // Кнопка "следующее"
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let newIndex = currentIndex + 1;
                if (newIndex >= galleryItems.length) newIndex = 0;
                showImage(newIndex);
            });
        }
        
        // Добавляем поддержку клавиатуры
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

    // Функция для закрытия модального окна
    function closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Инициализация модальных окон
    function initModals() {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        
        // Закрытие по клику на крестик
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        
        // Закрытие по клику на оверлей
        if (modalOverlay) {
            modalOverlay.addEventListener('click', function(e) {
                if (e.target === modalOverlay) {
                    closeModal();
                }
            });
        }
        
        // Закрытие по клавише Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }
    initModals();
});