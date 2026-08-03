# Rise Onboarding site — vaste regels voor elke (AI-)sessie

Dit is de bron van https://rise-onboarding.netlify.app (Netlify site `a60f8ed8-0d98-42fd-a6bc-90ef80b2bd28`). Twee dingen moeten in ELKE nieuwe versie behouden blijven:

## 1. Outreach-tracking op de giveaway-pagina (NIET VERWIJDEREN)

`giveaway/index.html` bevat een tracking-blok dat elk bezoek en elke formulier-inzending koppelt aan de ge-e-mailde lead (het acquisitie-dashboard zet `?lead=<id>` in de mail-link). Zonder dit blok weet het outreach-systeem niet wie de giveaway heeft gedownload en werkt de funnel-automatisering (Won-status, vervolg-mails) niet.

Sinds 2026-06-07 hoort daar ook **scroll-tracking** bij: milestones 25/50/75/100% sturen elk eenmalig `riseTrack('scroll_25')` t/m `riseTrack('scroll_100')` (een scroll-listener die per bezoek elke drempel één keer beacon't). Het dashboard gebruikt dit om te zien waar bezoekers afhaken; bij herbouw van de pagina moet dit blok mee terugkomen.

Bij het herbouwen of vervangen van de giveaway-pagina moet dit blok terugkomen:

1. In het script-gedeelte (vóór `handleSubmit`):

```js
// Rise outreach tracking: links this visit + signup back to the emailed lead.
const RISE_TRACK_URL = 'https://agent-acquisitie-leads.netlify.app/api/track';
const riseLead = (() => {
  try {
    const q = new URLSearchParams(location.search).get('lead');
    if (q) localStorage.setItem('rise_lead', q);
    return q || localStorage.getItem('rise_lead');
  } catch (e) { return null; }
})();
function riseTrack(event) {
  if (!riseLead) return;
  try {
    navigator.sendBeacon(RISE_TRACK_URL, JSON.stringify({ lead: riseLead, event: event, campaign: 'giveaway' }));
  } catch (e) { /* tracking must never break the page */ }
}
riseTrack('page_view');
```

2. In de succes-tak van het submit-script (waar het formulier verdwijnt en de succesmelding verschijnt):

```js
riseTrack('signup'); // giveaway won: lead filled in the form
```

## 2. Deploys: nooit scripts/tokens mee-uploaden

`deploy.command` bevat een Netlify-token en mag NOOIT op de live site terechtkomen. Deploy daarom altijd via `deploy.command` zelf (die deployt uit een tijdelijke kopie zonder `deploy.command`, `start.command`, `start.bat`, zips en `.netlify`). Niet handmatig de hele map naar Netlify slepen, en geen `netlify deploy --dir=.` direct op deze map draaien.
