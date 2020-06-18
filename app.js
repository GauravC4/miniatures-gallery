const carousel = document.querySelector(".carousel");
var projectCards = document.querySelectorAll(".card");
const leftBtn = document.querySelector("#left-arrow");
const rightBtn = document.querySelector("#right-arrow");

var minis;
const positionClasses = ["prev-deck", "first", "second", "third", "next-deck"];
var currentWindow = { left: -1, right: 1 };

leftBtn.addEventListener("click", scroll);
rightBtn.addEventListener("click", scroll);

(function init() {
  loadProjects();
})();

async function loadProjects() {
  let json = await fetch("./minis.json")
    .then((response) => response.json())
    .catch((error) => console.log(error));
  minis = json.minis;
  // dummy
  carousel.appendChild(createDomCard(null, 0, 0));
  minis.forEach((project, index) => {
    carousel.appendChild(createDomCard(project, index + 1));
  });
  // dummy
  carousel.appendChild(createDomCard(null, minis.length, 0));
  projectCards = document.querySelectorAll(".card");
}

function createDomCard(project, index, opacity) {
  var div = document.createElement("div");
  if (opacity === 0) div.style.setProperty("opacity", 0, "important");
  div.classList.add("card");
  if (project) div.innerHTML = project.title;
  // first project must have second pos hence offset by +1
  if (index + 1 < positionClasses.length)
    div.classList.add(positionClasses[index + 1]);
  else div.classList.add("next-deck");
  if (index === 1) div.classList.add("focus");
  return div;
}

function scroll($event) {
  let offset = $event.target.id === "left-arrow" ? -1 : 1;
  if (
    currentWindow.left + offset <= -1 ||
    currentWindow.right + offset >= projectCards.length
  )
    return;
  currentWindow.left = currentWindow.left + offset;
  currentWindow.right = currentWindow.right + offset;
  updateFocus(currentWindow, offset);
  moveCard(currentWindow);
}

function updateFocus(currentWindow, offset) {
  if (offset > 0) projectCards[currentWindow.left].classList.remove("focus");
  else projectCards[currentWindow.right].classList.remove("focus");
  projectCards[(currentWindow.left + currentWindow.right) / 2].classList.add(
    "focus"
  );
}

function moveCard(currentWindow) {
  for (
    let i = currentWindow.left - 1, j = 0;
    i <= currentWindow.right + 1;
    i++
  ) {
    if (i > -1 && i < projectCards.length) {
      projectCards[i].classList.remove(...positionClasses);
      projectCards[i].classList.add(positionClasses[j]);
    }
    j++;
  }
}
