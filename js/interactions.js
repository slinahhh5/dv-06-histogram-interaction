// ===== Filters (Exercise 6.2) =====

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

// Show only the dots of the TVs that match the filters (the others fade out)
const updateScatterplot = (filteredData) => {

  // A Set makes it quick to check whether a TV is in the filtered data
  // The dots are bound to the same objects, so the check works by identity
  const visible = new Set(filteredData);
  const dots = innerChartS.selectAll(".dot");

  // Hidden dots must not react to the mouse, otherwise invisible dots would show tooltips
  dots.attr("pointer-events", d => visible.has(d) ? "all" : "none");

  dots
    .transition()
      .duration(750)
      .attr("opacity", d => visible.has(d) ? 0.5 : 0);
};


// ===== Tooltip (Exercise 6.4) =====

// Text shown in the tooltip for one TV
// Extension: change this line to show the brand and the model as well
const getTooltipText = d => d.screenSize;

// Create the tooltip: a rectangle and a text inside a group, hidden at the start
const createTooltip = () => {

  // Append the tooltip group to the scatterplot inner chart
  // style() is used for the opacity because it overrides any other formatting
  const tooltip = innerChartS
    .append("g")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("pointer-events", "none")        // the tooltip never blocks the mouse
      .attr("transform", "translate(0, 500)"); // parked outside the visible area

  // Background rectangle: same colour as the histogram bars, rounded corners, slightly transparent
  tooltip
    .append("rect")
      .attr("width", tooltipWidth)
      .attr("height", tooltipHeight)
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("fill", barColor)
      .attr("fill-opacity", 0.75);

  // Text inside the rectangle (the real text is set when the mouse enters a dot)
  tooltip
    .append("text")
      .text("NA")
      .attr("x", tooltipWidth / 2)
      .attr("y", tooltipHeight / 2 + 2)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "white")
      .style("font-size", "13px")
      .style("font-weight", 900);
};

// Show and hide the tooltip when the mouse enters and leaves a dot of the scatterplot
const handleMouseEvents = () => {

  // Select all the circles of the scatterplot and attach the event listeners
  innerChartS
    .selectAll("circle")
    .on("mouseenter", (e, d) => {
      // e = information about the event (e.target is the circle), d = the data bound to the circle
      console.log("Mouse entered circle", d);

      // 1. Update the text of the tooltip
      innerChartS.select(".tooltip text")
        .text(getTooltipText(d));

      // 2. Get the centre of the circle that the mouse entered
      const cx = +e.target.getAttribute("cx");
      const cy = +e.target.getAttribute("cy");

      // 3. Position the tooltip centred above the circle
      //    The limits keep the tooltip inside the chart when the dot is near an edge
      const x = Math.min(Math.max(cx - 0.5 * tooltipWidth, 0), innerWidth - tooltipWidth);
      const y = Math.max(cy - 1.5 * tooltipHeight, -margin.top);

      // Move the tooltip, then fade it in with a transition
      innerChartS.select(".tooltip")
        .attr("transform", `translate(${x}, ${y})`)
        .transition()
          .duration(200)
          .style("opacity", 1);
    })
    .on("mouseleave", (e, d) => {
      console.log("Mouse left circle", d);

      // 4. Hide the tooltip and park it where it will not interfere with other elements
      //    interrupt() stops a fade-in that is still running, so the tooltip cannot get stuck visible
      innerChartS.select(".tooltip")
        .interrupt()
        .style("opacity", 0)
        .attr("transform", "translate(0, 500)");
    });
};
