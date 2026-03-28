const alleKaarten = document.querySelectorAll(".memory-card");
const timerDisplay = document.querySelector("#timer");
const scoreDisplay = document.querySelector("#score");
const resetBtn = document.querySelector("#reset-btn");

let heeftGedraaid = false;
let bordBlokkering = false;
let eersteKaart, tweedeKaart;

let seconden = 0;
let timerInterval = null;
let gevondenParen = 0;
let spelBezig = false;

function draaiKaart() {
  if (bordBlokkering) return;
  if (this === eersteKaart) return;

  if (!spelBezig) {
    spelBezig = true;
    startTimer();
  }

  this.classList.add("flip");

  if (!heeftGedraaid) {
    heeftGedraaid = true;
    eersteKaart = this;
    return;
  }

  tweedeKaart = this;
  controleerMatch();
}

function controleerMatch() {
  let isMatch = eersteKaart.dataset.naam === tweedeKaart.dataset.naam;
  isMatch ? zetVast() : draaiTerug();
}

function zetVast() {
  eersteKaart.removeEventListener("click", draaiKaart);
  tweedeKaart.removeEventListener("click", draaiKaart);

  gevondenParen++;
  scoreDisplay.textContent = gevondenParen;

  if (gevondenParen === 3) {
    clearInterval(timerInterval);
    setTimeout(() => {
      alert(`Top! Je hebt alle bowls gevonden in ${timerDisplay.textContent}!`);
    }, 500);
  }

  resetBeurt();
}

function draaiTerug() {
  bordBlokkering = true;
  setTimeout(() => {
    eersteKaart.classList.remove("flip");
    tweedeKaart.classList.remove("flip");
    resetBeurt();
  }, 1000);
}

function resetBeurt() {
  [heeftGedraaid, bordBlokkering] = [false, false];
  [eersteKaart, tweedeKaart] = [null, null];
}

function startTimer() {
  seconden = 0;
  timerInterval = setInterval(() => {
    seconden++;
    let min = Math.floor(seconden / 60);
    let sec = seconden % 60;

    let minStr = min < 10 ? "0" + min : min;
    let secStr = sec < 10 ? "0" + sec : sec;

    timerDisplay.textContent = `${minStr}:${secStr}`;
  }, 1000);
}

function shuffle() {
  alleKaarten.forEach((kaart) => {
    let randomPositie = Math.floor(Math.random() * 6);
    kaart.style.order = randomPositie;
  });
}

function herstartSpel() {
  clearInterval(timerInterval);
  spelBezig = false;
  seconden = 0;
  gevondenParen = 0;
  timerDisplay.textContent = "00:00";
  scoreDisplay.textContent = "0";

  alleKaarten.forEach((kaart) => {
    kaart.classList.remove("flip");
    kaart.addEventListener("click", draaiKaart);
  });

  setTimeout(shuffle, 600);
}

shuffle();
alleKaarten.forEach((kaart) => kaart.addEventListener("click", draaiKaart));
resetBtn.addEventListener("click", herstartSpel);
