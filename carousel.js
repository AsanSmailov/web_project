document.addEventListener('DOMContentLoaded', function() {
            const carousel = document.querySelector('.carousel');
            const card= document.querySelector('.card');
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
            
            // Функция для создания карточки
            function createCard(card) {
                return `
                    <div class="card" data-id="${card.id}">
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
            
            // Функция для отображения карточек
            function renderCards(startIndex, count) {
                carousel.innerHTML = '';
                const endIndex = Math.min(startIndex + count, totalCards);
                
                for (let i = startIndex; i < endIndex; i++) {
                    carousel.innerHTML += createCard(cardData[i]);
                }
                
                updateButtons();
                applyCardStyles();
            }
            
            // Обработчики событий
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    renderCards(currentIndex, visibleCards);
                }
            });
            
            nextBtn.addEventListener('click', () => {
                if ((currentIndex + visibleCards) < totalCards) {
                    currentIndex++;
                    renderCards(currentIndex , visibleCards);
                }
            });
            
            
            // Адаптация количества видимых карточек в зависимости от размера экрана
            function updateVisibleCards() {
                if (window.innerWidth <= 576) {
                    visibleCards = 2;
                } else if (window.innerWidth <= 768) {
                    visibleCards = 2;
                } else if (window.innerWidth <= 992) {
                    visibleCards = 2;
                } else {
                    visibleCards = 3;
                }
                renderCards(currentIndex * visibleCards, visibleCards);
            }

            function applyCardStyles() {
                const cards = document.querySelectorAll('.card');
                cards.forEach(card => {
                     if (window.innerWidth <= 992) {
                        card.style.flex = '0 0 calc(50% - 15px)';
                    } else {
                        card.style.flex = ''; // Сбрасываем стиль для больших экранов
                    }
                });
            }

            function updateButtons(){
                if(currentIndex == 0){
                    prevBtn.style.display = 'none';
                }else{
                    prevBtn.style.display = '';
                }

                if(currentIndex == (cardData.length - visibleCards)){
                    nextBtn.style.display = 'none';
                }else{
                    nextBtn.style.display = '';
                }
            }

            // Инициализация
            updateVisibleCards();
            window.addEventListener('resize', updateVisibleCards);
        });