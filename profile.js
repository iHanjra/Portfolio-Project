import { getDataHeader } from "./api.js";
import { ids } from "./ids.js";

//Get part of the url that's after question mark
const params = new URLSearchParams(window.location.search);
const game = await getDataHeader(params.get("id"), true);

//Random game button
const randomGame = document.getElementById("button");
randomGame.addEventListener("submit", (event) => {
  event.preventDefault();
  const index = Math.floor(Math.random() * ids.length);
  window.location.href = `./gamepage.html?id=${ids[index]}`;
});

const h2 = document.querySelector("h2");
h2.textContent = game.title;

const banner = document.querySelector(".banner");
banner.innerHTML = `<img src="https:${game.bannerImage}" alt="${game.title}"/>`;

const article = document.querySelector("article");
article.innerHTML = `${game.productDescription}`;

const tagCloud = document.querySelector(".tag-cloud");
for (let i = 0; i < game.features.length; i++) {
  const tag = document.createElement("li");
  tag.textContent = game.features[i];
  tagCloud.append(tag);
}

const developer = document.querySelector("#developer");
developer.innerHTML = `Developer: ${game.developer}`;

const publisher = document.querySelector("#publisher");
publisher.innerHTML = `Publisher: ${game.publisher}`;

const genre = document.querySelector("#genre");
genre.innerHTML = `Genre: ${game.genre}`;

const releaseDate = document.querySelector("#release-date");
releaseDate.innerHTML = `Release Date: ${game.originalReleaseDate}`;

//Add screenshots to carousel
const screenshots = document.querySelector("#screenshots");
for (const screenshot of game.screenshots) {
  const img = document.createElement("img");
  img.src = `https:${screenshot}`;
  img.alt = game.title;
  screenshots.append(img);
}

//Allows user to click on screenshot to see full size image and click on it to return to game page
const allScreenshots = document.querySelectorAll("#screenshots img");
for (const screenshot of allScreenshots) {
  screenshot.addEventListener("click", () => {
    const fullSizeImage = document.createElement("img");
    fullSizeImage.src = screenshot.src;
    fullSizeImage.classList.add("full-size-image");

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.appendChild(fullSizeImage);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        overlay.remove();
      }
    });
  });

  //Adds button that lets user jump back to top
  const topBtn = document.getElementById("topBtn");
  topBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
