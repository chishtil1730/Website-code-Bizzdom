const headerEl = document.querySelector('.header');
const BizzdomEl = document.querySelector('.logo');
const menuEl = document.querySelector('.menu');
const signInEl = document.querySelector('.btn-signing');
window.addEventListener('scroll', ()=>{
    if(window.scrollY > 50){
        headerEl.classList.add('header-scrolled');
        BizzdomEl.classList.add('logo-scrolled');
        menuEl.classList.add('menu-scrolled');
        signInEl.classList.add('btn-signing-scrolled');
    }else {
        headerEl.classList.remove('header-scrolled');
        BizzdomEl.classList.remove('logo-scrolled');
        menuEl.classList.remove('menu-scrolled');
        signInEl.classList.remove('btn-signing-scrolled');
    }
});