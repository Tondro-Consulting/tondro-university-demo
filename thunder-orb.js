/* Thunder chat launcher. Hides Salesforce's default chat button and shows the live orb
   (thunder-orb.css) instead. The orb only appears once the chat service reports it is
   ready, so a page whose chat fails to load never shows a dead button. */
(function () {
  var orb = document.createElement('button');
  orb.type = 'button';
  orb.className = 'thunder-orb';
  orb.hidden = true;
  orb.setAttribute('aria-label', 'Chat with Thunder, the Tondro University assistant');
  orb.innerHTML =
    '<svg class="thunder-orb-defs" aria-hidden="true" focusable="false"><filter id="thunder-orb-goo">' +
    '<feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>' +
    '<feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"/></filter></svg>' +
    '<span class="thunder-orb-aura" aria-hidden="true"></span>' +
    '<span class="thunder-orb-goo" aria-hidden="true">' +
    '<span class="thunder-orb-drop d1"></span><span class="thunder-orb-drop d2"></span>' +
    '<span class="thunder-orb-core"></span></span>' +
    '<span class="thunder-orb-shine" aria-hidden="true"></span>' +
    '<span class="thunder-orb-label" aria-hidden="true">Ask Thunder</span>';

  function util() {
    return window.embeddedservice_bootstrap && window.embeddedservice_bootstrap.utilAPI;
  }

  function showOrb() {
    var api = util();
    if (api) api.hideChatButton();
    orb.hidden = false;
  }

  function hideOrb() {
    orb.hidden = true;
  }

  orb.addEventListener('click', function () {
    var api = util();
    if (!api) return;
    hideOrb();
    api.launchChat().catch(function (err) {
      console.error('Thunder chat did not open: ', err);
      showOrb();
    });
  });

  function mount() {
    document.body.appendChild(orb);
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  window.addEventListener('onEmbeddedMessagingReady', function () {
    showOrb();
    // Say hello once per visit so people notice it's there.
    if (!sessionStorage.getItem('thunderOrbGreeted')) {
      sessionStorage.setItem('thunderOrbGreeted', '1');
      orb.classList.add('is-greeting');
      setTimeout(function () { orb.classList.remove('is-greeting'); }, 4000);
    }
  });
  window.addEventListener('onEmbeddedMessagingWindowMaximized', hideOrb);
  window.addEventListener('onEmbeddedMessagingWindowMinimized', showOrb);
})();
