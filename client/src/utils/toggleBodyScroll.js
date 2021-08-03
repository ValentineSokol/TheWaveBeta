export default () => {
   document.documentElement.className = document.documentElement.classList.contains('noScroll') ? '' : 'noScroll';
}