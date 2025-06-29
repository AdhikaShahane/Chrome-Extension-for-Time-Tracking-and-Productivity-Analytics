let activeTabId = null;
let activeDomain = null;
let startTime = null;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await handleTabChange(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete") {
    await handleTabChange(tabId);
  }
});

async function handleTabChange(tabId) {
  if (activeDomain && startTime) {
    const duration = Date.now() - startTime;
    await addTimeToDomain(activeDomain, duration);
  }

  activeTabId = tabId;
  startTime = Date.now();

  try {
    const tab = await chrome.tabs.get(tabId);
    const url = new URL(tab.url);
    activeDomain = url.hostname;
  } catch (e) {
    activeDomain = null;
  }
}

async function addTimeToDomain(domain, duration) {
  if (!domain) return;
  chrome.storage.local.get([domain], (result) => {
    let total = result[domain] || 0;
    total += duration;
    let updateObj = {};
    updateObj[domain] = total;
    chrome.storage.local.set(updateObj);
  });
}

chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  if (tabs.length > 0) {
    handleTabChange(tabs[0].id);
  }
});