const pages = [...document.querySelectorAll('.page')];
const navLinks = [...document.querySelectorAll('.nav-link')];
const navigation = document.getElementById('navigation');
const mobileToggle = document.querySelector('.mobile-toggle');

function showPage() {
  const requested = location.hash.slice(1) || 'home';
  const current = pages.some(page => page.id === requested) ? requested : 'home';
  for (const page of pages) page.hidden = page.id !== current;
  for (const link of navLinks) {
    const active = link.hash === '#' + current;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  navigation.classList.remove('open');
  mobileToggle.setAttribute('aria-expanded', 'false');
  const title = { home: 'a little world of ink', artist: 'meet the artist', tattoos: 'the tattoo book', inspiration: 'the inspiration cabinet', booking: 'booking & inquiries', loveletters: 'love letters' };
  document.title = 'Doll of Sorrows · ' + title[current];
}
window.addEventListener('hashchange', () => {
  showPage();
  document.getElementById('main').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
});
showPage();
mobileToggle.addEventListener('click', () => {
  const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
  mobileToggle.setAttribute('aria-expanded', String(!expanded));
  navigation.classList.toggle('open', !expanded);
});

const dialog = document.getElementById('inquiry-dialog');
const inquiryForm = document.getElementById('inquiry-form');
const inquiryResult = document.getElementById('inquiry-result');
document.querySelectorAll('[data-booking]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
inquiryForm.addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(inquiryForm);
  const lines = [`Hi Doll of Sorrows! My name is ${fields.get('name').trim()}.`, '', `I'd love to talk about a tattoo: ${fields.get('idea').trim()}`];
  if (fields.get('placement').trim()) lines.push(`Placement: ${fields.get('placement').trim()}`);
  if (fields.get('size').trim()) lines.push(`Approximate size: ${fields.get('size').trim()}`);
  if (fields.get('references').trim()) lines.push(`Reference: ${fields.get('references').trim()}`);
  lines.push('', 'Please let me know about availability and next steps. Thank you! ♡');
  document.getElementById('inquiry-preview').textContent = lines.join('\n');
  inquiryForm.hidden = true;
  inquiryResult.hidden = false;
  document.getElementById('copy-inquiry').focus();
});
document.getElementById('edit-inquiry').addEventListener('click', () => {
  inquiryResult.hidden = true;
  inquiryForm.hidden = false;
  document.getElementById('inquiry-idea').focus();
});
let toastTimer;
function toast(message) {
  const element = document.getElementById('toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('show'), 4000);
}
async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    toast('Copied with love. Paste your note into an Instagram DM. ♡');
    const previous = button.textContent;
    button.textContent = 'copied ♡';
    setTimeout(() => button.textContent = previous, 2500);
  } catch {
    toast('Select the message above and copy it to send.');
  }
}
document.getElementById('copy-inquiry').addEventListener('click', event => copyText(document.getElementById('inquiry-preview').textContent, event.currentTarget));
document.getElementById('letter-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('letter-name').value.trim();
  const message = document.getElementById('letter-message').value.trim();
  if (!message) return;
  document.getElementById('letter-preview').textContent = `Dear Doll of Sorrows,\n\n${message}\n\nWith love${name ? ',\n' + name : ' ♡'}`;
  document.getElementById('letter-result').hidden = false;
  document.getElementById('copy-letter').focus();
});
document.getElementById('copy-letter').addEventListener('click', event => copyText(document.getElementById('letter-preview').textContent, event.currentTarget));

let audioContext;
let musicTimer;
let musicOn = false;
const musicButton = document.getElementById('music-toggle');
const melody = [659.25, 783.99, 880, 783.99, 659.25, 587.33, 523.25, 587.33, 659.25, 783.99, 587.33, 523.25];
function playMusicPhrase() {
  const start = audioContext.currentTime + .05;
  melody.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, start + index * .55);
    gain.gain.linearRampToValueAtTime(.045, start + index * .55 + .014);
    gain.gain.exponentialRampToValueAtTime(.0001, start + index * .55 + 1.5);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(start + index * .55);
    oscillator.stop(start + index * .55 + 1.6);
  });
}
musicButton.addEventListener('click', async () => {
  try {
    if (!audioContext) audioContext = new AudioContext();
    musicOn = !musicOn;
    if (musicOn) {
      await audioContext.resume();
      playMusicPhrase();
      musicTimer = setInterval(playMusicPhrase, 8200);
    } else {
      clearInterval(musicTimer);
      await audioContext.suspend();
    }
    musicButton.setAttribute('aria-pressed', String(musicOn));
    musicButton.innerHTML = `<span aria-hidden="true">♫</span> music box: ${musicOn ? 'on' : 'off'}`;
  } catch {
    musicOn = false;
    clearInterval(musicTimer);
    toast('The music box is unavailable in this browser.');
  }
});
document.addEventListener('visibilitychange', async () => {
  if (audioContext && musicOn) {
    clearInterval(musicTimer);
    if (document.hidden) await audioContext.suspend();
    else {
      await audioContext.resume();
      playMusicPhrase();
      musicTimer = setInterval(playMusicPhrase, 8200);
    }
  }
});
