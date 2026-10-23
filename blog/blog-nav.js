(() => {
  const toc = document.querySelector('.post-toc');
  if (!toc) return;
  const links = [...toc.querySelectorAll('a[href^="#"]')];
  const sections = links.map(a => document.getElementById(a.hash.slice(1))).filter(Boolean);
  const activate = id => links.forEach(a => {
    if (a.hash === `#${id}`) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  });
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const readingLine = Math.min(160, window.innerHeight * .25);
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= readingLine) current = section;
      else break;
    }
    if (current) activate(current.id);
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  update();
})();
