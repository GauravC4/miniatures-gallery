const carousel = document.querySelector(".carousel");
var projectCards = document.querySelectorAll(".card");
const navDotsContainer = document.querySelector(".nav-dots-container");
var navDots = document.querySelectorAll(".nav-dot");
const leftBtn = document.querySelector("#left-arrow");
const rightBtn = document.querySelector("#right-arrow");

var minis;
const positionClasses = ["prev-deck", "first", "second", "third", "next-deck"];
var currentWindow = { left: 0, right: 2 };

leftBtn.addEventListener("click", scroll);
rightBtn.addEventListener("click", scroll);

(function init() {
  loadProjects();
  leftBtn.style.visibility = "hidden";
})();

async function loadProjects() {
  let json = await fetch("./minis.json")
    .then((response) => response.json())
    .catch((error) => console.log(error));
  minis = json.minis;

  // dummy
  carousel.appendChild(createDomCard(null, 0, true));
  navDotsContainer.appendChild(createNavDotDom(0, true));

  minis.forEach((project, index) => {
    carousel.appendChild(createDomCard(project, index + 1));
    navDotsContainer.appendChild(createNavDotDom(index + 1));
  });

  // dummy
  carousel.appendChild(createDomCard(null, minis.length, true));
  navDotsContainer.appendChild(createNavDotDom(minis.length, true));

  projectCards = document.querySelectorAll(".card");
  navDots = document.querySelectorAll(".nav-dot");
}

function createDomCard(project, index, hidden) {
  var div = document.createElement("div");

  if (hidden) div.style.setProperty("opacity", 0, "important");
  div.classList.add("card");

  // add project info
  if (project) {
    let cardHead = document.createElement("div");
    cardHead.classList.add("card-head");
    cardHead.style.backgroundImage = `url('${project.img}')`;

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    let projectTitle = document.createElement("h2");
    projectTitle.classList.add("project-title");
    projectTitle.innerHTML = project.title;

    let projectDescription = document.createElement("p");
    projectDescription.classList.add("project-description");
    projectDescription.innerHTML = project.desc;

    cardBody.appendChild(projectTitle);
    cardBody.appendChild(projectDescription);

    div.appendChild(cardHead);
    div.appendChild(cardBody);
  }
  // first project must have second pos hence offset by +1
  if (index + 1 < positionClasses.length)
    div.classList.add(positionClasses[index + 1]);
  else div.classList.add("next-deck");

  if (index === 1) div.classList.add("focus");
  return div;
}

function createNavDotDom(index, hidden) {
  let div = document.createElement("div");
  if (hidden) div.style.setProperty("visibility", "hidden", "important");
  div.classList.add("nav-dot");
  if (index === 1) div.classList.add("nav-dot-focus");
  if (!hidden) {
    div.dataset.index = index;
    div.addEventListener("click", navigate);
  }
  return div;
}

function scroll($event, dir) {
  let offset = dir || ($event.target.id === "left-arrow" ? -1 : 1);
  if (
    currentWindow.left + offset <= -1 ||
    currentWindow.right + offset >= projectCards.length
  )
    return;
  currentWindow.left = currentWindow.left + offset;
  currentWindow.right = currentWindow.right + offset;
  updateFocus(currentWindow, offset);
  moveCard(currentWindow);
  moveNavDot(currentWindow);
  toggleDirectionBtn(currentWindow);
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

function moveNavDot(currentWindow) {
  for (let i = currentWindow.left; i <= currentWindow.right; i++) {
    navDots[i].classList.remove("nav-dot-focus");
  }
  navDots[(currentWindow.left + currentWindow.right) / 2].classList.add(
    "nav-dot-focus"
  );
}

function toggleDirectionBtn(currentWindow) {
  if (currentWindow.left <= 0) {
    leftBtn.style.visibility = "hidden";
  } else {
    leftBtn.style.visibility = "visible";
  }

  if (currentWindow.right >= projectCards.length - 1) {
    rightBtn.style.visibility = "hidden";
  } else {
    rightBtn.style.visibility = "visible";
  }
}

function navigate($event) {
  let targetPos = parseInt($event.target.dataset.index);
  let currentPos = (currentWindow.left + currentWindow.right) / 2;
  if (targetPos == currentPos) return;

  while (currentPos != targetPos) {
    scroll(null, targetPos > currentPos ? 1 : -1);
    currentPos = (currentWindow.left + currentWindow.right) / 2;
  }
}
