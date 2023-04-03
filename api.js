export async function getDataHeader(id, full = false) {
  const game = {
    id: id,
    title: "",
    icon: "",
    genre: "",
    features: [],
  };
  await fetch(
    `https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=${id}&market=US&languages=en-us&MS-CV=DGU1mcuYo0WMMp+F.1`
  )
    .then((response) => response.json())
    .then((data) => {
      const LocalizedProperties = data.Products[0].LocalizedProperties[0];
      const Properties = data.Products[0].Properties;
      game.title = LocalizedProperties.ProductTitle;
      game.genre = Properties.Category;

      //Loops through the Images array and sets the image property of the game object to the first image that has an ImagePurpose of "FeaturePromotionalSquareArt"
      for (const image of LocalizedProperties.Images)
        if (image.ImagePurpose === "FeaturePromotionalSquareArt") {
          game.icon = image.Uri;
          break;
        }

      //Loops through the Attributes array and adds each Name property to the features array of the game object.
      for (const feature of Properties.Attributes)
        game.features.push(feature.Name);

      if (full) {
        const MarketProperties = data.Products[0].MarketProperties[0];

        //Create new game object with values from LocalizedProperties, MarketProperties, Properties objects
        game.bannerImage = "";
        game.screenshots = [];
        game.developer = LocalizedProperties.DeveloperName;
        game.publisher = LocalizedProperties.PublisherName;
        game.productDescription = LocalizedProperties.ProductDescription;
        game.originalReleaseDate =
          MarketProperties.OriginalReleaseDate.substring(0, 10);

        //Loops through the Images array and sets the image property of the game object to the first image that has an ImagePurpose of "FeaturePromotionalSquareArt"
        for (const image of LocalizedProperties.Images)
          if (image.ImagePurpose === "FeaturePromotionalSquareArt") {
            game.image = image.Uri;
            break;
          }

        //Loops through the Images array and adds all screenshots to the game object
        //Need to target just desktop or Xbox images so there are no duplicates
        for (const image of LocalizedProperties.Images)
          if (image.ImagePurpose === "Screenshot") {
            game.screenshots.push(image.Uri);
          }

        //Loops through the Images array and sets the image property of the game object to the first image that has an ImagePurpose of "SuperHeroArt"
        for (const image of LocalizedProperties.Images)
          if (image.ImagePurpose === "SuperHeroArt") {
            game.bannerImage = image.Uri;
            break;
          }

        //Loops through the ContentRatings array and sets the esrb property of the game object to the first rating that has a RatingSystem of "ESRB"
        const ratings = MarketProperties.ContentRatings;
        for (let i = 0; i < ratings.length; i++)
          if (ratings[i].RatingSystem === "ESRB") {
            game.esrb = ratings[i].RatingId;
            break;
          }
      }
    });
  return game;
}
