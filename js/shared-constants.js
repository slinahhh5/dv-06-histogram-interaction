// Set up dimensions and margins (inner chart strategy from Dufour and Meeks, 2024)
const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const width = 800;    // total width of the chart
const height = 400;   // total height of the chart
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Colours accessible globally
const barColor = "#606464";
const bodyBackgroundColor = "#fffaf0";  // used as the bar stroke so it looks like a gap between bars

// Scales are created here and their domains and ranges are set in the drawing function
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// Bin generator: groups the TVs by energy consumption
// domain: fixed from 0 to 2800 kWh/year so the bins always start and end on round numbers
// thresholds: about 14 bins, which d3 rounds to a step of 200
// Kept here so the filters in Exercise 6.2 can reuse the same bins
const binGenerator = d3.bin()
  .value(d => d.energyConsumption)
  .domain([0, 2800])
  .thresholds(14);
