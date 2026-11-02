const heightsInput = document.getElementById("heightsInput");
const tankChart = document.getElementById("tankChart");
const waterTotal = document.getElementById("waterTotal");
const errorMessage = document.getElementById("errorMessage");

function calculateTrappedWater(heights) {
  let left = 0;
  let right = heights.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let totalWater = 0;

  while (left < right) {
    if (heights[left] <= heights[right]) {
      leftMax = Math.max(leftMax, heights[left]);
      totalWater += leftMax - heights[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, heights[right]);
      totalWater += rightMax - heights[right];
      right--;
    }
  }

  return totalWater;
}

function drawTank(heights) {
  const cellWidth = 48;
  const cellHeight = 24;
  const chartHeight = Math.max(1, ...heights) * cellHeight;
  const chartWidth = heights.length * cellWidth;

  tankChart.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight + 1}`);
  tankChart.innerHTML = "";

  const leftMaxHeights = [];
  const rightMaxHeights = [];
  let maxHeight = 0;

  for (let i = 0; i < heights.length; i++) {
    maxHeight = Math.max(maxHeight, heights[i]);
    leftMaxHeights[i] = maxHeight;
  }

  maxHeight = 0;

  for (let i = heights.length - 1; i >= 0; i--) {
    maxHeight = Math.max(maxHeight, heights[i]);
    rightMaxHeights[i] = maxHeight;
  }

  for (let i = 0; i < heights.length; i++) {
    const waterHeight = Math.max(
      0,
      Math.min(leftMaxHeights[i], rightMaxHeights[i]) - heights[i]
    );

    const x = i * cellWidth;
    const buildingY = chartHeight - heights[i] * cellHeight;
    const waterY = chartHeight - (heights[i] + waterHeight) * cellHeight;

    if (waterHeight > 0) {
      const water = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      water.setAttribute("x", x);
      water.setAttribute("y", waterY);
      water.setAttribute("width", cellWidth);
      water.setAttribute("height", waterHeight * cellHeight);
      water.setAttribute("fill", "#08a9df");
      tankChart.appendChild(water);
    }

    if (heights[i] > 0) {
      const building = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      building.setAttribute("x", x);
      building.setAttribute("y", buildingY);
      building.setAttribute("width", cellWidth);
      building.setAttribute("height", heights[i] * cellHeight);
      building.setAttribute("fill", "#f5ed00");
      tankChart.appendChild(building);
    }

    const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    border.setAttribute("x", x);
    border.setAttribute("y", 0);
    border.setAttribute("width", cellWidth);
    border.setAttribute("height", chartHeight);
    border.setAttribute("fill", "none");
    border.setAttribute("stroke", "#999");
    border.setAttribute("stroke-width", "1");
    tankChart.appendChild(border);
  }
}

function updateApplication() {
  const rawValues = heightsInput.value.split(",").map(value => value.trim());

  if (
    rawValues.length < 2 ||
    rawValues.some(value => value === "" || !/^\d+$/.test(value))
  ) {
    errorMessage.textContent = "Enter at least two non-negative whole numbers separated by commas.";
    waterTotal.textContent = "—";
    tankChart.innerHTML = "";
    return;
  }

  const heights = rawValues.map(Number);

  if (heights.some(height => !Number.isSafeInteger(height)) || Math.max(...heights) > 100) {
    errorMessage.textContent = "Please enter whole-number heights between 0 and 100.";
    waterTotal.textContent = "—";
    tankChart.innerHTML = "";
    return;
  }

  errorMessage.textContent = "";
  waterTotal.textContent = calculateTrappedWater(heights);
  drawTank(heights);
}

heightsInput.addEventListener("input", updateApplication);
updateApplication();
