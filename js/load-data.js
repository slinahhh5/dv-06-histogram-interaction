// Load the CSV file with a row conversion function
d3.csv("data/Ex6_TVdata_withStar.csv", d => ({
  brand: d.brand,                           // text stays a string
  model: d.model,
  screenSize: +d.screenSize,                // + converts the text to a number
  screenTech: d.screenTech,
  star: +d.star,
  energyConsumption: +d.energyConsumption
})).then(data => {
  // Log the processed data to the console to check it
  console.log(data);

  // Call the functions that use the data once it is loaded
  drawHistogram(data);
  populateFilters(data);

}).catch(error => {
  console.error("Error loading the CSV file:", error);
});

