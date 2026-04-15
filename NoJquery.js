// Wait for DOM to load//
document.addEventListener("DOMContentLoaded", () => {
// initial UI update 
  checkAndUpdatePetInfoInHtml();

  document.querySelector(".treat-button").addEventListener("click", clickedTreatButton);
  document.querySelector(".play-button").addEventListener("click", clickedPlayButton);
  document.querySelector(".exercise-button").addEventListener("click", clickedExerciseButton);
  document.querySelector(".sleep-button").addEventListener("click", clickedSleepButton);

  const pet = document.querySelector(".pet-image");

  // replace jQuery .data()
  pet.busy = false;
  pet.cooldowns = {};

  // name input
  document.querySelector(".name-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const name = e.target.value.trim();
      if (!name) return;

      pet_info.name = name;
      document.querySelector(".name").textContent = name;
      document.querySelector(".name-section").style.display = "none";
    }
  });
});

// PET DATA
let pet_info = {
  name: "My Pet",
  weight: 50,
  happiness: 50,
  energy: 100
};

// clamp stats
function clampStats() {
  pet_info.weight = Math.max(0, Math.min(999, pet_info.weight));
  pet_info.happiness = Math.max(0, Math.min(100, pet_info.happiness));
  pet_info.energy = Math.max(0, Math.min(100, pet_info.energy));
}

function getPet() {
  return document.querySelector(".pet-image");
}

function isBusy() {
  return getPet().busy;
}

function hasEnergy(a) {
  return pet_info.energy >= a;
}

// cooldown system
function setCooldown(action, duration) {
  const pet = getPet();
  pet.cooldowns[action] = Date.now() + duration;

  const fill = document.querySelector(`.${action}-fill`);
  const start = Date.now();

  const interval = setInterval(() => {
    let pct = ((Date.now() - start) / duration) * 100;
    fill.style.width = pct + "%";
    if (pct >= 100) clearInterval(interval);
  }, 50);

  setTimeout(() => {
    fill.style.width = "0%";
  }, duration);
}

function isOnCooldown(action) {
  const pet = getPet();
  return pet.cooldowns[action] && Date.now() < pet.cooldowns[action];
}


//clicked treat button function, checks if pet is busy or on cooldown or has enough energy, then updates stats and plays animation//
function clickedTreatButton() {
  if (isBusy() || isOnCooldown("treat") || !hasEnergy(1)) return;

  pet_info.happiness += 10;
  pet_info.weight += 10;
  pet_info.energy -= 10;

  setCooldown("treat", 3000);
  playGif("puffle-chew.gif", "bounce", 3000);

  checkAndUpdatePetInfoInHtml();
}
//  function for when play button is clicked, checks if pet is busy or on cooldown or has enough energy, then updates stats and plays animation//
function clickedPlayButton() {
  if (isBusy() || isOnCooldown("play") || !hasEnergy(2)) return;

  pet_info.happiness += 10;
  pet_info.weight -= 10;
  pet_info.energy -= 20;

  setCooldown("play", 10000);
  playGif("puffle-play.gif", "shake", 10000);

  checkAndUpdatePetInfoInHtml();
}
//function for when exercise button is clicked, checks if pet is busy or on cooldown or has enough energy, then updates stats and plays animation//
function clickedExerciseButton() {
  if (isBusy() || isOnCooldown("exercise") || !hasEnergy(3)) return;

  pet_info.happiness -= 10;
  pet_info.weight -= 10;
  pet_info.energy -= 30;

  setCooldown("exercise", 5000);
  playGif("puffle-exercise.gif", "grow", 5000);

  checkAndUpdatePetInfoInHtml();
}
//function for when sleep button is clicked, checks if pet is busy or on cooldown, then updates stats and plays animation//
function clickedSleepButton() {
  if (isBusy() || isOnCooldown("sleep")) return;

  pet_info.energy += 100;

  setCooldown("sleep", 5000);
  playGif("puffle-sleep.png", "spin", 5000);

  checkAndUpdatePetInfoInHtml();
}

// UPDATE UI

function checkAndUpdatePetInfoInHtml() {
  clampStats();
// update stats in HTML
  document.querySelector(".name").textContent = pet_info.name;
  document.querySelector(".weight").textContent = pet_info.weight;
  document.querySelector(".happiness").textContent = pet_info.happiness;
  document.querySelector(".energy").textContent = pet_info.energy;


  updatePetAppearance();
}
// update pet image based on weight and happiness, but only if not busy with an animation//
function updatePetAppearance() {
  const pet = getPet();
  if (pet.busy) return;

  if (pet_info.weight > 120) {
    pet.src = "images/fat-puffle.png";
  } else if (pet_info.happiness < 20) {
    pet.src = "images/sad-puffle.png";
  } else if (pet_info.happiness > 80) {
    pet.src = "images/happy-puffle.png";
  } else {
    pet.src = "images/puffle.png";
  }
}

// ANIMATIONS

function playGif(gif, type, duration) {
  const pet = getPet();
  pet.busy = true;

  pet.src = "images/" + gif;
// simple animations without jQuery, using CSS transitions and JS timeouts
  if (type === "bounce") {
    pet.style.transition = "transform 0.15s";
    pet.style.transform = "translateY(-40px)";
    setTimeout(() => {
      pet.style.transform = "translateY(0px)";
    }, 150);
  }
// shake animation using translateX and a sequence of timeouts
  else if (type === "shake") {
    let positions = [-20, 20, -10, 10, 0];
    let i = 0;

    function shake() {
      if (i >= positions.length) return;
      pet.style.transform = `translateX(${positions[i]}px)`;
      i++;
      setTimeout(shake, 80);
    }
    shake();
  }
// grow animation using CSS transitions to scale the image up and then back down
  else if (type === "grow") {
    pet.style.transition = "all 0.2s";
    pet.style.width = "280px";
    pet.style.height = "280px";

    setTimeout(() => {
      pet.style.width = "250px";
      pet.style.height = "250px";
    }, 200);
  }
//  spin animation using requestAnimationFrame to rotate the image continuously for the duration of the animation
  else if (type === "spin") {
    let start = null;

    function rotate(timestamp) {
      if (!start) start = timestamp;
      let progress = timestamp - start;
      let deg = (progress / duration) * 360;

      pet.style.transform = `rotate(${deg}deg)`;

      if (progress < duration) {
        requestAnimationFrame(rotate);
      }
    }

    requestAnimationFrame(rotate);
  }
// after animation is done, reset busy state and update pet info in html to reflect any changes that may have occurred during animation//
  setTimeout(() => {
    pet.busy = false;
    pet.style.transform = "none";
    checkAndUpdatePetInfoInHtml();
  }, duration);
}
