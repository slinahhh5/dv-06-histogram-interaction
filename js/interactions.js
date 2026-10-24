const populateFilters = (data) => {

  // Redraw the bars using the TVs that match BOTH active filters
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

    // Create new bins from the filtered data (same bin generator, same bin edges)
    const updatedBins = binGenerator(updatedData);

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

          // Update the histogram using the state of both groups
          updateHistogram();
        });
  };

  buildButtons("#filters_screen", filters_screen);
  buildButtons("#filters_size", filters_size);

};
