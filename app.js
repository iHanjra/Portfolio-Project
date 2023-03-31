import { ids } from "./ids.js";

const gameList = document.getElementById("game-list");
const genresList = document.getElementById("genres");
const featuresList = document.getElementById("features");
const genres = [];
const games = new Array(ids.length);
const features = [];

function extractGameData(product) {
  const LocalizedProperties = product.Products[0].LocalizedProperties[0];
  const MarketProperties = product.Products[0].MarketProperties[0];
  const Properties = product.Products[0].Properties;

  const game = {
    title: LocalizedProperties.ProductTitle,
    genre: Properties.Category,
    image: "",
    features: [],
  };
  
  for (const image of LocalizedProperties.Images)
    if (image.ImagePurpose === "FeaturePromotionalSquareArt") {
      game.image = image.Uri;
      break;
    }

  const ratings = MarketProperties.ContentRatings;
  for (let i = 0; i < ratings.length; i++) {
    if (ratings[i].RatingSystem === "ESRB") {
      game.esrb = ratings[i].RatingId;
      break;
    }
  }
  
  for (const feature of Properties.Attributes) {
    game.features.push(feature.Name);
    if (!features.includes(feature.Name)) {
      features.push(feature.Name);
      const element = document.createElement("option");
      element.value = feature.Name;
      element.innerHTML = feature.Name;
      featuresList.appendChild(element);
    }
  }
  if (!genres.includes(Properties.Category)) {
    genres.push(Properties.Category);
    const element = document.createElement("option");
    element.value = Properties.Category;
    element.innerHTML = Properties.Category;
    genresList.appendChild(element);
  }
  displayGameMeta(game);
  return game;
}

// Re-populates the game list after filter is applied
function refreshGameList() {
  gameList.innerHTML = ""; // Clear previous game elements
  for (const game of games) displayGameMeta(game);
}
// Creates element for game in the game list
function displayGameMeta(game) {
  const element = document.createElement("li");
  element.innerHTML = `<img src="https:${game.image}" alt="${game.title}"/><h2>${game.title}</h2>`;
  gameList.appendChild(element);
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
getData();