// Intercepta erros de carregamento de chunks e recarrega a página
window.addEventListener('error', function(e) {
  if (e.message && (e.message.includes('Loading chunk') || e.message.includes('ChunkLoadError') || e.message.includes('Failed to fetch'))) {
    window.location.reload();
  }
}, true);

window.addEventListener('unhandledrejection', function(e) {
  if (e.reason && e.reason.message && (e.reason.message.includes('Loading chunk') || e.reason.message.includes('ChunkLoadError'))) {
    window.location.reload();
  }
}, true);
