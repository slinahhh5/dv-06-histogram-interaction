const populateFilters = (data) => {

  // Redraw the bars and the dots using the TVs that match BOTH active filters
  const updateHistogram = () => {

    // Read which button is active in each group of filters
    const activeScreen = filters_screen.find(filter => filter.isActive).id;
    const activeSize = filters_size.find(filter => filter.isActive).id;

    // Start with all the TVs and narrow them down for every filter that is not "all"
    let updatedData = data;
    if (activeScreen !== "all") {
      updatedData = updatedData.filter(tv => tv.screenTech === activeScreen);
    }
    if (activeSize !== "all") {
      updatedData = updatedData.filter(tv => tv.screenSize === +activeSize);
    }

    // Fade the scatterplot dots that do not match the filters
    updateScatterplot(updatedData);

    // Create new bins from the filtered data (same bin generator, same bin edges)
    const updatedBins = binGenerator(updatedData);

    // Rescale the y-axis to the tallest bin of the filtered data
    // Use at least 1 so the scale does not collapse when no TV matches the filters
    const maxCount = Math.max(d3.max(updatedBins, d => d.length), 1);
    yScale.domain([0, maxCount]).nice();

    // Redraw the y-axis with a transition
    d3.select("#histogram .y-axis")
      .transition()
        .duration(750)
        .call(d3.axisLeft(yScale).ticks(Math.min(14, yScale.domain()[1])).tickFormat(d3.format(",")));

    // Move the bars to their new heights with a transition
    d3.selectAll("#histogram .bar")
      .data(updatedBins)
      .transition()
        .duration(750)
        .ease(d3.easeCubicInOut)
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length));
  };

  // Build one group of toggle buttons from a filter array
  const buildButtons = (containerId, filters) => {
    d3.select(containerId)
      .selectAll(".filter")
      .data(filters)
      .join("button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (event, d) => {
          console.log("Clicked filter data:", d);

          // Only the clicked button is active inside its own group
          filters.forEach(filter => {
            filter.isActive = filter.id === d.id;
          });

          // Update the look of the buttons in this group
          d3.selectAll(`${containerId} .filter`)
            .classed("active", filter => filter.id === d.id);

          // Update the charts using the state of both groups
          updateHistogram();
        });
  };

  buildButtons("#filters_screen", filters_screen);
  buildButtons("#filters_size", filters_size);

};

// Show only the circles of the TVs that match the filters (the others fade out)
const updateScatterplot = (filteredData) => {

  // A Set makes it quick to check whether a TV is in the filtered data
  // The circles are bound to the same objects, so the check works by identity
  const visible = new Set(filteredData);

  innerChartS
    .selectAll(".dot")
    .transition()
      .duration(750)
      .attr("opacity", d => visible.has(d) ? 0.5 : 0);
};

// Placeholders for Exercise 6.4: the tooltip and the mouse events are built there
const createTooltip = () => {
  // Tooltip code will go here in Exercise 6.4
};

const handleMouseEvents = () => {
  // Mouse event code will go here in Exercise 6.4
};
