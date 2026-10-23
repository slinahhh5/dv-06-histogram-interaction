const drawHistogram = (data) => {

  // Select the container and add a responsive svg
  const svg = d3.select("#histogram")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  // Create an inner chart group moved by the left and top margins
  const innerChart = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Create the bins from the data using the generator in shared-constants.js
  const bins = binGenerator(data);
  console.log(bins);

  // Calculate the minimum and maximum energy consumption values from the bins (xScale domain)
  const minEng = bins[0].x0;                       // lower bound of the first bin
  const maxEng = bins[bins.length - 1].x1;         // upper bound of the last bin

  // Calculate the maximum number of TVs in one bin (yScale domain)
  const binsMaxLength = d3.max(bins, d => d.length);

  console.log("minEng:", minEng, "maxEng:", maxEng, "binsMaxLength:", binsMaxLength);

  // Set the domains and ranges of the x and y scales
  xScale
    .domain([minEng, maxEng])
    .range([0, innerWidth]);

  yScale
    .domain([0, binsMaxLength])
    .range([innerHeight, 0])   // upside down because svg y values grow downwards
    .nice();                   // round the y-axis values to a human-readable format

  // Draw the bars: one rect per bin
  innerChart
    .selectAll("rect")
    .data(bins)
    .join("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("width", d => xScale(d.x1) - xScale(d.x0))
      .attr("height", d => innerHeight - yScale(d.length))
      .attr("fill", barColor)
      // The stroke uses the background colour so it looks like a gap between bars
      .attr("stroke", bodyBackgroundColor)
      .attr("stroke-width", 2);

  // Add the x-axis at the bottom of the inner chart
  innerChart
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(14).tickFormat(d3.format(",")));

  // Add the y-axis
  innerChart
    .append("g")
      .call(d3.axisLeft(yScale).ticks(14).tickFormat(d3.format(",")));

  // Add the x-axis label under the axis, aligned to the right end
  innerChart
    .append("text")
      .attr("class", "axis-label")
      .text("Labeled Energy Consumption (kWh/year)")
      .attr("x", innerWidth)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "end");

  // Add the y-axis label above the axis
  innerChart
    .append("text")
      .attr("class", "axis-label")
      .text("Frequency")
      .attr("x", -margin.left + 10)
      .attr("y", -15)
      .attr("text-anchor", "start");

};
