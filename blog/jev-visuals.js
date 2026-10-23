(() => {
  document.querySelectorAll('[data-spread-demo]').forEach(root => {
    const zh = root.dataset.lang === 'zh';
    const buttons = [...root.querySelectorAll('[data-zero]')];
    const update = zero => {
      const values = [zero, 30 - zero, 70];
      values.forEach((v, i) => {
        root.querySelector(`[data-bar="${i}"]`).style.width = `${v}%`;
        root.querySelector(`[data-prob="${i}"]`).textContent = `${v}%`;
      });
      const distance = (2 * zero + 30 - zero) / 100;
      const confidence = Math.max(0, 1 - distance / (2 / 3));
      root.querySelector('[data-spread-result]').textContent = `D = ${distance.toFixed(2)} · Confidence = ${confidence.toFixed(2)} — ${zh ? '最可能答案仍是 2 個（70%）' : 'Favourite still 2 milestones (70%)'}`;
      buttons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.zero) === zero)));
    };
    buttons.forEach(button => button.addEventListener('click', () => update(Number(button.dataset.zero))));
    root.querySelector('.jv-controls').hidden = false;
    update(10);
  });
  document.querySelectorAll('[data-calibration-demo]').forEach(root => {
    const zh = root.dataset.lang === 'zh';
    const dots = [...root.querySelectorAll('.jv-dots i')];
    const buttons = [...root.querySelectorAll('[data-actual]')];
    buttons.forEach(button => button.addEventListener('click', () => {
      const actual = Number(button.dataset.actual);
      dots.forEach((dot, i) => dot.classList.toggle('jv-complete', i < actual));
      root.querySelector('.jv-dots').setAttribute('aria-label', zh ? `${actual} 條完成，${100-actual} 條未完成` : `${actual} complete, ${100-actual} incomplete`);
      root.querySelector('[data-calibration-result]').textContent = zh
        ? `預測 70% → 實際 ${actual}/100：${actual === 70 ? '這一組吻合。' : '高估了完成機會（70% 對 40%）。'}`
        : `Predicted 70% → observed ${actual}/100: ${actual === 70 ? 'this group matches.' : 'completion was overestimated (70% vs 40%).'}`;
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    }));
    root.querySelector('.jv-controls').hidden = false;
  });
})();
