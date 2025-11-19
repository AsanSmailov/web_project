const arrow = document.querySelector('.arrow-back');
const topLine = document.querySelector('.top-line');
const homeBlock = document.querySelector('#home');

function checkVisibility() {
    const homeRect = homeBlock.getBoundingClientRect();
    
    const isHomeOutOfView = homeRect.bottom <=  window.innerHeight * 0.35;
    
    arrow.classList.toggle('active', isHomeOutOfView);
    topLine.classList.toggle('active', isHomeOutOfView);
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
    smoothScrollTo('main');
});

// Обработчик для стрелки назад (если нужно)
document.querySelector('.arrow-back').addEventListener('click', function(e) {
    e.preventDefault();
    smoothScrollTo('home');
});


const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const body = document.querySelector('body');

menuToggle.addEventListener('click', function() {
  this.classList.toggle('active');
  
  if (menu) {
    menu.classList.toggle('show');
    body.classList.toggle('stopScroll');
  }
});

function closeMenu(){
    menuToggle.classList.remove('active');
    menu.classList.remove('show');
    body.classList.remove('stopScroll');
}

document.getElementById('menu-main').addEventListener('click', function(e) {
    closeMenu();
    e.preventDefault();
    smoothScrollTo('home');
});

document.getElementById('menu-about-us').addEventListener('click', function(e) {
    closeMenu();
    e.preventDefault();
    smoothScrollTo('main');
});

document.getElementById('menu-contacts').addEventListener('click', function(e) {
    closeMenu();
    e.preventDefault();
    smoothScrollTo('footer');
});



document.getElementById('menu-about-us-pc').addEventListener('click', function(e) {
    e.preventDefault();
    smoothScrollTo('main');
});