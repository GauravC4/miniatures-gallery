const carousel = document.querySelector(".carousel");
var projectCards = document.querySelectorAll(".card");
const leftBtn = document.querySelector("#left-arrow");
const rightBtn = document.querySelector("#right-arrow");

var minis;
const inWindowClasses = ["first", "second", "third"];

(function init() {
  loadProjects();
})();

async function loadProjects() {
  let json = await fetch("./minis.json")
    .then((response) => response.json())
    .catch((error) => console.log(error));
  minis = json.minis;
  minis.forEach((project, index) => {
    carousel.appendChild(createDomCard(project, index));
  });
  projectCards = document.querySelectorAll(".card");
}

function createDomCard(project, index) {
  var div = document.createElement("div");
  div.classList.add("card");
  div.innerHTML = project.title;
  if (index < inWindowClasses.length) div.classList.add(inWindowClasses[index]);
  else div.classList.add("next-deck");
  if (index === 0) div.classList.add("focus");
  return div;
}
