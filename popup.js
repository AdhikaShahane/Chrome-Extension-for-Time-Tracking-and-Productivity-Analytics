function msToTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

function displayData(data) {
  const container = document.getElementById("timeList");
  container.innerHTML = "";

  if (Object.keys(data).length === 0) {
    container.textContent = "No data tracked yet.";
    return;
  }

  for (const domain in data) {
    const div = document.createElement("div");
    div.textContent = `${domain}: ${msToTime(data[domain])}`;
    container.appendChild(div);
  }
}

document.getElementById("resetBtn").addEventListener("click", () => {
  chrome.storage.local.clear(() => {
    displayData({});
  });
});

window.onload = () => {
  chrome.storage.local.get(null, (data) => {
    displayData(data);
  });
};