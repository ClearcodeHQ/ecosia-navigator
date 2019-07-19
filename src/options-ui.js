const showMessage = message => {
  // Update status to let user know.
  const status = document.getElementById("status");
  status.textContent = message;
  setTimeout(function() {
    status.textContent = "";
  }, 3000);
};

const optionToDiv = {
  nextKey: "next-key",
  previousKey: "previous-key",
  navigatePreviousResultPage: "navigate-previous-result-page",
  navigateNextResultPage: "navigate-next-result-page",
  navigateKey: "navigate-key",
  navigateNewTabKey: "navigate-new-tab-key",
  navigateNewTabBackgroundKey: "navigate-new-tab-background-key",
  focusSearchInput: "focus-search-input"
};

// Saves options to chrome.storage.sync.
const saveOptions = () => {
  for (let key in optionToDiv) {
    // Shortcuts are strings separated by commas.
    // Split them into the arrays Moustrap requires.
    Options.values[key] = document
      .getElementById(optionToDiv[key])
      .value.split(",")
      .map(t => t.trim());
  }

  // Update the sync values and save.
  return Options.save().then(
    () => showMessage("Options saved."),
    () => showMessage("Error when saving options.")
  );
};

// Restores options stored in chrome.storage.
const restoreOptions = () => {
  Options.load().then(() => {
    for (let key in optionToDiv) {
      // Shortcuts are stored as arrays.
      // Join them into comma-separated string.
      const optTemp = Options.values[key];
      document.getElementById(optionToDiv[key]).value = Array.isArray(optTemp)
        ? optTemp.join(", ")
        : optTemp;
    }
  });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
