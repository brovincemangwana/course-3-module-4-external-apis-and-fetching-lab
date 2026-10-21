// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

// Step 1: fetch alerts for a state
async function fetchWeatherAlerts(state) {
  const response = await fetch(`${weatherApi}${state}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const data = await response.json();
  console.log(data);
  return data;
}

// Step 2: show summary + headlines (Step 3: clears old data first)
function displayAlerts(data) {
  alertsDisplay.textContent = "";

  const summary = document.createElement("p");
  summary.textContent = `${data.title}: ${data.features.length}`;
  alertsDisplay.appendChild(summary);

  const list = document.createElement("ul");
  data.features.forEach((alert) => {
    const item = document.createElement("li");
    item.textContent = alert.properties.headline;
    list.appendChild(item);
  });
  alertsDisplay.appendChild(list);
}

// Step 4: error handling
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function hideError() {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}

async function handleSubmit() {
  const state = stateInput.value.trim();

  try {
    if (!state) {
      throw new Error("Please enter a state abbreviation.");
    }
    if (!/^[A-Z]{2}$/.test(state)) {
      throw new Error("State must be two capital letters, like MN.");
    }

    const data = await fetchWeatherAlerts(state);

    stateInput.value = "";  // Step 3: clear input
    hideError();            // Step 4: hide error on success
    displayAlerts(data);
  } catch (error) {
    alertsDisplay.textContent = "";
    showError(error.message);
  }
}

fetchButton.addEventListener("click", handleSubmit);

if (typeof module !== "undefined") {
  module.exports = {
    fetchWeatherAlerts,
    displayAlerts,
    showError,
    hideError,
    handleSubmit,
  };
}