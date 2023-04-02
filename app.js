import { ids } from "./ids.js";

//Dom elements
const gameList = document.getElementById("game-list");/*<ul id="game-list"></ul>;*/
const genresList = document.getElementById("genres");/*<select id="genres" name="genre">*/
const featuresList = document.getElementById("features");/*<select id="features" name="features">*/

//Data
const genres = [];
const games = new Array(ids.length);
const features = [];

function extractGameData(product) {
  //Extract objects with information from product
  const LocalizedProperties = product.Products[0].LocalizedProperties[0];
  const MarketProperties = product.Products[0].MarketProperties[0];
  const Properties = product.Products[0].Properties;

  //Create new game object with values from LocalizedProperties, MarketProperties, Properties objects
  const game = {
    title: LocalizedProperties.ProductTitle,
    genre: Properties.Category,
    image: "",
    features: [],
    developer: LocalizedProperties.DeveloperName,
    publisher: LocalizedProperties.PublisherName,
    productDescription: LocalizedProperties.ProductDescription,
    originalReleaseDate: MarketProperties.OriginalReleaseDate.substring(0, 10),
  };

  //Loops through the Images array of the LocalizedProperties object and sets the image property of the game object to the first image that has an ImagePurpose of "FeaturePromotionalSquareArt"
  for (const image of LocalizedProperties.Images)
    if (image.ImagePurpose === "FeaturePromotionalSquareArt") {
      game.image = image.Uri;
      break;
    }

  //Loops through the ContentRatings array of the MarketProperties object and sets the esrb property of the game object to the first rating that has a RatingSystem of "ESRB"
  const ratings = MarketProperties.ContentRatings;
  for (let i = 0; i < ratings.length; i++) {
    if (ratings[i].RatingSystem === "ESRB") {
      game.esrb = ratings[i].RatingId;
      break;
    }
  }

  //Loops through the Attributes array and adds each Name property to the features array of the game object. If the Name property is not already in the features array, it adds it to the featuresList select element on the page:
  for (const feature of Properties.Attributes) {
    game.features.push(feature.Name);
    if (!features.includes(feature.Name)) {
      features.push(feature.Name);
      const element = document.createElement("option");
      element.value = feature.Name;
      element.innerHTML = feature.Name;
      if (featuresList) {
      featuresList.appendChild(element)
      };
    }
  }
  //If the Category property of the Properties object is not already in the genres array, it adds it to the genresList page
  if (!genres.includes(Properties.Category)) {
    genres.push(Properties.Category);
    const element = document.createElement("option");
    element.value = Properties.Category;
    element.innerHTML = Properties.Category;
    if (genresList) {
    genresList.appendChild(element)
    };
  }
  displayGameMeta(game);
}

// Re-populates the game list after filter is applied
function refreshGameList() {
  gameList.innerHTML = ""; // Clear previous game elements
  for (const game of games) displayGameMeta(game);
}

// Creates link element for each game in the game list
function createGameLink(game) {
  const link = document.createElement("a");
  link.setAttribute("data-game", JSON.stringify(game));
  link.innerHTML = `<img src="https:${game.image}" alt="${game.title}"/><h2>${game.title}</h2>`;
  return link;
}

//When user clicks on single game it redirects to specfic game page
function addGameLinkClickHandler(link) {
  const handler = (event) => {
    event.preventDefault(); // prevent default behavior of following the link
    const game = JSON.parse(link.getAttribute("data-game"));
    localStorage.setItem("game", JSON.stringify(game));
    window.location.href = "gamepage.html"; // redirect to gamepage.html
  };
  link.addEventListener("click", handler);
  return handler;
}

function displayGameMeta(game) {
  const element = document.createElement("li");
  const link = createGameLink(game);
  addGameLinkClickHandler(link);
  element.appendChild(link);
  if (gameList) {
  gameList.appendChild(element)
  };
}

//game object after click
const gameString = localStorage.getItem("game");
const game = JSON.parse(gameString);

const h2 = document.querySelector("h2");
if (h2) {
    h2.textContent = game.title
};

const banner = document.querySelector(".banner");
if (banner) {
    banner.innerHTML = `<img src="https:${game.image}" alt="${game.title}"/>`
};

const article = document.querySelector("article");
if (article) {
    article.innerHTML = `${game.productDescription}`
};

const tagCloud = document.querySelector(".tag-cloud");
for (let i = 0; i < game.features.length; i++) {
    const tag = document.createElement("li");
    tag.textContent = game.features[i]
    if (tagCloud) {
    tagCloud.append(tag)
    }
};

const developer = document.querySelector("#developer");
if (developer) {
    developer.innerHTML = `DEVELOPER: ${game.developer}`
};

const publisher = document.querySelector("#publisher");
if (publisher) {
    publisher.innerHTML = `PUBLISHER: ${game.publisher}`
};

const genre = document.querySelector("#genre");
if (genre) {
    genre.innerHTML = `GENRE: ${game.genre}`
};

const releaseDate = document.querySelector("#release-date");
if (releaseDate) {
    releaseDate.innerHTML = `RELEASE DATE: ${game.originalReleaseDate}`
};


// Add click event to every game on landing page
const gameElements = document.querySelectorAll("#game-list li a");
for (const element of gameElements) {
  addGameLinkClickHandler(element);
}

async function getData() {
  for (let i = 0; i < ids.length; i++) {
    await fetch(
      `https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=${ids[i]}&market=US&languages=en-us&MS-CV=DGU1mcuYo0WMMp+F.1`
    )
      .then((response) => response.json())
      .then((data) => {
        games[i] = extractGameData(data);
      });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  getData();
});

/*
	On the landing page we only need to fetch the data that's relevant to us for searching.
	We only need to fetch stuff like the developer, publisher, and description on the page
	that shows in-depth information about each game.
*/
