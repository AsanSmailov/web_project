document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    // Данные для карточек
    const cardData = [
        {
            id: 1,
            image: 'assets/architecture/Дом Frame.jpg',
            title: 'Дом Frame',
            description: 'Этот дом рожден на границе уже заложенных рамок — фундамент существовал раньше, и именно он стал точкой отсчёта для новой архитектурной истории. Превращая ограничение в возможность, мы построили дом, который раскрывается в несколько уровней, словно разворачивающийся пейзаж.',
            postscription: 'архитектура | частный дом | 2024'
        },
        {
            id: 2,
            image: 'assets/architecture/Casa terra.jpg',
            title: 'Casa terra',
            description: 'Этот дом задуман как тихое семейное убежище, куда можно вернуться после городской суеты, чтобы снова почувствовать тепло, спокойствие. Внутреннее пространство раскрывается плавно, как неторопливый сюжет: гостиная и кухня сливаются в светлую общую зону, где семейные вечера становятся главной традицией, а утренний воздух делает каждый день новым.',
            postscription: 'архитектура | частный дом | 2024'
        },
        {
            id: 3,
            image: 'assets/main-bg.jpg',
            title: 'Лесная тропа',
            description: 'Тенистая тропа, ведущая через густой зеленый лес с высокими деревьями.',
            postscription: 'архитектура | частный дом | 2024'
        },
        {
            id: 4,
            image: 'assets/main-bg.jpg',
            title: 'Городские огни',
            description: 'Ночной город с его яркими огнями и динамичной атмосферой.',
            postscription: 'архитектура | частный дом | 2024'
        },
        {
            id: 5,
            image: 'https://picsum.photos/400/300?random=5',
            title: 'Осенний парк',
            description: 'Живописный осенний парк с золотистыми и багряными листьями деревьев.',
            postscription: 'архитектура | частный дом | 2024'
        },
        {
            id: 6,
            image: 'https://picsum.photos/400/300?random=6',
            title: 'Зимняя сказка',
            description: 'Замерзшее озеро и деревья, покрытые инеем, в морозный зимний день.',
            postscription: 'архитектура | частный дом | 2024'
        },
        {
            id: 7,
            image: 'https://picsum.photos/400/300?random=7',
            title: 'Пустынный пейзаж',
            description: 'Бескрайние песчаные дюны под палящим солнцем пустыни.',
            postscription: 'архитектура | частный дом | 2024'
        },
        {
            id: 8,
            image: 'https://picsum.photos/400/300?random=8',
            title: 'Водопад',
            description: 'Мощный водопад, низвергающийся с высокой скалы в кристально чистое озеро.',
            postscription: 'архитектура | частный дом | 2024'
        },
        {
            id: 9,
            image: 'https://picsum.photos/400/300?random=9',
            title: 'Цветущий сад',
            description: 'Яркие цветы и зеленые растения в ухоженном саду весенним утром.',
            postscription: 'архитектура | частный дом | 2024'
        },
        {
            id: 10,
            image: 'https://picsum.photos/400/300?random=10',
            title: 'Архитектура',
            description: 'Великолепное историческое здание с уникальной архитектурой и деталями.',
            postscription: 'архитектура | частный дом | 2024'
        },
        {
            id: 11,
            image: 'https://picsum.photos/400/300?random=11',
            title: 'Деревенский пейзаж',
            description: 'Уютный деревенский домик с садом и живописными окрестностями.',
            postscription: 'архитектура | частный дом | 2024'
        },
        {
            id: 12,
            image: 'https://picsum.photos/400/300?random=12',
            title: 'Звездное небо',
            description: 'Яркие звезды и млечный путь в чистом ночном небе над горами.',
            postscription: 'архитектура | частный дом | 2024'
        }
    ];
    
    let currentIndex = 0;
    let visibleCards = 3;
    let totalCards = cardData.length;
    
    // Функция для получения циклического индекса
    function getCircularIndex(index) {
        return (index + totalCards) % totalCards;
    }
    
    // Функция для создания карточки (убраны все упоминания partial)
    function createCard(card) {
        return `
            <div class="card" data-id="${card.id}">
                <div class="image-container">
                    <img src="${card.image}" alt="${card.title}">
                </div>
                <div class="description">
                    <h3>${card.title}</h3>
                    <p>${card.description}</p>
                    <p>${card.postscription}</p>
                </div>
            </div>
        `;
    }
    
    // Функция для отображения карточек с циклическим эффектом
    function renderCards(startIndex, count) {
        carousel.innerHTML = '';
        
        // Отображаем карточки в циклическом порядке
        for (let i = 0; i < count; i++) {
            const circularIndex = getCircularIndex(startIndex + i);
            carousel.innerHTML += createCard(cardData[circularIndex]);
        }
        
        updateButtons();
        applyCardStyles();
    }
    
    // Обработчики событий с циклической навигацией
    prevBtn.addEventListener('click', () => {
        currentIndex = getCircularIndex(currentIndex - 1);
        renderCards(currentIndex, visibleCards);
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = getCircularIndex(currentIndex + 1);
        renderCards(currentIndex, visibleCards);
    });

    function updateVisibleCards() {
        if (window.innerWidth <= 768) {
            visibleCards = 2; 
        } else {
            visibleCards = 3; 
        }
        renderCards(currentIndex, visibleCards);
    }

    function applyCardStyles() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            if (window.innerWidth <= 768) {
                card.style.flex = '0 0 calc(50% - 14px)';
            } else {
                card.style.flex = '0 0 calc(33% - 15px)';
            }
        });
    }

    function updateButtons() {
        // Для циклического каруселя кнопки всегда видны
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    }

    // Инициализация
    renderCards(currentIndex, visibleCards);
    
    // Обработчик ресайза
    window.addEventListener('resize', () => {
        updateVisibleCards();
    });
    
    // Добавляем обработчики для свайпа
    let startX = 0;
    let endX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Свайп влево - следующая карточка
                currentIndex = getCircularIndex(currentIndex + 1);
            } else {
                // Свайп вправо - предыдущая карточка
                currentIndex = getCircularIndex(currentIndex - 1);
            }
            renderCards(currentIndex, visibleCards);
        }
    }
});