const arrow = document.querySelector('.arrow-back');
const videoBlock = document.querySelector('#video');

function checkVisibility() {
    const videoRect = videoBlock.getBoundingClientRect();
    
    const isVideoOutOfView = videoRect.bottom <=  window.innerHeight * 0.35;
    
    arrow.classList.toggle('active', isVideoOutOfView);
}

window.addEventListener('scroll', checkVisibility);
window.addEventListener('resize', checkVisibility);

// Плавный скролл к элементу
function smoothScrollTo(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Обработчик для стрелки вниз
document.getElementById('arrowDown').addEventListener('click', function(e) {
    e.preventDefault();
    smoothScrollTo('features');
});

// Обработчик для стрелки назад (если нужно)
document.querySelector('.arrow-back').addEventListener('click', function(e) {
    e.preventDefault();
    smoothScrollTo('video');
});