const form = document.getElementById('terminal-form');

if (form) {
  const input = document.getElementById('passcode');
  const output = document.getElementById('output');
  const progress = document.getElementById('progress');
  const hexPanel = document.getElementById('hex');
  const hexRows = document.getElementById('hex-rows');
  const enterLink = document.getElementById('enter');
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  // [delay in ms, text, tone]
  const SEQUENCES = {
    join: [
      [400, '> verifying key signature ........ OK', 'dim'],
      [700, '> opening tunnel to dev_clubhouse.local:443', 'dim'],
      [700, '> bypassing firewall ........ done', 'dim'],
      [800, '> injecting payload into session 0x7F3A', 'dim'],
      [800, '> escalating privileges: RECRUIT -> MEMBER', 'warn'],
      [800, '> decrypting message headers', 'dim'],
      [700, '> unredacting author and timestamp fields', 'dim'],
      [700, 'ACCESS GRANTED. Welcome to the club.', 'ok'],
    ],
    admin: [
      [400, '> verifying admin passcode ........ OK', 'dim'],
      [700, '> locating privileged process', 'dim'],
      [700, '> exploiting sudoers misconfiguration', 'warn'],
      [800, '> overwriting session token 0x7F3A', 'dim'],
      [800, '> escalating privileges: MEMBER -> ADMIN', 'hot'],
      [800, '> mounting moderation tools', 'dim'],
      [700, '> arming delete command', 'hot'],
      [700, 'ADMIN ACCESS GRANTED. Use it wisely.', 'ok'],
    ],
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function addLine(text, tone = 'cmd') {
    const line = document.createElement('div');
    line.className = `line line-${tone}`;
    line.textContent = text; // textContent, never innerHTML
    output.append(line);
  }

  function setProgress(percent) {
    const filled = Math.round(percent / 5);
    progress.textContent = `[${'#'.repeat(filled)}${'-'.repeat(20 - filled)}] ${percent}%`;
  }

  // Fake memory dump
  const hex = (bytes) =>
    Array.from({ length: bytes }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0'),
    );

  function renderHex() {
    hexRows.replaceChildren(
      ...Array.from({ length: 18 }, () => {
        const row = document.createElement('div');
        row.textContent = `${hex(2).join('')}  ${hex(8).join(' ')}`;
        return row;
      }),
    );
  }

  async function runSequence(steps) {
    form.hidden = true;
    progress.hidden = false;
    hexPanel.hidden = false;
    setProgress(0);
    renderHex();
    const flicker = reduceMotion ? null : setInterval(renderHex, 110);

    for (let i = 0; i < steps.length; i += 1) {
      const [delay, text, tone] = steps[i];
      await wait(reduceMotion ? 0 : delay);
      addLine(text, tone);
      setProgress(Math.round(((i + 1) / steps.length) * 100));
    }

    clearInterval(flicker);
    enterLink.hidden = false;
    enterLink.focus();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = input.value;
    if (!value || form.dataset.busy) return;

    form.dataset.busy = 'true';
    addLine(`${form.dataset.prompt} ${'*'.repeat(value.length)}`);
    input.value = '';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams({ passcode: value }),
      });

      // a route guard redirected us (e.g. already a member)
      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      const result = await response.json();
      if (result.ok) {
        await runSequence(SEQUENCES[form.dataset.mode]);
        return; // stay "busy"; the only way forward is the button
      }
      addLine(result.message || form.dataset.denied, 'err');
    } catch {
      addLine('CONNECTION ERROR. Try again.', 'err');
    }

    delete form.dataset.busy;
    input.focus();
  });
}
