const btn = document.getElementById('honk-btn');
const goose = document.getElementById('goose');
const honkText = document.getElementById('honk-text');

const infoBtn = document.getElementById('info-btn');
const closeBtn = document.getElementById('close-btn');
const modal = document.getElementById('info-modal');
const backdrop = document.getElementById('info-backdrop');

function openModal() {
  modal.classList.remove('hidden');
  backdrop.classList.remove('hidden');
  requestAnimationFrame(() => {
    backdrop.classList.remove('opacity-0');
    modal.classList.remove('opacity-0', 'translate-y-2');
  });
}

function closeModal() {
  backdrop.classList.add('opacity-0');
  modal.classList.add('opacity-0', 'translate-y-2');
  setTimeout(() => {
    modal.classList.add('hidden');
    backdrop.classList.add('hidden');
  }, 200);
}

infoBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);

let textTimeout = null;
let chillTimeout = null;
let countdownInterval = null;
let rateTimeout = null;
let honkCount = 0;

const chillMsg = document.getElementById('chill-toast');
const countdown = document.getElementById('countdown');

let audioCtx = null;
let audioBuffer = null;

async function initAudio() {
  if (audioBuffer) return;
  audioCtx = new AudioContext();
  const res = await fetch('/media/honk.mp3');
  const raw = await res.arrayBuffer();
  audioBuffer = await audioCtx.decodeAudioData(raw);
}

function playHonk() {
  if (!audioCtx || !audioBuffer) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  source.start(0, 1);
}

function showHonkText() {
  clearTimeout(textTimeout);
  honkText.classList.remove('show', 'hide');
  honkText.textContent = 'HONK!';

  requestAnimationFrame(() => {
    honkText.classList.add('show');
  });

  textTimeout = setTimeout(() => {
    honkText.classList.remove('show');
    honkText.classList.add('hide');
  }, 600);
}

function resetChill() {
  honkCount = 0;
  chillMsg.classList.remove('show');
  btn.disabled = false;
  clearInterval(countdownInterval);
}

async function triggerHonk() {
  if (btn.disabled) return;
  await initAudio();
  playHonk();
  showHonkText();

  goose.classList.remove('honking');
  void goose.offsetWidth;
  goose.classList.add('honking');
  goose.addEventListener('animationend', () => goose.classList.remove('honking'), { once: true });

  honkCount++;

  clearTimeout(rateTimeout);
  rateTimeout = setTimeout(() => { honkCount = 0; }, 1500);

  if (honkCount >= 5) {
    chillMsg.classList.add('show');
    btn.disabled = true;

    clearTimeout(chillTimeout);
    clearInterval(countdownInterval);

    let secs = 10;
    countdown.textContent = secs;
    countdownInterval = setInterval(() => {
      secs--;
      countdown.textContent = secs;
      if (secs <= 0) clearInterval(countdownInterval);
    }, 1000);

    chillTimeout = setTimeout(resetChill, 10000);
  }
}

btn.addEventListener('click', triggerHonk);
goose.addEventListener('click', triggerHonk);
