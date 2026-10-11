'use strict';
const controls = document.querySelector('.publication-controls');
const buttons = [...document.querySelectorAll('[data-filter]')];
const papers = [...document.querySelectorAll('.publication')];
const search = document.querySelector('#paper-search');
let active = 'all';
function update() {
  const query = search.value.trim().toLocaleLowerCase();
  let count = 0;
  for (const paper of papers) {
    const visible = (active === 'all' || (active === 'lead' && paper.dataset.lead === 'true')) &&
      paper.textContent.toLocaleLowerCase().includes(query);
    paper.hidden = !visible;
    if (visible) count++;
  }
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === active)));
  document.querySelector('#result-count').textContent = count + (count === 1 ? ' publication' : ' publications');
  document.querySelector('#no-results').hidden = count !== 0;
}
function reset() { active = 'all'; search.value = ''; update(); }
buttons.forEach(button => button.addEventListener('click', () => { active = button.dataset.filter; update(); }));
search.addEventListener('input', update);
document.querySelector('#clear-filters').addEventListener('click', () => { reset(); search.focus(); });
function revealHashTarget() {
  if (location.hash.startsWith('#paper-')) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) { reset(); requestAnimationFrame(() => target.scrollIntoView()); }
  }
}
window.addEventListener('hashchange', revealHashTarget);
document.querySelectorAll('.featured a').forEach(link => link.addEventListener('click', reset));
controls.hidden = false;
update();
revealHashTarget();
