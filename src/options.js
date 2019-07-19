const browser = this.chrome && chrome.runtime ? chrome : this.browser;

class ExtensionOptions {
  constructor() {
    this.storage = browser.storage.sync;
    this.values = {
      nextKey: ["down", "j"],
      previousKey: ["up", "k"],
      navigatePreviousResultPage: ["left", "h"],
      navigateNextResultPage: ["right", "l"],
      navigateKey: ["return", "space"],
      navigateNewTabBackgroundKey: [
        "ctrl+return",
        "command+return",
        "ctrl+space"
      ],
      navigateNewTabKey: [
        "ctrl+shift+return",
        "command+shift+return",
        "ctrl+shift+space"
      ],
      focusSearchInput: ["/", "escape"]
    };
  }

  load() {
    return new Promise(resolve => {
      this.storage.get(this.values, values => {
        if (!browser.runtime.lastError) {
          this.values = values;
        }
        resolve();
      });
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      this.storage.set(this.values, () => {
        if (browser.runtime.lastError) {
          reject();
        } else {
          resolve();
        }
      });
    });
  }
}

const Options = new ExtensionOptions();
