export default (shouldScroll) => {
   document.documentElement.className = shouldScroll ? '' : 'noScroll';
}