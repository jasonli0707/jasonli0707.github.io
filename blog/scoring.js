(() => {
  const root = document.querySelector('[data-scoring-demo]');
  if (!root) return;
  const chinese = document.documentElement.lang === 'zh-Hant';
  const inputs = [...root.querySelectorAll('input[type="range"]')];
  const presets = [...root.querySelectorAll('[data-weights]')];
  const fields = [...root.querySelectorAll('[data-metric]')];
  const status = root.querySelector('[data-demo-status]');
  const format = x => Number(x.toFixed(3)).toString();
  const update = () => {
    const weights = inputs.map(input => Number(input.value));
    const total = weights.reduce((a, b) => a + b, 0);
    const probabilities = weights.map(w => total ? w / total : 0);
    inputs.forEach((input, i) => {
      const label = total ? `${(probabilities[i] * 100).toFixed(1)}%` : '—';
      root.querySelector(`[data-probability="${i}"]`).textContent = label;
      root.querySelector(`[data-bar="${i}"]`).style.height = `${probabilities[i] * 100}%`;
      input.setAttribute('aria-valuetext', total
        ? (chinese ? `權重 ${weights[i]}，正規化 probability ${label}` : `Weight ${weights[i]}, normalized probability ${label}`)
        : (chinese ? '所有權重都是零，尚未定義 probability' : 'All weights are zero; probability is undefined'));
    });
    presets.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.weights === weights.join(','))));
    if (!total) {
      fields.forEach(field => { field.textContent = '—'; });
      status.textContent = chinese ? '請將至少一個權重調高，才可以形成 probability distribution。' : 'Increase at least one weight to define a probability distribution.';
      return;
    }
    const progress = Math.max(...probabilities);
    // Follow the official Score confidence example: first mode if tied.
    const mode = probabilities.indexOf(progress);
    // Algorithm 2 does not specify ties. This demo favors the higher count.
    const order = probabilities.map((_, i) => i).sort((a, b) => probabilities[b] - probabilities[a] || b - a);
    const proximity = -order.reduce((sum, value, i) => sum + (2 - i - value) ** 2, 0);
    const expected = probabilities.reduce((sum, p, i) => sum + i * p, 0);
    const spread = probabilities.reduce((sum, p, i) => sum + p * Math.abs(i - mode), 0);
    const confidence = Math.max(0, 1 - spread / (2 / 3));
    const scores = {progress, proximity, expected, confidence};
    fields.forEach(field => { field.textContent = format(scores[field.dataset.metric]); });
    status.textContent = chinese
      ? `Probability 排序：[${order.join(', ')}]。最可能完成 ${mode} 個 milestones；P(完成全部) = ${(probabilities[2] * 100).toFixed(1)}%。Confidence 不代表這條路有多好。`
      : `Probability order: [${order.join(', ')}]. Most likely count: ${mode} milestones; P(all complete) = ${(probabilities[2] * 100).toFixed(1)}%. Confidence does not measure how promising the path is.`;
  };
  inputs.forEach(input => input.addEventListener('input', update));
  presets.forEach(button => button.addEventListener('click', () => {
    button.dataset.weights.split(',').forEach((value, i) => { inputs[i].value = value; });
    update();
  }));
  root.hidden = false;
  update();
})();
