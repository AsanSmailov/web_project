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
function goto(e, str) {
    closeMenu();
    e.preventDefault();
    smoothScrollTo(str);
}

document.getElementById('logo').addEventListener('click', function(e) {
    goto(e, 'home');
});

document.getElementById('menu-main').addEventListener('click', function(e) {
    goto(e, 'home');
});

document.getElementById('menu-policy').addEventListener('click', function(e) {
    goto(e, 'policy');
});

document.getElementById('menu-policy-pc').addEventListener('click', function(e) {
    goto(e, 'policy');
});

document.getElementById('architecture-pc').addEventListener('click', function(e) {
    goto(e, 'main');
});

document.getElementById('architecture').addEventListener('click', function(e) {
    goto(e, 'main');
});

document.getElementById('design-pc').addEventListener('click', function(e) {
    goto(e, 'design-section');
});

document.getElementById('design').addEventListener('click', function(e) {
    goto(e, 'design-section');
});

document.getElementById('menu-contacts').addEventListener('click', function(e) {
    goto(e, 'footer');
});



