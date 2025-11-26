document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    // Данные для карточек
    const cardData = [
        {
            id: 1,
            image: 'https://picsum.photos/400/300?random=1',
            title: 'Горный пейзаж',
            description: 'Величественные горные вершины, покрытые снегом, на фоне голубого неба.'
        },
        {
            id: 2,
            image: 'https://picsum.photos/400/300?random=2',
            title: 'Морское побережье',
            description: 'Чистый песчаный пляж и лазурные воды океана под лучами заходящего солнца.'
        },
        {
            id: 3,
            image: 'https://picsum.photos/400/300?random=3',
            title: 'Лесная тропа',
            description: 'Тенистая тропа, ведущая через густой зеленый лес с высокими деревьями.'
        },
        {
            id: 4,
            image: 'https://picsum.photos/400/300?random=4',
            title: 'Городские огни',
            description: 'Ночной город с его яркими огнями и динамичной атмосферой.'
        },
        {
            id: 5,
            image: 'https://picsum.photos/400/300?random=5',
            title: 'Осенний парк',
            description: 'Живописный осенний парк с золотистыми и багряными листьями деревьев.'
        },
        {
            id: 6,
            image: 'https://picsum.photos/400/300?random=6',
            title: 'Зимняя сказка',
            description: 'Замерзшее озеро и деревья, покрытые инеем, в морозный зимний день.'
        },
        {
            id: 7,
            image: 'https://picsum.photos/400/300?random=7',
            title: 'Пустынный пейзаж',
            description: 'Бескрайние песчаные дюны под палящим солнцем пустыни.'
        },
        {
            id: 8,
            image: 'https://picsum.photos/400/300?random=8',
            title: 'Водопад',
            description: 'Мощный водопад, низвергающийся с высокой скалы в кристально чистое озеро.'
        },
        {
            id: 9,
            image: 'https://picsum.photos/400/300?random=9',
            title: 'Цветущий сад',
            description: 'Яркие цветы и зеленые растения в ухоженном саду весенним утром.'
        },
        {
            id: 10,
            image: 'https://picsum.photos/400/300?random=10',
            title: 'Архитектура',
            description: 'Великолепное историческое здание с уникальной архитектурой и деталями.'
        },
        {
            id: 11,
            image: 'https://picsum.photos/400/300?random=11',
            title: 'Деревенский пейзаж',
            description: 'Уютный деревенский домик с садом и живописными окрестностями.'
        },
        {
            id: 12,
            image: 'https://picsum.photos/400/300?random=12',
            title: 'Звездное небо',
            description: 'Яркие звезды и млечный путь в чистом ночном небе над горами.'
        }
    ];
    
    let currentIndex = 0;
    let visibleCards = 4;
    let totalCards = cardData.length;
    
    // Функция для получения циклического индекса
    function getCircularIndex(index) {
        return (index + totalCards) % totalCards;
    }
    
    // Функция для создания карточки
    function createCard(card, isPartial = false) {
        const partialClass = isPartial ? ' partial' : '';
        return `
            <div class="card${partialClass}" data-id="${card.id}">
                <div class="image-container">
                    <img src="${card.image}" alt="${card.title}">
                </div>
                <div class="description">
                    <h3>${card.title}</h3>
                    <p>${card.description}</p>
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
            const isPartial = i === count - 1; // Последняя карточка частичная
            carousel.innerHTML += createCard(cardData[circularIndex], isPartial);
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
    
    // Адаптация количества видимых карточек в зависимости от размера экрана
    function updateVisibleCards() {
        if (window.innerWidth <= 576) {
            visibleCards = 3; // 1 полная + 2 частичные
        } else if (window.innerWidth <= 768) {
            visibleCards = 3; // 1 полная + 2 частичные
        } else if (window.innerWidth <= 992) {
            visibleCards = 3; // 1 полная + 2 частичные
        } else {
            visibleCards = 4; // 2 полные + 2 частичные
        }
        renderCards(currentIndex, visibleCards);
    }

    function applyCardStyles() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            if (window.innerWidth <= 576) {
                card.style.flex = '0 0 calc(70% - 10px)';
            } else if (window.innerWidth <= 992) {
                card.style.flex = '0 0 calc(50% - 14px)';
            } else {
                card.style.flex = '0 0 calc(29% - 15px)';
            }
        });
    }

    function updateButtons() {
        // Для циклического каруселя кнопки всегда видны
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        
        // Можно добавить визуальную индикацию, что достигнут конец/начало
        // но для бесконечного цикла это не обязательно
    }

    // Инициализация
    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    
    // Добавляем обработчики для свайпа (опционально)
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