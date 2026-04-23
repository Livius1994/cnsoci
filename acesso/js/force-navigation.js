// Força navegação tradicional ao invés de SPA do Next.js
(function() {
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a');
    if (link && link.href && link.href.startsWith(window.location.origin)) {
      // É um link interno - força navegação tradicional
      e.preventDefault();
      e.stopPropagation();
      window.location.href = link.href;
    }
  }, true); // capture phase para pegar antes do Next.js
})();
