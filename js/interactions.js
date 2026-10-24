const populateFilters = (data) => {

  // Redraw the bars using only the TVs that match the selected filter
  const updateHistogram = (filterId, data) => {

    // 1. Keep all the TVs for "all", otherwise keep only the TVs with that screen technology
    const updatedData = filterId === "all"
      ? data
      : data.filter(tv => tv.screenTech === filterId);

    // 2. Create new bins from the filtered data (same bin generator, same bin edges)
    const updatedBins = binGenerator(updatedData);

    // 3. Bind the new bins to the existing bars and move the bars with a transition
    //    Only y and height change because the x positions and widths of the bins stay the same
    d3.selectAll("#histogram .bar")
      .data(updatedBins)
      .transition()
        .duration(750)                  // length of the animation in milliseconds
        .ease(d3.easeCubicInOut)        // slow at the start and at the end, faster in the middle
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length));
  };

  // Build the filter buttons from the filters_screen array in shared-constants.js
  d3.select("#filters_screen")
    .selectAll(".filter")
    .data(filters_screen)
    .join("button")
      // The "active" class styles the selected button (see base.css)
      .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
      .text(d => d.label)
      // The click event gives us the event and the data (d) of the clicked button
      .on("click", (event, d) => {
        console.log("Clicked filter data:", d);

        // Only the clicked button is active, all the others are switched off
        filters_screen.forEach(filter => {
          filter.isActive = filter.id === d.id;
        });

        // Update the look of the buttons: add or remove the "active" class
        d3.selectAll("#filters_screen .filter")
          .classed("active", filter => filter.id === d.id);

        // Update the histogram with the data for the selected filter
        updateHistogram(d.id, data);
      });

};
