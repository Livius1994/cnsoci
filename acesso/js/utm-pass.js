// Pegar UTMs da URL atual
function getUtmParams() {
  var params = new URLSearchParams(window.location.search);
  var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'src', 'sck', 'xcod', 'fbclid', 'gclid'];
  var utmParams = [];
  
  utmKeys.forEach(function(key) {
    var val = params.get(key);
    if (val) {
      utmParams.push(key + '=' + encodeURIComponent(val));
    }
  });
  
  return utmParams.join('&');
}

// Adicionar UTMs em uma URL
function addUtmsToUrl(url) {
  var utms = getUtmParams();
  if (!utms) return url;
  return url + (url.indexOf('?') > -1 ? '&' : '?') + utms;
}

// Interceptar todos os clicks em links internos
document.addEventListener('click', function(e) {
  var link = e.target.closest('a');
  if (link && link.href) {
    var url = new URL(link.href, window.location.origin);
    // Se é link interno (mesmo domínio ou relativo)
    if (url.origin === window.location.origin || link.href.startsWith('/') || link.href.startsWith('.')) {
      var utms = getUtmParams();
      if (utms) {
        e.preventDefault();
        window.location.href = addUtmsToUrl(link.href);
      }
    }
  }
}, true);

// Interceptar window.location.href 
var originalHref = Object.getOwnPropertyDescriptor(window.location.__proto__, 'href');
if (originalHref && originalHref.set) {
  Object.defineProperty(window.location, 'href', {
    set: function(url) {
      var finalUrl = addUtmsToUrl(url);
      originalHref.set.call(window.location, finalUrl);
    },
    get: originalHref.get
  });
}

// Função global para redirect com UTMs (backup)
window.redirectWithUtms = function(url) {
  window.location.href = addUtmsToUrl(url);
};

console.log('UTM Pass carregado. UTMs:', getUtmParams());
