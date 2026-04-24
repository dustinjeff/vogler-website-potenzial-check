/**
 * Vogler Marketing — Website-Potenzial-Check (Iframe Embed)
 * Nutzt iframe statt Shadow DOM, weil der PDF-Export window.open() benötigt.
 *
 * Einbettung auf Webflow:
 *   <div id="vm-website-potenzial-check"></div>
 *   <script src="https://dustinjeff.github.io/vogler-website-potenzial-check/embed.js"></script>
 */
(function() {
  'use strict';

  var mount = document.getElementById('vm-website-potenzial-check');
  if (!mount) return;

  var iframe = document.createElement('iframe');
  iframe.src = 'https://dustinjeff.github.io/vogler-website-potenzial-check/';
  iframe.style.cssText = 'width:100%;border:none;min-height:800px;';
  iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute('title', 'Website-Potenzial-Check');
  mount.appendChild(iframe);

  // Auto-resize
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'website-potenzial-check-height') {
      iframe.style.height = (e.data.height + 32) + 'px';
    }
    // Tracking bridge: forward to dataLayer
    if (e.data && e.data.type === 'vogler-tracking') {
      window.dataLayer = window.dataLayer || [];
      var d = {event: e.data.event, rechner_name: 'website-potenzial-check'};
      var params = e.data.params || {};
      for (var k in params) {
        if (params.hasOwnProperty(k)) d['rechner_' + k] = params[k];
      }
      window.dataLayer.push(d);
    }
  });
})();
