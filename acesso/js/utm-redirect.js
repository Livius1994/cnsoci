// Passar UTMs pro checkout
window.redirectWithUtms = function(baseUrl) {
  // Pegar todos os parâmetros da URL atual
  var currentParams = new URLSearchParams(window.location.search);
  var utmParams = [];
  
  // Lista de parâmetros UTM para passar
  var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'src', 'sck', 'xcod', 'fbclid', 'gclid'];
  
  utmKeys.forEach(function(key) {
    var val = currentParams.get(key);
    if (val) {
      utmParams.push(key + '=' + encodeURIComponent(val));
    }
  });
  
  // Tentar pegar do sessionStorage (onde UTMify geralmente salva)
  try {
    var keys = ['__utmify', 'utmify', 'utm_params', 'utms'];
    for (var i = 0; i < keys.length; i++) {
      var stored = sessionStorage.getItem(keys[i]) || localStorage.getItem(keys[i]);
      if (stored) {
        var data = JSON.parse(stored);
        if (data.utm_source && utmParams.indexOf('utm_source=' + data.utm_source) === -1) {
          utmParams.push('utm_source=' + encodeURIComponent(data.utm_source));
        }
        if (data.utm_medium && utmParams.indexOf('utm_medium=' + data.utm_medium) === -1) {
          utmParams.push('utm_medium=' + encodeURIComponent(data.utm_medium));
        }
        if (data.utm_campaign && utmParams.indexOf('utm_campaign=' + data.utm_campaign) === -1) {
          utmParams.push('utm_campaign=' + encodeURIComponent(data.utm_campaign));
        }
        if (data.utm_content && utmParams.indexOf('utm_content=' + data.utm_content) === -1) {
          utmParams.push('utm_content=' + encodeURIComponent(data.utm_content));
        }
        if (data.utm_term && utmParams.indexOf('utm_term=' + data.utm_term) === -1) {
          utmParams.push('utm_term=' + encodeURIComponent(data.utm_term));
        }
      }
    }
  } catch(e) {
    console.log('Erro ao ler UTMs salvos:', e);
  }
  
  // Montar URL final
  var finalUrl = baseUrl;
  if (utmParams.length > 0) {
    finalUrl += (baseUrl.indexOf('?') > -1 ? '&' : '?') + utmParams.join('&');
  }
  
  console.log('Redirecionando para:', finalUrl);
  window.location.href = finalUrl;
};
