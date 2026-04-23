// Salvar UTMs no sessionStorage assim que entrar no site
(function() {
  var params = new URLSearchParams(window.location.search);
  var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'src', 'sck', 'xcod', 'fbclid', 'gclid'];
  var utmData = {};
  var hasUtm = false;
  
  utmKeys.forEach(function(key) {
    var val = params.get(key);
    if (val) {
      utmData[key] = val;
      hasUtm = true;
    }
  });
  
  // Se tem UTM na URL, salva no sessionStorage
  if (hasUtm) {
    sessionStorage.setItem('saved_utms', JSON.stringify(utmData));
    console.log('UTMs salvos:', utmData);
  }
})();

// Função para redirecionar com UTMs
window.redirectWithUtms = function(baseUrl) {
  var utmParams = [];
  
  // Primeiro tenta pegar da URL atual
  var currentParams = new URLSearchParams(window.location.search);
  var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'src', 'sck', 'xcod', 'fbclid', 'gclid'];
  
  utmKeys.forEach(function(key) {
    var val = currentParams.get(key);
    if (val) {
      utmParams.push(key + '=' + encodeURIComponent(val));
    }
  });
  
  // Se não achou na URL, pega do sessionStorage
  if (utmParams.length === 0) {
    try {
      var saved = sessionStorage.getItem('saved_utms');
      if (saved) {
        var data = JSON.parse(saved);
        Object.keys(data).forEach(function(key) {
          if (data[key]) {
            utmParams.push(key + '=' + encodeURIComponent(data[key]));
          }
        });
        console.log('UTMs recuperados do storage:', data);
      }
    } catch(e) {
      console.log('Erro ao ler UTMs:', e);
    }
  }
  
  // Montar URL final
  var finalUrl = baseUrl;
  if (utmParams.length > 0) {
    finalUrl += (baseUrl.indexOf('?') > -1 ? '&' : '?') + utmParams.join('&');
  }
  
  console.log('Redirecionando para:', finalUrl);
  window.location.href = finalUrl;
};
