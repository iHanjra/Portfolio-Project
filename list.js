import { ids } from "./ids.js";
import { getDataHeader } from "./api.js";

//Target elements
const gameList = document.getElementById("game-list");
const genresList = document.getElementById("genres");

//Genres list
const genres = [];

//Random game button
const randomGame = document.getElementById("button");
randomGame.addEventListener("submit", (event) => {
  event.preventDefault();
  const index = Math.floor(Math.random() * ids.length);
  window.location.href = `./gamepage.html?id=${ids[index]}`;
});

//Filter titles by genre and display results
const css = document.getElementById("filter");
genresList.addEventListener("change", (event) => {
  event.preventDefault();
  if (genresList.value === "") css.innerHTML = "";
  else
    css.innerHTML = `#game-list li:not([data-genre="${genresList.value}"]) {display:none}`;
});

//Adds button that lets user jump back to top
const topBtn = document.getElementById("topBtn");
topBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

async function displayGameMeta(game) {
  const element = document.createElement("li");
  const link = document.createElement("a");
  link.setAttribute("href", `gamepage.html?id=${game.id}`);
  link.innerHTML = `<img src="https:${game.icon}" alt="${game.title}"/><h2>${game.title}</h2>`;
  element.appendChild(link);
  element.setAttribute("data-genre", game.genre);
  gameList.appendChild(element);
}

async function getData() {
  for (let i = 0; i < ids.length; i++) {
    const game = await getDataHeader(ids[i]);
    //If the Category property of the Properties object is not already in the genres array, it adds it to the genresList.
    if (!genres.includes(game.genre)) {
      genres.push(game.genre);
      const element = document.createElement("option");
      element.value = game.genre;
      element.innerHTML = game.genre;
      genresList.appendChild(element);
    }
    displayGameMeta(game);
  }
}

getData();
