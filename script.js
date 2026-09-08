// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navtoggle');
const chapterNav = document.getElementById('chapternav');
navToggle.addEventListener('click', () => {
  chapterNav.classList.toggle('open');
});

// ---------- Scrollspy ----------
const navItems = document.querySelectorAll('#navlist li');
const sections = Array.from(navItems).map(item =>
  document.getElementById(item.dataset.target)
);

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = document.getElementById(item.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    chapterNav.classList.remove('open');
  });
});

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const idx = sections.indexOf(entry.target);
    if (idx === -1) return;
    if (entry.isIntersecting) {
      navItems.forEach(i => i.classList.remove('active'));
      navItems[idx].classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

sections.forEach(sec => { if (sec) spyObserver.observe(sec); });

// ---------- Score calculator ----------
const pillars = [
  { key: 'ernaehrung', label: 'Ernährung' },
  { key: 'bewegung', label: 'Bewegung' },
  { key: 'schlaf', label: 'Schlaf' },
  { key: 'zellgifte', label: 'Zellgifte meiden' },
  { key: 'stress', label: 'Stressmanagement' },
  { key: 'soziales', label: 'Soziale Bindungen' },
];

const scoreNumberEl = document.getElementById('scoreNumber');
const scoreVerdictEl = document.getElementById('scoreVerdict');
const gaugeFillEl = document.getElementById('gaugeFill');
const pillarBarsEl = document.getElementById('pillarBars');

// build pillar bar rows once
pillars.forEach(p => {
  const row = document.createElement('div');
  row.className = 'pillar-bar-row';
  row.innerHTML = `
    <span class="pillar-bar-label">${p.label}</span>
    <span class="pillar-bar-track"><span class="pillar-bar-fill" id="fill_${p.key}"></span></span>
    <span class="pillar-bar-val" id="val_${p.key}"></span>
  `;
  pillarBarsEl.appendChild(row);
});

const GAUGE_CIRCUMFERENCE = 251; // matches path length approximation for the semicircle

function computeScore() {
  let total = 0;
  pillars.forEach(p => {
    const input = document.getElementById(`q_${p.key}`);
    const val = parseInt(input.value, 10); // 0..4
    const pct = Math.round((val / 4) * 100);
    total += val;

    const fill = document.getElementById(`fill_${p.key}`);
    const valLabel = document.getElementById(`val_${p.key}`);
    if (fill) fill.style.width = pct + '%';
    if (valLabel) valLabel.textContent = pct + '%';
  });

  const maxTotal = pillars.length * 4; // 24
  const score = Math.round((total / maxTotal) * 100);

  scoreNumberEl.textContent = score;

  const offset = GAUGE_CIRCUMFERENCE - (GAUGE_CIRCUMFERENCE * score / 100);
  gaugeFillEl.style.strokeDashoffset = offset;

  let color = 'var(--coral)';
  let verdict = 'Hier liegt einiges an Potenzial — schon kleine Änderungen in ein bis zwei Bereichen können viel bewirken.';
  if (score >= 80) {
    color = 'var(--teal)';
    verdict = 'Ein starkes Exposom. Deine sechs Hebel arbeiten größtenteils für deine Zellen, nicht gegen sie.';
  } else if (score >= 55) {
    color = 'var(--gold)';
    verdict = 'Solide Basis mit Luft nach oben — such dir den schwächsten Bereich unten als nächsten Fokus aus.';
  } else if (score >= 35) {
    color = 'var(--gold)';
    verdict = 'Dein Exposom liegt im Mittelfeld — es gibt konkrete Stellschrauben in den Bereichen unten.';
  }
  gaugeFillEl.style.stroke = color;
  scoreVerdictEl.textContent = verdict;
}

document.querySelectorAll('#scoreForm input[type="range"]').forEach(input => {
  input.addEventListener('input', computeScore);
});

computeScore();
