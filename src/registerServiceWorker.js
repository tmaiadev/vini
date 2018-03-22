if ('serviceWorker' in navigator) {

  navigator.serviceWorker
      .register('./sw.js', { scope: './' })
      .then(registration => {
          console.log('Service Worker is registered');
      })
      .catch(e => {
          console.log('error', e);
      });
}

