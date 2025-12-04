document.addEventListener('DOMContentLoaded', async function() {
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
    function createCard(card) {
        return `
            <div class="card" data-id="${card.id}">
                <div class="image-container">
                    <img src="${card.image}" alt="${card.title}" loading="lazy">
                </div>
                <div class="description">
                    <h3>${card.title}</h3>
                    <p>${card.description}</p>
                    <p class="postscription">${card.postscription}</p>
                </div>
            </div>
        `;
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
                this.carousel.innerHTML += createCard(this.cardData[circularIndex]);
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
});