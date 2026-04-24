/**
 * Vogler Marketing — Website-Potenzial-Check (Shadow DOM Embed)
 * Lädt sich selbst in einen Shadow DOM Container — komplett CSS-isoliert,
 * aber mit vollem Zugriff auf dataLayer, Cookies und Meta Pixel.
 *
 * Einbettung auf Webflow:
 *   <div id="vm-website-potenzial-check"></div>
 *   <script src="https://dustinjeff.github.io/vogler-website-potenzial-check/embed.js"></script>
 */
(function() {
  'use strict';

  var mount = document.getElementById('vm-website-potenzial-check');
  if (!mount) return;

  // --- Fonts (global, weil Shadow DOM font-face erbt) ---
  if (!document.querySelector('link[href*="Didact+Gothic"]')) {
    var fl = document.createElement('link');
    fl.rel = 'stylesheet';
    fl.href = 'https://fonts.googleapis.com/css2?family=Didact+Gothic&family=JetBrains+Mono:wght@400;600;700&display=swap';
    document.head.appendChild(fl);
  }

  // --- Shadow DOM ---
  var shadow = mount.attachShadow({mode: 'open'});

  // --- Tracking (direkt in dataLayer, kein postMessage) ---
  function trackEvent(eventName, params) {
    window.dataLayer = window.dataLayer || [];
    var d = {event: eventName, rechner_name: (params || {}).rechner || 'unknown'};
    for (var k in params) {
      if (params.hasOwnProperty(k)) d['rechner_' + k] = params[k];
    }
    window.dataLayer.push(d);
  }

  trackEvent('rechner_started', {rechner: 'website-potenzial-check'});

  // --- DOM Helpers ---
  function $(id) { return shadow.querySelector('#' + id); }
  function $$(sel) { return shadow.querySelectorAll(sel); }

  // ==========================================================================
  // CSS
  // ==========================================================================
  var CSS = '\
    :host {\
      display: block;\
      --bg: #0a0a0a; --bg-card: #141414; --bg-input: #1a1a1a;\
      --border: #2a2a2a; --border-focus: #4a4a4a; --page-bg: #f5f5f0;\
      --text: #e8e8e8; --text-muted: #888; --text-dim: #666;\
      --accent: #f4e75a; --accent-hover: #f7ed7a;\
      --green: #22c55e; --green-bg: rgba(34,197,94,0.1);\
      --yellow: #eab308; --yellow-bg: rgba(234,179,8,0.1);\
      --red: #ef4444; --red-bg: rgba(239,68,68,0.1);\
      --font: "Didact Gothic",-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;\
      --mono: "JetBrains Mono","SF Mono","Fira Code",monospace;\
    }\
    * { margin:0; padding:0; box-sizing:border-box; }\
    .vm-root { font-family:var(--font); color:var(--text); line-height:1.6; -webkit-font-smoothing:antialiased; }\
    .tool-box { background:var(--bg); border-radius:16px; padding:48px 56px; color:var(--text); box-shadow:0 8px 32px rgba(0,0,0,0.15); }\
    @media(max-width:600px){ .tool-box { padding:24px 18px; border-radius:12px; } }\
    header { padding:48px 0 32px; text-align:center; border-bottom:1px solid var(--border); }\
    header h1 { font-size:36px; font-weight:600; letter-spacing:-0.5px; margin-bottom:16px; }\
    header p { color:var(--text-muted); font-size:19px; max-width:600px; margin:0 auto; }\
    .field-group { margin-bottom:28px; }\
    .field-group label { display:block; font-size:18px; font-weight:500; margin-bottom:6px; }\
    .field-group .hint { display:block; font-size:15px; color:var(--text-dim); margin-bottom:12px; }\
    .input-field { width:100%; padding:14px 18px; background:var(--bg-input); border:1px solid var(--border); border-radius:6px; color:var(--text); font-family:var(--mono); font-size:18px; outline:none; transition:border-color 0.2s; }\
    .input-field:focus { border-color:var(--border-focus); }\
    .input-field::placeholder { color:var(--text-dim); }\
    select.input-field { cursor:pointer; -webkit-appearance:none; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%23888\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10z\'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; }\
    .btn { display:inline-flex; align-items:center; justify-content:center; padding:16px 36px; font-size:18px; font-weight:500; border:none; border-radius:6px; cursor:pointer; transition:all 0.2s; font-family:var(--font); text-decoration:none; }\
    .btn-primary { background:var(--accent); color:var(--bg); }\
    .btn-primary:hover { background:var(--accent-hover); }\
    .btn-secondary { background:transparent; color:var(--text-muted); border:1px solid var(--border); }\
    .btn-secondary:hover { border-color:var(--border-focus); color:var(--text); }\
    .btn-row { display:flex; gap:12px; margin-top:32px; justify-content:center; }\
    .divider { height:1px; background:var(--border); margin:32px 0; }\
    .section-label { font-size:14px; text-transform:uppercase; letter-spacing:1.5px; color:var(--text-dim); margin-bottom:20px; }\
    .hero-number { text-align:center; padding:48px 24px; margin:32px 0; background:var(--bg-card); border:1px solid var(--border); border-radius:12px; }\
    .hero-number .hero-pre { font-size:18px; color:var(--text-muted); margin-bottom:16px; }\
    .hero-number .hero-value { font-family:var(--mono); font-size:56px; font-weight:700; color:var(--accent); line-height:1.1; margin-bottom:16px; }\
    @media(max-width:600px){ .hero-number .hero-value { font-size:40px; } }\
    .hero-number .hero-post { font-size:18px; color:var(--text-muted); max-width:520px; margin:0 auto; }\
    .verdict-box { border-radius:12px; padding:28px 24px; margin:24px 0; text-align:center; }\
    .verdict-box.green { background:var(--green-bg); border:1px solid rgba(34,197,94,0.2); }\
    .verdict-box.yellow { background:var(--yellow-bg); border:1px solid rgba(234,179,8,0.2); }\
    .verdict-box.red { background:var(--red-bg); border:1px solid rgba(239,68,68,0.2); }\
    .verdict-box .verdict-title { font-size:24px; font-weight:600; margin-bottom:12px; }\
    .verdict-box.green .verdict-title { color:var(--green); }\
    .verdict-box.yellow .verdict-title { color:var(--yellow); }\
    .verdict-box.red .verdict-title { color:var(--red); }\
    .verdict-box .verdict-text { font-size:17px; color:var(--text-muted); line-height:1.6; max-width:560px; margin:0 auto; }\
    .kpi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:32px; }\
    @media(max-width:600px){ .kpi-grid { grid-template-columns:1fr; } }\
    .kpi-card { background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:28px 24px; text-align:center; }\
    .kpi-card .kpi-label { font-size:14px; text-transform:uppercase; letter-spacing:1px; color:var(--text-dim); margin-bottom:10px; }\
    .kpi-card .kpi-value { font-family:var(--mono); font-size:36px; font-weight:700; color:var(--text); line-height:1.2; }\
    .kpi-card .kpi-sub { font-size:15px; color:var(--text-muted); margin-top:6px; }\
    .insight-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:24px 0; }\
    @media(max-width:600px){ .insight-grid { grid-template-columns:1fr; } }\
    .insight-box { background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:24px; }\
    .insight-box .insight-title { font-size:16px; font-weight:600; color:var(--text); margin-bottom:10px; }\
    .insight-box .insight-text { font-size:16px; color:var(--text-muted); line-height:1.6; }\
    .insight-box .insight-text strong { color:var(--accent); font-weight:600; }\
    .status-badge { display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:4px; font-size:15px; font-weight:500; }\
    .status-badge.red { background:var(--red-bg); color:var(--red); }\
    .status-badge.yellow { background:var(--yellow-bg); color:var(--yellow); }\
    .status-badge.green { background:var(--green-bg); color:var(--green); }\
    .cta-section { text-align:center; padding:40px 24px; margin:32px 0; border:1px solid var(--border); border-radius:12px; }\
    .cta-section p { font-size:18px; color:var(--text-muted); margin-bottom:24px; max-width:520px; margin-left:auto; margin-right:auto; }\
    .cta-section .btn { font-size:19px; padding:18px 44px; }\
    .scenario-card { background:var(--bg-card); border:1px solid var(--border); border-radius:10px; padding:28px; margin-bottom:16px; display:grid; grid-template-columns:1fr auto; gap:20px; align-items:start; }\
    @media(max-width:600px){ .scenario-card { grid-template-columns:1fr; } }\
    .scenario-card .sc-left h3 { font-size:20px; font-weight:600; margin-bottom:6px; color:var(--text); }\
    .scenario-card .sc-left p { font-size:16px; color:var(--text-muted); line-height:1.5; }\
    .scenario-card .sc-right { text-align:right; min-width:200px; }\
    .scenario-card .sc-duration { font-family:var(--mono); font-size:28px; font-weight:700; margin-bottom:4px; }\
    .scenario-card .sc-duration.green { color:var(--green); }\
    .scenario-card .sc-duration.yellow { color:var(--yellow); }\
    .scenario-card .sc-duration.accent { color:var(--accent); }\
    .scenario-card .sc-detail { font-size:15px; color:var(--text-dim); line-height:1.5; }\
    .scenario-card .sc-recommendation { margin-top:12px; font-size:15px; color:var(--text-muted); border-top:1px solid var(--border); padding-top:12px; grid-column:1 / -1; }\
    .scenario-card .sc-recommendation strong { color:var(--accent); }\
    .export-bar { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:18px 24px; background:var(--bg-card); border:1px solid var(--border); border-radius:8px; margin:24px 0; }\
    .export-bar p { font-size:15px; color:var(--text-muted); }\
    #resultSection { display:none; animation:fadeIn 0.3s ease; }\
    #resultSection.visible { display:block; }\
    @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }\
    footer { text-align:center; padding:40px 0; border-top:1px solid var(--border); margin-top:48px; }\
    footer p { font-size:12px; color:var(--text-dim); }\
    .hidden { display:none !important; }\
  ';

  // ==========================================================================
  // HTML
  // ==========================================================================
  var HTML = '\
  <div class="vm-root"><div class="tool-box">\
    <header>\
      <h1>Website-Potenzial-Check</h1>\
      <p>Wie viele Anfragen l&auml;sst deine Website liegen? Finde heraus, wo du im Branchenvergleich stehst &mdash; und welche Hebel den gr&ouml;&szlig;ten Unterschied machen.</p>\
    </header>\
    <!-- ========== INPUT ========== -->\
    <div id="inputSection" style="padding-top:32px;">\
      <div class="field-group">\
        <label>In welcher Branche bist du?</label>\
        <span class="hint">Die Vergleichswerte passen sich an deine Branche an.</span>\
        <select class="input-field" id="industry">\
          <option value="" selected>-- Bitte w&auml;hlen --</option>\
          <option value="maschinenbau">Maschinenbau / Industrie / Fertigung</option>\
          <option value="it">IT-Dienstleister / Beratung / Consulting</option>\
          <option value="saas">SaaS / Software</option>\
          <option value="finanzen">Finanzdienstleister / Versicherungen</option>\
          <option value="energie">Energie / Erneuerbare Energien</option>\
          <option value="medtech">Medizintechnik / Healthcare</option>\
          <option value="immobilien">Immobilien / Bautr&auml;ger</option>\
          <option value="bau">Baugewerbe / Architektur / Ingenieure</option>\
          <option value="recht">Rechtsanw&auml;lte / Kanzleien / Steuerberater</option>\
          <option value="handwerk">Handwerk / Gewerbe</option>\
          <option value="sonstiges">Andere Branche</option>\
        </select>\
      </div>\
      <div class="field-group">\
        <label>Wie viele Besucher hat deine Website pro Monat?</label>\
        <span class="hint">Findest du in Google Analytics unter Berichte &rarr; &Uuml;bersicht. Wenn du es nicht genau wei&szlig;t, sch&auml;tz grob.</span>\
        <input type="text" class="input-field" id="monthlyVisitors" value="" placeholder="z.B. 8.000" inputmode="numeric">\
      </div>\
      <div class="field-group">\
        <label>Wie viele Anfragen kommen pro Monat &uuml;ber die Website?</label>\
        <span class="hint">Kontaktformulare, Anrufe &uuml;ber die Website, E-Mails &uuml;ber die Website, Terminbuchungen &mdash; alles zusammengez&auml;hlt.</span>\
        <input type="text" class="input-field" id="monthlyLeads" value="" placeholder="z.B. 10" inputmode="numeric">\
      </div>\
      <div class="field-group">\
        <label>Deine Website-URL <span style="font-weight:400;color:var(--text-dim);">(optional)</span></label>\
        <span class="hint">Damit dein Ergebnis im PDF personalisiert wird.</span>\
        <input type="text" class="input-field" id="websiteUrl" value="" placeholder="z.B. www.deine-firma.de">\
      </div>\
      <div class="field-group">\
        <label>Wie gro&szlig; ist euer Einzugsgebiet?</label>\
        <span class="hint">Beeinflusst die Einordnung deines Traffics &mdash; 1.000 Besucher bedeuten f&uuml;r einen lokalen Betrieb etwas anderes als f&uuml;r ein bundesweites Unternehmen.</span>\
        <select class="input-field" id="reach">\
          <option value="lokal">Lokal (Stadt / Landkreis)</option>\
          <option value="regional" selected>Regional (Bundesland / Gro&szlig;raum)</option>\
          <option value="deutschland">Deutschland</option>\
          <option value="dach">DACH (Deutschland, &Ouml;sterreich, Schweiz)</option>\
          <option value="international">International</option>\
        </select>\
      </div>\
      <div class="btn-row">\
        <button class="btn btn-primary" data-action="calculate">Auswerten</button>\
      </div>\
    </div>\
    <!-- ========== RESULT ========== -->\
    <div id="resultSection">\
      <div class="verdict-box" id="verdictBox">\
        <div class="verdict-title" id="verdictTitle"></div>\
        <div class="verdict-text" id="verdictText"></div>\
      </div>\
      <div class="hero-number">\
        <div class="hero-pre" style="color:var(--text);">Um eine Ver&auml;nderung statistisch zu belegen, braucht deine Website:</div>\
        <div class="hero-value" id="r_eyeballs">&mdash;</div>\
        <div class="hero-post" id="r_eyeballsSub">&mdash;</div>\
        <div class="hero-post" style="margin-top:12px;font-size:15px;" id="r_eyeballsNote">&mdash;</div>\
      </div>\
      <div style="display:flex;gap:12px;margin-bottom:32px;flex-wrap:wrap;">\
        <div style="flex:1;min-width:140px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:16px 20px;text-align:center;">\
          <div style="font-size:13px;color:var(--text-dim);margin-bottom:4px;">Deine Quote</div>\
          <div style="font-family:var(--mono);font-size:24px;font-weight:700;" id="r_rate">&mdash;</div>\
          <div style="font-size:13px;margin-top:2px;" id="r_rateSub">&mdash;</div>\
        </div>\
        <div style="flex:1;min-width:140px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:16px 20px;text-align:center;">\
          <div style="font-size:13px;color:var(--text-dim);margin-bottom:4px;">Branche &empty;</div>\
          <div style="font-family:var(--mono);font-size:24px;font-weight:700;color:var(--text-muted);" id="r_benchmark">&mdash;</div>\
          <div style="font-size:13px;color:var(--text-dim);margin-top:2px;" id="r_benchmarkSub">&mdash;</div>\
        </div>\
        <div style="flex:1;min-width:140px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:16px 20px;text-align:center;">\
          <div style="font-size:13px;color:var(--text-dim);margin-bottom:4px;">Top 25 %</div>\
          <div style="font-family:var(--mono);font-size:24px;font-weight:700;color:var(--green);" id="r_top">&mdash;</div>\
          <div style="font-size:13px;color:var(--text-dim);margin-top:2px;" id="r_topSub">&mdash;</div>\
        </div>\
      </div>\
      <div>\
        <p class="section-label">Deine Hebel &mdash; von schnellen Optimierungen bis zum Redesign</p>\
        <div id="scenarioCards"></div>\
        <p style="font-size:15px;color:var(--text-dim);margin-top:16px;line-height:1.6;">Diese Zeiten basieren auf deinem aktuellen Traffic. Mit gezielter Werbung (Google Ads, Meta Ads) l&auml;sst sich der Traffic oft schnell verdoppeln oder verdreifachen &mdash; dann verk&uuml;rzen sich alle Testzeiten entsprechend.</p>\
      </div>\
      <div class="divider"></div>\
      <div class="insight-grid" id="insightGrid"></div>\
      <div class="divider"></div>\
      <div class="cta-section" id="ctaPrimary">\
        <p id="ctaText"></p>\
        <a class="btn btn-primary" href="https://vogler.marketing/erstgespraech" target="_blank" rel="noopener" id="ctaButton" data-action="ctaClick" data-cta="erstgespraech">Erstgespr&auml;ch buchen</a>\
      </div>\
      <div style="text-align:center;margin:16px 0 32px;">\
        <p style="font-size:15px;color:var(--text-dim);margin-bottom:16px;">Die Website ist nur ein Baustein. Demand Capture, Werbung, Content, Nurturing &mdash; alles greift ineinander.</p>\
        <a class="btn btn-secondary" href="https://vogler.marketing/leistungen" target="_blank" rel="noopener" data-action="ctaClick" data-cta="leistungen">Alle Leistungen ansehen</a>\
      </div>\
      <div class="export-bar">\
        <p>Ergebnis als PDF speichern und mit deinem Team teilen?</p>\
        <button class="btn btn-secondary" data-action="generatePDF">Als PDF speichern</button>\
      </div>\
      <div style="text-align:center;margin:32px 0;">\
        <button class="btn btn-secondary" data-action="resetCalc">Mit anderen Werten nochmal rechnen</button>\
      </div>\
      <div style="margin:40px 0 0;padding:20px;border-top:1px solid var(--border);">\
        <p style="font-size:11px;color:var(--text-dim);line-height:1.7;">\
          <strong>Methodik:</strong> Die Berechnung basiert auf einem statistischen Standardverfahren (95 % Sicherheit). Die tats&auml;chliche Testdauer kann je nach Schwankungen im Besucherverhalten abweichen. Tests sollten immer mindestens 7 Tage laufen, um Wochentags-Unterschiede auszugleichen. Dieser Rechner ersetzt keine individuelle Beratung.\
        </p>\
      </div>\
    </div>\
    <footer><p>Website-Potenzial-Check von Vogler Marketing</p></footer>\
  </div></div>';

  // --- Inject ---
  shadow.innerHTML = '<style>' + CSS + '</style>' + HTML;

  // ==========================================================================
  // EVENT DELEGATION (statt inline onclick)
  // ==========================================================================
  shadow.addEventListener('click', function(e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.dataset.action;

    switch(action) {
      case 'calculate': calculate(); break;
      case 'generatePDF': generatePDF(); break;
      case 'resetCalc': resetCalc(); break;
      case 'ctaClick':
        trackEvent('rechner_cta_clicked', {
          rechner: 'website-potenzial-check',
          cta: el.dataset.cta || 'unknown'
        });
        break;
    }
  });

  // ==========================================================================
  // FORMATTING HELPERS
  // ==========================================================================
  function fmtNum(n) {
    if (!isFinite(n) || isNaN(n)) return '\u2014';
    return Math.round(n).toLocaleString('de-DE');
  }

  function fmtPctDE(n) {
    return n.toFixed(1).replace('.', ',') + ' %';
  }

  // Parst Eingaben wie "1.000", "1000", "1,000", "15000"
  function parseNum(val) {
    if (!val) return 0;
    var s = String(val).trim();
    s = s.replace(/\./g, '');
    s = s.replace(',', '.');
    return parseInt(s) || 0;
  }

  // ==========================================================================
  // BRANCHEN-BENCHMARKS
  // ==========================================================================
  var industries = {
    maschinenbau: { cr: 2.3, crGood: 5.2, crLow: 0.8, typicalVisitors: 12000, typicalLeads: 8, name: 'Maschinenbau / Industrie' },
    it:           { cr: 3.1, crGood: 6.1, crLow: 1.1, typicalVisitors: 15000, typicalLeads: 12, name: 'IT / Beratung' },
    saas:         { cr: 2.0, crGood: 5.0, crLow: 0.8, typicalVisitors: 25000, typicalLeads: 15, name: 'SaaS / Software' },
    finanzen:     { cr: 2.8, crGood: 5.5, crLow: 1.0, typicalVisitors: 10000, typicalLeads: 8, name: 'Finanzdienstleister' },
    energie:      { cr: 2.2, crGood: 4.9, crLow: 0.8, typicalVisitors: 8000, typicalLeads: 5, name: 'Energie / Erneuerbare' },
    medtech:      { cr: 2.7, crGood: 5.7, crLow: 0.9, typicalVisitors: 12000, typicalLeads: 10, name: 'Medizintechnik' },
    immobilien:   { cr: 2.1, crGood: 4.8, crLow: 0.7, typicalVisitors: 8000, typicalLeads: 5, name: 'Immobilien' },
    bau:          { cr: 2.0, crGood: 4.5, crLow: 0.7, typicalVisitors: 6000, typicalLeads: 4, name: 'Baugewerbe / Architektur' },
    recht:        { cr: 2.6, crGood: 5.5, crLow: 1.0, typicalVisitors: 5000, typicalLeads: 4, name: 'Kanzleien / Steuerberater' },
    handwerk:     { cr: 1.9, crGood: 4.2, crLow: 0.6, typicalVisitors: 4000, typicalLeads: 3, name: 'Handwerk / Gewerbe' },
    sonstiges:    { cr: 2.3, crGood: 5.0, crLow: 0.8, typicalVisitors: 10000, typicalLeads: 7, name: 'Durchschnitt B2B' }
  };

  function getIndustry() {
    return industries[$('industry').value] || industries.sonstiges;
  }

  // Reichweite-Kontext
  var reachContext = {
    lokal:         { label: 'lokalen Betrieb', goodTraffic: 500,  greatTraffic: 2000 },
    regional:      { label: 'regionales Unternehmen', goodTraffic: 2000, greatTraffic: 8000 },
    deutschland:   { label: 'deutschlandweit t\u00E4tiges Unternehmen', goodTraffic: 8000, greatTraffic: 30000 },
    dach:          { label: 'DACH-weit t\u00E4tiges Unternehmen', goodTraffic: 12000, greatTraffic: 50000 },
    international: { label: 'international t\u00E4tiges Unternehmen', goodTraffic: 20000, greatTraffic: 80000 }
  };

  function getReach() {
    return reachContext[$('reach').value] || reachContext.regional;
  }

  // ==========================================================================
  // SAMPLE SIZE (two-proportion z-test, 95% confidence, 80% power)
  // ==========================================================================
  function calcSampleSize(p1, mdeRelative) {
    var zAlpha = 1.96;
    var zBeta = 0.8416;
    var p2 = p1 * (1 + mdeRelative);
    var num = Math.pow(zAlpha + zBeta, 2) * (p1 * (1 - p1) + p2 * (1 - p2));
    var den = Math.pow(p2 - p1, 2);
    if (den === 0) return Infinity;
    return Math.ceil(num / den);
  }

  // ==========================================================================
  // MAIN CALCULATION
  // ==========================================================================
  function calculate() {
    var monthlyVisitors = parseNum($('monthlyVisitors').value);
    var monthlyLeads = parseNum($('monthlyLeads').value);

    if (!$('industry').value) {
      alert('Bitte w\u00E4hle deine Branche aus.');
      return;
    }
    if (monthlyVisitors < 100) {
      alert('Bitte gib die monatlichen Besucher deiner Website ein.');
      return;
    }
    if (monthlyLeads < 1) {
      alert('Bitte gib ein, wie viele Anfragen pro Monat \u00FCber die Website reinkommen.');
      return;
    }

    var dailyVisitors = Math.round(monthlyVisitors / 30);
    var p1 = monthlyLeads / monthlyVisitors;
    var ind = getIndustry();
    var userRate = p1 * 100;
    var topLeads = Math.round(monthlyVisitors * ind.crGood / 100);

    // --- Show results ---
    $('resultSection').classList.add('visible');

    // --- Verdict ---
    var vBox = $('verdictBox');
    var vTitle = $('verdictTitle');
    var vText = $('verdictText');
    vBox.className = 'verdict-box';

    var midSample = calcSampleSize(p1, 0.15) * 2;
    var midDays = Math.max(Math.ceil(midSample / dailyVisitors), 7);
    var reach = getReach();

    // --- Augenpaare ---
    $('r_eyeballs').textContent = fmtNum(midSample) + ' Besucher';
    var eyeMonths = midDays > 60 ? (Math.round(midDays / 30) + ' Monate') : (midDays + ' Tage');
    $('r_eyeballsSub').innerHTML = '<strong>Warum diese Zahl?</strong> Damit du sicher wei\u00DFt, ob eine \u00C4nderung wirklich besser funktioniert \u2014 und nicht nur zuf\u00E4llig \u2014 braucht es eine Mindestzahl an Besuchern. Bei deiner aktuellen Anfragequote (' + fmtPctDE(userRate) + ') sind das ' + fmtNum(midSample) + ' Besucher. Bei deinem Traffic (' + fmtNum(monthlyVisitors) + '/Monat) dauert das ca. ' + eyeMonths + '.';
    $('r_eyeballsNote').textContent = 'Das hei\u00DFt aber nicht, dass du warten musst. Du kannst jederzeit proaktiv Ver\u00E4nderungen umsetzen, die Ergebnisse tracken und Schritt f\u00FCr Schritt optimieren. Unten findest du konkrete Hebel und Empfehlungen.';

    // --- Verdict mit Reichweite-Kontext ---
    if (userRate >= ind.crGood) {
      vBox.classList.add('green');
      vTitle.textContent = 'Deine Website performt \u00FCberdurchschnittlich';
      vText.textContent = 'Mit ' + fmtPctDE(userRate) + ' liegst du \u00FCber dem Top-25-%-Wert deiner Branche (' + fmtPctDE(ind.crGood) + '). Der n\u00E4chste Hebel ist wahrscheinlich mehr qualifizierter Traffic \u2014 nicht die Website selbst.';
    } else if (userRate >= ind.cr) {
      vBox.classList.add('yellow');
      vTitle.textContent = 'Solide Basis \u2014 aber da geht mehr';
      vText.textContent = 'Deine Anfragequote liegt im Branchendurchschnitt. Top-Performer in deiner Branche erreichen ' + fmtPctDE(ind.crGood) + ' \u2014 das w\u00E4ren bei deinem Traffic ' + fmtNum(topLeads) + ' Anfragen pro Monat statt ' + fmtNum(monthlyLeads) + '.';
    } else {
      vBox.classList.add('green');
      vTitle.textContent = 'Hier liegt ungenutztes Potenzial';
      vText.textContent = 'Deine Branche erreicht im Schnitt ' + fmtPctDE(ind.cr) + ', Top-Performer sogar ' + fmtPctDE(ind.crGood) + '. Bei deinem Traffic w\u00E4ren das ' + fmtNum(topLeads) + ' Anfragen pro Monat statt ' + fmtNum(monthlyLeads) + ' \u2014 ohne einen Euro mehr f\u00FCr Werbung.';
    }

    // --- KPIs: Branchen-Vergleich ---
    $('r_rate').textContent = fmtPctDE(userRate);
    $('r_benchmark').textContent = fmtPctDE(ind.cr);
    $('r_top').textContent = fmtPctDE(ind.crGood);

    if (userRate >= ind.crGood) {
      $('r_rateSub').textContent = 'Top-Performer in deiner Branche';
      $('r_rateSub').style.color = '#22c55e';
    } else if (userRate >= ind.cr) {
      $('r_rateSub').textContent = 'Im Branchendurchschnitt';
      $('r_rateSub').style.color = '#22c55e';
    } else {
      $('r_rateSub').textContent = 'Unter dem Durchschnitt \u2014 Potenzial';
      $('r_rateSub').style.color = '#eab308';
    }

    $('r_benchmarkSub').textContent = ind.name;
    $('r_topSub').textContent = '= ' + fmtNum(topLeads) + ' Anfragen/Monat bei deinem Traffic';

    // --- Szenario-Cards ---
    var cardsContainer = $('scenarioCards');
    cardsContainer.innerHTML = '';

    function scenarioResult(mde) {
      var sp = calcSampleSize(p1, mde / 100) * 2;
      var d = Math.max(Math.ceil(sp / dailyVisitors), 7);
      var durText, durClass, approach;
      if (d <= 14) {
        durText = d + ' Tage'; durClass = 'green';
        approach = 'A/B-Test m\u00F6glich \u2014 zwei Versionen parallel laufen lassen.';
      } else if (d <= 30) {
        durText = d + ' Tage'; durClass = 'green';
        approach = 'A/B-Test m\u00F6glich \u2014 Geduld haben, nicht vorzeitig abbrechen.';
      } else if (d <= 90) {
        durText = Math.round(d / 7) + ' Wochen'; durClass = 'yellow';
        approach = 'A/B-Test machbar, aber lang. Alternative: Direkt umsetzen und vorher/nachher vergleichen.';
      } else {
        durText = d > 365 ? (Math.round(d / 30) + '+ Monate') : (Math.round(d / 30) + ' Monate'); durClass = 'accent';
        approach = 'Direkt umsetzen und vorher/nachher messen \u2014 kein klassischer Test n\u00F6tig.';
      }
      return { days: d, durText: durText, durClass: durClass, approach: approach, sample: sp };
    }

    var trafficNote = '<br><span style="color:var(--text-dim);font-size:13px;">Zahlen basieren auf deiner Angabe von aktuellem Traffic. Mehr Traffic = schnellere Optimierung.</span>';

    // === GRUPPE 1: Bestehende Seite optimieren ===
    var g1Label = document.createElement('p');
    g1Label.className = 'section-label';
    g1Label.style.marginTop = '8px';
    g1Label.textContent = 'Bestehende Seite optimieren';
    cardsContainer.appendChild(g1Label);

    var optimizations = [
      {
        mde: 20,
        title: 'Above the Fold: \u00DCberschrift + Hauptbild',
        desc: 'Der Bereich, den 100 % deiner Besucher sehen \u2014 wenn sie eine deiner Seiten besuchen. Aber 60 % scrollen i.d.R. nie weiter. \u00C4nderungen hier haben den gr\u00F6\u00DFten Einzeleffekt auf deine Anfragen.',
        freq: 'Mindestens 2 Wochen laufen lassen. Maximal 1 \u00C4nderung pro Unterseite gleichzeitig.',
        extraLeads: Math.max(1, Math.round(monthlyLeads * 0.20))
      },
      {
        mde: 10,
        title: '\u00DCberschriften und Texte auf der ganzen Seite',
        desc: 'Die meisten Besucher lesen nur \u00DCberschriften, nicht den Flie\u00DFtext. Wenn deine Headlines das Angebot nicht klar machen, verlierst du Anfragen.',
        freq: 'Diese Unterseite mindestens 3 Wochen unver\u00E4ndert lassen, dann erst messen. Andere Seiten kannst du parallel optimieren.',
        extraLeads: Math.max(1, Math.round(monthlyLeads * 0.10))
      },
      {
        mde: 15,
        title: 'Bilder + Erfahrungsberichte sichtbar machen',
        desc: 'Echte Fotos statt Stock-Bilder, Kundenstimmen mit Name und Bild statt anonyme Zitate. Visueller Beweis \u00FCberzeugt st\u00E4rker als jeder Text.',
        freq: 'Auf dieser Unterseite mindestens 2 Wochen laufen lassen. Vorher/Nachher dokumentieren.',
        extraLeads: Math.max(1, Math.round(monthlyLeads * 0.15))
      }
    ];

    optimizations.forEach(function(sc) {
      var r = scenarioResult(sc.mde);
      var card = document.createElement('div');
      card.className = 'scenario-card';
      card.innerHTML =
        '<div class="sc-left">' +
          '<h3>' + sc.title + '</h3>' +
          '<p>' + sc.desc + '</p>' +
        '</div>' +
        '<div class="sc-right">' +
          '<div class="sc-duration ' + r.durClass + '">' + r.durText + '</div>' +
          '<div class="sc-detail">+' + fmtNum(sc.extraLeads) + ' Anfragen/Monat</div>' +
        '</div>' +
        '<div class="sc-recommendation">' +
          '<strong>Empfehlung:</strong> ' + r.approach + ' ' + sc.freq + trafficNote +
        '</div>';
      cardsContainer.appendChild(card);
    });

    // === GRUPPE 2: Strukturelle Aenderungen ===
    var g2Label = document.createElement('p');
    g2Label.className = 'section-label';
    g2Label.style.marginTop = '32px';
    g2Label.textContent = 'Strukturelle \u00C4nderungen';
    cardsContainer.appendChild(g2Label);

    var structural = [
      {
        mde: 25,
        title: 'Neues Angebot oder neue Unterseite',
        desc: 'Anderes Wertversprechen, neue Landing Page f\u00FCr ein spezifisches Angebot, zus\u00E4tzliche Seite f\u00FCr eine neue Zielgruppe.',
        freq: '\u00C4nderung dokumentieren. Diese Seite mindestens 2 Wochen unver\u00E4ndert lassen, damit der Effekt zuordenbar ist.',
        extraLeads: Math.max(1, Math.round(monthlyLeads * 0.25))
      },
      {
        mde: 40,
        title: 'Komplettes Redesign mit maximal auf Performance optimiertem Design',
        desc: 'Neuer Seitenaufbau, neues Bildkonzept, Conversion-optimierte Struktur. Die gr\u00F6\u00DFte \u00C4nderung \u2014 aber auch der gr\u00F6\u00DFte Hebel.',
        freq: 'Vorher und nachher jeweils 4 Wochen Daten sammeln. Keine weiteren \u00C4nderungen auf dieser Seite in dieser Zeit.',
        extraLeads: Math.max(1, Math.round(monthlyLeads * 0.40))
      }
    ];

    structural.forEach(function(sc) {
      var r = scenarioResult(sc.mde);
      var card = document.createElement('div');
      card.className = 'scenario-card';
      card.innerHTML =
        '<div class="sc-left">' +
          '<h3>' + sc.title + '</h3>' +
          '<p>' + sc.desc + '</p>' +
        '</div>' +
        '<div class="sc-right">' +
          '<div class="sc-duration ' + r.durClass + '">' + r.durText + '</div>' +
          '<div class="sc-detail">+' + fmtNum(sc.extraLeads) + ' Anfragen/Monat</div>' +
        '</div>' +
        '<div class="sc-recommendation">' +
          '<strong>Empfehlung:</strong> ' + r.approach + ' ' + sc.freq + trafficNote +
        '</div>';
      cardsContainer.appendChild(card);
    });

    // --- 2 Insights ---
    var grid = $('insightGrid');
    grid.innerHTML = '';

    var reachInsight = {};
    if (monthlyVisitors >= reach.greatTraffic) {
      reachInsight = {
        title: 'Starker Traffic f\u00FCr ein ' + reach.label,
        text: fmtNum(monthlyVisitors) + ' Besucher/Monat sind <strong>\u00FCberdurchschnittlich f\u00FCr ein ' + reach.label + '.</strong> Du hast eine solide Basis f\u00FCr systematische Optimierung.'
      };
    } else if (monthlyVisitors >= reach.goodTraffic) {
      reachInsight = {
        title: 'Solider Traffic f\u00FCr ein ' + reach.label,
        text: fmtNum(monthlyVisitors) + ' Besucher/Monat sind <strong>ein guter Wert f\u00FCr ein ' + reach.label + '.</strong> Damit kannst du gezielt optimieren und die Ergebnisse messen.'
      };
    } else {
      reachInsight = {
        title: 'Wenig Traffic f\u00FCr ein ' + reach.label + ' \u2014 aber kein Problem',
        text: fmtNum(monthlyVisitors) + ' Besucher/Monat sind f\u00FCr ein ' + reach.label + ' unterdurchschnittlich. <strong>Jede Verbesserung an der Website wirkt trotzdem sofort</strong> \u2014 und du kannst parallel am Traffic arbeiten.'
      };
    }

    var freqInsight = {
      title: 'Wie oft sollte man \u00C4nderungen messen?',
      text: '<strong>Maximal 1 \u00C4nderung pro Unterseite pro Monat, dann 2\u20134 Wochen Daten sammeln.</strong> Du kannst parallel verschiedene Unterseiten optimieren \u2014 solange du die Ergebnisse getrennt trackst. Aber nie 2 Dinge gleichzeitig auf derselben Seite \u00E4ndern.'
    };

    [reachInsight, freqInsight].forEach(function(ins) {
      var box = document.createElement('div');
      box.className = 'insight-box';
      box.innerHTML = '<div class="insight-title">' + ins.title + '</div><div class="insight-text">' + ins.text + '</div>';
      grid.appendChild(box);
    });

    // --- CTA mit Qualifizierung ---
    var ctaPrimary = $('ctaPrimary');
    var ctaText = $('ctaText');
    var ctaBtn = $('ctaButton');
    var reachVal = $('reach').value;
    var indVal = $('industry').value;

    var highTicketIndustries = ['maschinenbau', 'it', 'saas', 'finanzen', 'energie', 'medtech', 'immobilien'];
    var isHighTicket = highTicketIndustries.indexOf(indVal) >= 0;
    var isSubstantialReach = ['deutschland', 'dach', 'international'].indexOf(reachVal) >= 0;
    var hasTraffic = monthlyVisitors >= 3000;
    var isGoodFit = (isHighTicket || isSubstantialReach) && hasTraffic;

    if (isGoodFit) {
      ctaPrimary.style.display = '';
      if (midDays > 90) {
        ctaText.textContent = 'Du willst nicht monatelang auf Testergebnisse warten? Wir zeigen dir in 30 Minuten, welche bew\u00E4hrten Muster bei deiner Website den gr\u00F6\u00DFten Unterschied machen.';
        ctaBtn.textContent = 'Direkt optimieren';
      } else {
        ctaText.textContent = 'Du willst wissen, welche \u00C4nderungen auf deiner Website den gr\u00F6\u00DFten Unterschied machen? In 30 Minuten zeigen wir dir die 2\u20133 Punkte mit dem gr\u00F6\u00DFten Hebel.';
        ctaBtn.textContent = 'Erstgespr\u00E4ch buchen';
      }
    } else {
      ctaPrimary.style.display = 'none';
    }

    // Tracking
    var websiteUrl = ($('websiteUrl').value || '').trim();
    trackEvent('rechner_result', {
      rechner: 'website-potenzial-check',
      monthly_visitors: monthlyVisitors,
      monthly_leads: monthlyLeads,
      conversion_rate: Math.round(p1 * 10000) / 100,
      industry: indVal,
      reach: reachVal,
      website_url: websiteUrl,
      mid_scenario_days: midDays,
      qualified: isGoodFit
    });

    // Store for PDF
    window._wpcResults = {
      monthlyVisitors: monthlyVisitors,
      monthlyLeads: monthlyLeads,
      p1: p1,
      userRate: userRate,
      ind: ind,
      reach: reach,
      topLeads: topLeads,
      midDays: midDays,
      websiteUrl: websiteUrl,
      isGoodFit: isGoodFit
    };

    $('resultSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ==========================================================================
  // PDF GENERATION (neues Fenster + Druckdialog)
  // ==========================================================================
  function generatePDF() {
    trackEvent('rechner_lead_capture', { rechner: 'website-potenzial-check', action: 'pdf_download' });

    var r = window._wpcResults;
    if (!r) return;

    var monthlyVisitors = r.monthlyVisitors;
    var monthlyLeads = r.monthlyLeads;
    var p1 = r.p1;
    var userRate = r.userRate;
    var ind = r.ind;
    var reach = r.reach;
    var url = r.websiteUrl;
    var topLeads = r.topLeads;
    var potenzial = topLeads - monthlyLeads;
    var date = new Date().toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'});

    var verdictText, verdictColor;
    if (userRate >= ind.crGood) {
      verdictText = '\u00DCberdurchschnittlich \u2014 deine Website performt besser als 75 % deiner Branche.';
      verdictColor = '#166534';
    } else if (userRate >= ind.cr) {
      verdictText = 'Solide Basis \u2014 du liegst im Branchendurchschnitt. Top-Performer erreichen ' + fmtPctDE(ind.crGood) + '.';
      verdictColor = '#854d0e';
    } else {
      verdictText = 'Ungenutztes Potenzial \u2014 deine Branche erreicht im Schnitt ' + fmtPctDE(ind.cr) + ', Top-Performer ' + fmtPctDE(ind.crGood) + '.';
      verdictColor = '#166534';
    }

    var scenarios = [
      { mde: 20, label: 'Above the Fold (Headline + Hauptbild)', extra: Math.round(monthlyLeads * 0.20) },
      { mde: 10, label: '\u00DCberschriften und Texte', extra: Math.round(monthlyLeads * 0.10) },
      { mde: 15, label: 'Bilder + Erfahrungsberichte', extra: Math.round(monthlyLeads * 0.15) },
      { mde: 25, label: 'Neues Angebot / neue Unterseite', extra: Math.round(monthlyLeads * 0.25) },
      { mde: 40, label: 'Komplettes Redesign (Performance-optimiert)', extra: Math.round(monthlyLeads * 0.40) }
    ];

    var dailyVisitors = Math.round(monthlyVisitors / 30);
    var scenarioRows = '';
    scenarios.forEach(function(sc) {
      var sp = calcSampleSize(p1, sc.mde / 100) * 2;
      var d = Math.max(Math.ceil(sp / dailyVisitors), 7);
      var durText = d > 365 ? (Math.round(d / 30) + '+ Mon.') : d > 60 ? (Math.round(d / 7) + ' Wo.') : (d + ' Tage');
      scenarioRows += '<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">' + sc.label + '</td>' +
        '<td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;font-family:monospace;">' + durText + '</td>' +
        '<td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;font-family:monospace;">+' + fmtNum(sc.extra) + '</td></tr>';
    });

    var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Website-Potenzial-Check' + (url ? ' \u2014 ' + url : '') + '</title><style>' +
      'body{font-family:Helvetica,Arial,sans-serif;color:#222;line-height:1.6;max-width:800px;margin:0 auto;padding:40px 32px;}' +
      'h1{font-size:22px;margin-bottom:4px;}' +
      'h2{font-size:16px;margin:28px 0 12px;padding-bottom:6px;border-bottom:2px solid #f4e75a;}' +
      'table{width:100%;border-collapse:collapse;margin:12px 0;}' +
      'th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888;padding:8px 12px;border-bottom:2px solid #ddd;}' +
      '.kpi-row{display:flex;gap:16px;margin:20px 0;}' +
      '.kpi{flex:1;text-align:center;padding:16px;border:1px solid #ddd;border-radius:8px;}' +
      '.kpi-val{font-size:24px;font-weight:700;font-family:monospace;}' +
      '.kpi-label{font-size:11px;color:#888;text-transform:uppercase;margin-top:4px;}' +
      '.verdict{padding:16px 20px;border-radius:8px;border-left:4px solid;margin:20px 0;font-size:15px;}' +
      '.footer{margin-top:40px;padding-top:16px;border-top:1px solid #ddd;font-size:11px;color:#aaa;text-align:center;}' +
      '@media print{body{padding:20px;}}' +
      '</style></head><body>' +

      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;">' +
      '<div style="display:flex;align-items:center;gap:16px;">' +
      '<img src="https://s3.amazonaws.com/webflow-prod-assets/69de227433c0933c1c992ef8/69df70be48745487529a2c40_vm%20rebranding.png" alt="Vogler Marketing" style="height:28px;width:auto;">' +
      '<div><h1 style="margin:0;">Website-Potenzial-Check</h1>' +
      '<div style="font-size:14px;color:#888;">' + (url ? url + ' \u00B7 ' : '') + ind.name + ' \u00B7 ' + date + '</div></div></div>' +
      '<div style="font-size:12px;color:#aaa;">vogler.marketing</div></div>' +

      '<h2>\u00DCber VM</h2>' +
      '<div style="font-size:14px;line-height:1.7;color:#444;">' +
      '<p>Vogler Marketing baut funktionierende Acquisition-Systeme f\u00FCr B2B-Unternehmen, die massiv wachsen wollen. Keine Einzelma\u00DFnahmen \u2014 sondern verzahnte Systeme, die planbaren Umsatz erzeugen und skalieren, ohne zu brechen.</p>' +
      '<p style="margin-top:8px;">Die Kunden von Vogler Marketing sind mittelst\u00E4ndische Unternehmen aus Industrie, IT, Energie und Professional Services. Gesch\u00E4ftsf\u00FChrer, die Ergebnisse und Wirkung wollen \u2014 transparent nachvollziehbar, in klaren Reports, ohne sich selbst um jedes Detail k\u00FCmmern zu m\u00FCssen.</p></div>' +

      '<div class="verdict" style="border-color:' + verdictColor + ';background:' + (verdictColor === '#854d0e' ? '#fefce8' : '#f0fdf4') + ';color:' + verdictColor + ';">' + verdictText + '</div>' +

      '<div class="kpi-row">' +
      '<div class="kpi"><div class="kpi-val">' + fmtPctDE(userRate) + '</div><div class="kpi-label">Deine Anfragequote</div></div>' +
      '<div class="kpi"><div class="kpi-val" style="color:#888;">' + fmtPctDE(ind.cr) + '</div><div class="kpi-label">Branche \u00D8</div></div>' +
      '<div class="kpi"><div class="kpi-val" style="color:#166534;">' + fmtPctDE(ind.crGood) + '</div><div class="kpi-label">Top 25 %</div></div>' +
      '<div class="kpi"><div class="kpi-val" style="color:#b8960a;">+' + fmtNum(potenzial) + '</div><div class="kpi-label">Potenzial / Monat</div></div></div>' +

      '<h2>Deine Angaben</h2>' +
      '<table><tbody>' +
      '<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#888;">Besucher / Monat</td><td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;font-family:monospace;font-weight:600;">' + fmtNum(monthlyVisitors) + '</td></tr>' +
      '<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#888;">Anfragen / Monat</td><td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;font-family:monospace;font-weight:600;">' + fmtNum(monthlyLeads) + '</td></tr>' +
      '<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#888;">Einzugsgebiet</td><td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;">' + reach.label.charAt(0).toUpperCase() + reach.label.slice(1) + '</td></tr>' +
      '<tr><td style="padding:6px 12px;color:#888;">Anfragen auf Top-25-%-Niveau</td><td style="padding:6px 12px;text-align:right;font-family:monospace;font-weight:700;font-size:18px;">' + fmtNum(topLeads) + ' / Monat</td></tr>' +
      '</tbody></table>' +

      '<h2>Deine Hebel \u2014 von schnellen Optimierungen bis zum Redesign</h2>' +
      '<table><thead><tr><th>Ma\u00DFnahme</th><th style="text-align:right;">Testdauer</th><th style="text-align:right;">Zus\u00E4tzl. Anfragen</th></tr></thead><tbody>' + scenarioRows + '</tbody></table>' +
      '<div style="font-size:12px;color:#888;margin-top:8px;">Testdauer und Anfragen basieren auf deinem aktuellen Traffic. Mehr Traffic (z.B. durch Ads) = schnellere Ergebnisse.</div>' +

      '<h2>Empfehlung</h2>' +
      '<div style="font-size:15px;line-height:1.7;">' +
      '<p>Starte mit dem <strong>Above the Fold</strong> \u2014 der Bereich, den 100 % deiner Besucher sehen. \u00C4nderungen an Headline und Hauptbild bringen den gr\u00F6\u00DFten Einzeleffekt.</p>' +
      '<p style="margin-top:8px;">Pro Unterseite maximal 1 \u00C4nderung gleichzeitig, dann 2\u20134 Wochen Daten sammeln. Du kannst verschiedene Unterseiten parallel optimieren.</p></div>' +

      '<h2>Warum manche Unternehmen schneller wachsen als andere</h2>' +
      '<div style="font-size:14px;line-height:1.7;color:#444;">' +
      '<p>Die Unternehmen, die weiterhin stark wachsen, haben eines gemeinsam: Sie verlassen sich nicht auf einzelne Ma\u00DFnahmen, Empfehlungen oder das Netzwerk des Gesch\u00E4ftsf\u00FChrers. Sie haben Systeme.</p>' +
      '<p style="margin-top:12px;">Systeme, die mehrere Umsatz-Adern aufbauen \u2014 eng miteinander verzahnt, skalierbar und so stabil, dass sie nicht st\u00E4ndig brechen. Systeme, die funktionieren, auch wenn der Gesch\u00E4ftsf\u00FChrer sich aus dem Tagesgesch\u00E4ft raush\u00E4lt.</p>' +
      '<p style="margin-top:12px;">Die Website ist dabei nur ein Zahnrad. Entscheidend ist die Maschine dahinter: Wie entsteht Nachfrage? Wie wird sie erfasst? Was passiert danach? Und vor allem: Welche Entscheidung bringt welches Ergebnis?</p>' +
      '<p style="margin-top:12px;">Wer das wei\u00DF, trifft bessere Entscheidungen. Wer das nicht wei\u00DF, investiert und hofft.</p></div>' +

      '<h2>Was du in einem 30-Minuten-Erstgespr\u00E4ch erf\u00E4hrst</h2>' +
      '<div style="font-size:14px;line-height:1.7;color:#444;">' +
      '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;"><span style="color:#166534;font-size:16px;flex-shrink:0;">&#10003;</span><span>Eine erste Einsch\u00E4tzung, wo dein gr\u00F6\u00DFter Engpass liegt \u2014 Website, Traffic oder Nachverfolgung</span></div>' +
      '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;"><span style="color:#166534;font-size:16px;flex-shrink:0;">&#10003;</span><span>Konkrete Beispiele, was bei \u00E4hnlichen Unternehmen in deiner Branche funktioniert hat</span></div>' +
      '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;"><span style="color:#166534;font-size:16px;flex-shrink:0;">&#10003;</span><span>Klarheit, ob ein systematischer Ansatz f\u00FCr dein Unternehmen \u00FCberhaupt der richtige Schritt ist</span></div>' +
      '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;"><span style="color:#166534;font-size:16px;flex-shrink:0;">&#10003;</span><span>Eine ehrliche Antwort \u2014 auch wenn die lautet, dass wir nicht der richtige Partner sind</span></div>' +
      '<p style="margin-top:16px;">Kein Pitch, keine Pr\u00E4sentation. Wir h\u00F6ren zu, stellen die richtigen Fragen und geben dir eine fundierte Ersteinsch\u00E4tzung.</p>' +
      '<p style="margin-top:12px;"><strong>Termin buchen:</strong> www.vogler.marketing/erstgespraech</p></div>' +

      '<div class="footer">' +
      '<div style="text-align:right;margin-bottom:16px;"><img src="https://s3.amazonaws.com/webflow-prod-assets/69de227433c0933c1c992ef8/69df70be48745487529a2c40_vm%20rebranding.png" alt="Vogler Marketing" style="height:24px;width:auto;"></div>' +
      '<div>Erstellt mit dem Website-Potenzial-Check von Vogler Marketing</div>' +
      '<div style="margin-top:4px;">vogler.marketing \u00B7 Alle Angaben ohne Gew\u00E4hr \u00B7 ' + date + '</div></div>' +

      '</body></html>';

    var printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(function() { printWindow.print(); }, 500);
  }

  // ==========================================================================
  // RESET
  // ==========================================================================
  function resetCalc() {
    $('resultSection').classList.remove('visible');
    mount.scrollIntoView({ behavior: 'smooth' });
  }

})();
