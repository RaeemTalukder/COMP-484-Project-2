$(function () {
  // checks if buttons have been pressed//
  checkAndUpdatePetInfoInHtml();
  $('.treat-button').click(clickedTreatButton);
  $('.play-button').click(clickedPlayButton);
  $('.exercise-button').click(clickedExerciseButton);
  $('.sleep-button').click(clickedSleepButton);
  //JQuera 1 .data()
  //uses data to store cooldowns and busy state of pet to prevent animation and stat conflicts//
  $(".pet-image").data("busy", false);
  $(".pet-image").data("cooldowns", {});

  // name input

  $(".name-input").on("keypress", function (e) {
    if (e.which === 13) {
      const name = $(this).val().trim();
      if (!name) return;

      pet_info.name = name;
      $(".name").text(name);
      $(".name-section").fadeOut(200);
    }
  });

});

//pet info to store variables for pet stats and name//
var pet_info = {
  name: "My Pet",
  weight: 50,
  happiness: 50,
  energy: 100
};
//This function is to prevent stats from going out of bounds and breaking the game//
function clampStats() {
  pet_info.weight = Math.max(0, Math.min(999, pet_info.weight));
  pet_info.happiness = Math.max(0, Math.min(100, pet_info.happiness));
  pet_info.energy = Math.max(0, Math.min(100, pet_info.energy));
}

//.data is used to store cooldowns and busy state of pet to prevent animation and stat conflicts//
function isBusy() {
  return $(".pet-image").data("busy");
}
//energy check function to prevent actions when energy is too low//
function hasEnergy(a) {
  return pet_info.energy >= a;
}
//cooldown system using .data to store cooldowns and check if actions are on cooldown//
function setCooldown(action, duration) {
  let cd = $(".pet-image").data("cooldowns");
  cd[action] = Date.now() + duration;
  $(".pet-image").data("cooldowns", cd);
//essentially the duration is put in and it is used to fill the cooldown bar and then reset it after the duration is up//
  let start = Date.now();
  let interval = setInterval(() => {
    let pct = ((Date.now() - start) / duration) * 100;
    $("." + action + "-fill").css("width", pct + "%");
    if (pct >= 100) clearInterval(interval);
  }, 50);
//reset cooldown bar after duration is up//
  setTimeout(() => {
    $("." + action + "-fill").css("width", "0%");
  }, duration);
}
//check if action is on cooldown//
function isOnCooldown(action) {
  let cd = $(".pet-image").data("cooldowns");
  return cd[action] && Date.now() < cd[action];
}

//function for when treat button is clicked, checks if pet is busy or on cooldown or has enough energy, then updates stats and plays animation//
function clickedTreatButton() {
  if (isBusy() || isOnCooldown("treat") || !hasEnergy(1)) return;

  pet_info.happiness += 10;
  pet_info.weight += 10;
  pet_info.energy -= 10;


  setCooldown("treat", 3000);
  playGif("puffle-chew.gif", "bounce", 3000);

  checkAndUpdatePetInfoInHtml();
}
//function for when play button is clicked, checks if pet is busy or on cooldown or has enough energy, then updates stats and plays animation//
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

//update stats in html and clamp them to prevent out of bounds, also updates pet appearance based on stats//
function checkAndUpdatePetInfoInHtml() {
  clampStats();
  $(".name").text(pet_info.name);
  $(".weight").text(pet_info.weight);
  $(".happiness").text(pet_info.happiness);
  $(".energy").text(pet_info.energy);
  $(".energy-fill").css("width", pet_info.energy + "%");

  updatePetAppearance();
}
//function to update pet appearance based on stats, changes image source based on weight and happiness//
function updatePetAppearance() {
  if (isBusy()) return;

  if (pet_info.weight > 120) {
    $(".pet-image").attr("src", "images/fat-puffle.png");
  } else if (pet_info.happiness < 20) {
    $(".pet-image").attr("src", "images/sad-puffle.png");
  } else if (pet_info.happiness > 80) {
    $(".pet-image").attr("src", "images/happy-puffle.png");
  } else {
    $(".pet-image").attr("src", "images/puffle.png");
  }
}
//play gif when button is pressed, takes in gif name, animation type, and duration, uses jQuery animate to create different animations based on type, and sets busy state to prevent other actions during animation//

function playGif(gif, type, duration) {
  let pet = $(".pet-image");
//set busy state to prevent other actions during animation//
  $(".pet-image").data("busy", true);
//stop any current animations and reset position to prevent stacking animations//
  // change image
  pet.attr("src", "images/" + gif);

//JQUERY 2 .animate()
//move pet up and down for bounce animation//
  if (type === "bounce") {
    pet.animate({ top: "-40px" }, 150)
       .animate({ top: "0px" }, 150);
  }
//shake pet left and right for shake animation//
  else if (type === "shake") {
    pet.animate({ left: "-20px" }, 80)
       .animate({ left: "20px" }, 80)
       .animate({ left: "-10px" }, 80)
       .animate({ left: "10px" }, 80)
       .animate({ left: "0px" }, 80);
  }
//make pet grow and shrink for grow animation//
  else if (type === "grow") {
    pet.animate({ width: "280px", height: "280px" }, 200)
       .animate({ width: "250px", height: "250px" }, 200);
  }
//spin pet for spin animation//
  else if (type === "spin") {
    pet.css({ transform: "rotate(0deg)" });

    $({ deg: 0 }).animate({ deg: 360 }, {
      duration: duration,
      step: function (now) {
        pet.css("transform", "rotate(" + now + "deg)");
      }
    });
  }

//after animation is done, reset busy state and update pet info in html to reflect any changes that may have occurred during animation//
  setTimeout(() => {
    $(".pet-image").data("busy", false);
    checkAndUpdatePetInfoInHtml();
  }, duration);
}
