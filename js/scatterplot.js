const drawScatterplot = (data) => {

  // Select the container and add a responsive svg
  const svg = d3.select("#scatterplot")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  // Create the inner chart group moved by the left and top margins
  // innerChartS is declared in shared-constants.js, so it is NOT declared with const here
  innerChartS = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Calculate the maximum star rating and energy consumption (used for the scale domains)
  const maxStar = d3.max(data, d => d.star);
  const maxEnergy = d3.max(data, d => d.energyConsumption);

  // Set the x scale: star rating on the x-axis
  xScaleS
    .domain([0, maxStar])
    .range([0, innerWidth]);

  // Set the y scale: energy consumption on the y-axis
  // The range is upside down because svg y values grow downwards
  yScaleS
    .domain([0, maxEnergy])
    .range([innerHeight, 0])
    .nice();   // round the top of the axis to a human-readable value

  // Set up the colour scale: one hue per screen type
  // Hue shows differences between categories; saturation would wrongly suggest a difference in size
  colorScale
    .domain(["LED", "LCD", "OLED"])
    .range(d3.schemeCategory10);   // the first three colours are blue, orange and green

  // Draw one circle for every TV
  innerChartS
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("class", "dot")
      .attr("cx", d => xScaleS(d.star))
      .attr("cy", d => yScaleS(d.energyConsumption))
      .attr("r", 3)
      .attr("fill", d => colorScale(d.screenTech))
      // Semi-transparent circles make overlapping points easier to see (no stroke is used)
      .attr("opacity", 0.5);

  // Add the x-axis at the bottom of the inner chart
  innerChartS
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScaleS).ticks(8));

  // Add the y-axis
  innerChartS
    .append("g")
      .call(d3.axisLeft(yScaleS).ticks(14).tickFormat(d3.format(",")));

  // Add the x-axis label under the axis, aligned to the right end
  innerChartS
    .append("text")
      .attr("class", "axis-label")
      .text("Star Rating")
      .attr("x", innerWidth)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "end");

  // Add the y-axis label, rotated so it runs vertically along the axis
  innerChartS
    .append("text")
      .attr("class", "axis-label")
      .text("Labeled Energy Consumption (kWh/year)")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)         // after the rotation x moves the text up and down
      .attr("y", -margin.left + 15)        // after the rotation y moves the text left and right
      .attr("text-anchor", "middle");

  // Add a legend in the top right corner of the svg
  const legend = svg
    .append("g")
      .attr("transform", `translate(${width - 100}, ${margin.top})`);

  // Loop through the colour scale domain to create one legend entry per screen type
  colorScale.domain().forEach((screenTech, i) => {

    // Create a group for each legend entry and space the rows 20 px apart
    const legendRow = legend
      .append("g")
        .attr("transform", `translate(0, ${i * 20})`);

    // Add a coloured rectangle
    legendRow
      .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", colorScale(screenTech));

    // Add the label next to the rectangle
    legendRow
      .append("text")
        .attr("x", 20)                        // position the text to the right of the rectangle
        .attr("y", 5)                         // centre the text on the rectangle
        .attr("text-anchor", "start")
        .style("alignment-baseline", "middle")
        .style("font-size", "12px")
        .text(screenTech);
  });

};
