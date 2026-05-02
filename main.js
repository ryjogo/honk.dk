const btn = document.getElementById('honk-btn');
const goose = document.getElementById('goose');
const honkText = document.getElementById('honk-text');

let textTimeout = null;
let chillTimeout = null;
let countdownInterval = null;
let rateTimeout = null;
let honkCount = 0;

const chillMsg = document.getElementById('chill-msg');
const countdown = document.getElementById('countdown');
const honkAudio = new Audio('/honk.mp3');

function playHonk() {
  honkAudio.currentTime = 1;
  honkAudio.play();
}

function showHonkText() {
  clearTimeout(textTimeout);
  honkText.className = 'honk-text';
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

function triggerHonk() {
  if (btn.disabled) return;
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
