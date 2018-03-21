Array.from(document.querySelectorAll('*[lazy-src]'))
.forEach(async img => {
    const src = img.getAttribute('lazy-src');
    await fetch(src);
    img.src = src;
});