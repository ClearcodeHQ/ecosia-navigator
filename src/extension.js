const searchResultsClass = "result";
const searchInputSelector = ".search-form-input";
const nextPageSelector = ".pagination-next";
const prevPageSelector = ".pagination-prev";

class SearchResult {
  constructor(container) {
    this.container = container;
    this.anchor = this.container.querySelector("a");
  }

  focus() {
    console.log("adding focus class");
    console.log(this);
    this.container.classList.add("focused-search-result");
    this.container.focus({ preventScroll: true });
    this.scrollTo();
  }

  unfocus() {
    this.container.classList.remove("focused-search-result");
  }

  scrollTo() {
    const elementBounds = this.container.getBoundingClientRect();
    // Firefox displays tooltip at the bottom which obstructs the view
    // as a workaround ensure extra space from the bottom in the viewport
    // firefox detection (https://stackoverflow.com/a/7000222/2870889).
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    // hardcoded height of the tooltip plus some margin
    const firefoxBottomDelta = 26;
    const bottomDelta = isFirefox ? firefoxBottomDelta : 0;
    if (elementBounds.top < 0) {
      // scroll element to top
      this.container.scrollIntoView(true);
    } else if (elementBounds.bottom + bottomDelta > window.innerHeight) {
      // scroll element to bottom
      this.container.scrollIntoView(false);
      window.scrollBy(0, bottomDelta);
    }
  }
}

class SearchResults {
  constructor(results) {
    this.results = results;
    this.currentResult = this.results[0];
    this.currentIndex = 0;
    this.currentResult.focus();
  }

  next() {
    if (this.hasNext()) {
      const nextResult = this.results[this.currentIndex + 1];
      this.changeResult(nextResult);
    }
  }

  previous() {
    if (this.hasPrevious()) {
      const previousResult = this.results[this.currentIndex - 1];
      this.changeResult(previousResult);
    }
  }

  open() {
    this.currentResult.anchor.click();
  }

  changeResult(result) {
    this.currentResult.unfocus();
    result.focus();
    this.currentIndex = this.results.indexOf(result);
    this.currentResult = result;
  }

  hasNext() {
    if (this.currentIndex < this.results.length - 1) {
      return true;
    }
    return false;
  }

  hasPrevious() {
    if (this.currentIndex > 0) {
      return true;
    }
    return false;
  }
}

class SearchController {
  constructor(resultsClass) {
    this.searchResultsClass = resultsClass;
  }

  init() {
    if (!/^(www)\.ecosia\.org/.test(window.location.hostname)) {
      return;
    }
    const searchElements = document.getElementsByClassName(
      this.searchResultsClass
    );
    const results = this.getSearchResult(searchElements);

    if (results.length == 0) {
      return;
    }

    this.searchResults = new SearchResults(results);

    const options = Options.values;
    this.register(options.nextKey, () => {
      this.searchResults.next();
    });

    this.register(options.previousKey, () => {
      this.searchResults.previous();
    });

    this.register(options.navigateKey, () => {
      this.searchResults.open();
    });

    this.register(options.navigateNewTabKey, () => {
      const anchor = this.searchResults.currentResult.anchor;
      browser.runtime.sendMessage({
        type: "tabsCreate",
        options: { url: anchor.href, active: true }
      });
    });
    this.register(options.navigateNewTabBackgroundKey, () => {
      const anchor = this.searchResults.currentResult.anchor;
      browser.runtime.sendMessage({
        type: "tabsCreate",
        options: { url: anchor.href, active: false }
      });
    });

    this.register(options.navigateNextResultPage, () => {
      const node = document.querySelector(nextPageSelector);
      if (node !== null) {
        location.href = node.href;
      }
    });

    this.register(options.navigatePreviousResultPage, () => {
      const node = document.querySelector(prevPageSelector);
      if (node !== null) {
        location.href = node.href;
      }
    });

    this.register(options.focusSearchInput, () => {
      const searchInput = document.querySelector(searchInputSelector);
      if (searchInput !== null) {
        searchInput.select();
        searchInput.click();
      }
    });
  }

  getSearchResult(elements) {
    let results = [];
    for (const element of elements) {
      const result = new SearchResult(element);
      results.push(result);
    }
    return results;
  }

  register(shortcut, callback) {
    Mousetrap.bind(shortcut, function(event) {
      const result = callback();
      if (result !== true && event !== null) {
        return false;
      }
    });
  }
}

let controller = new SearchController(searchResultsClass);
controller.init();
