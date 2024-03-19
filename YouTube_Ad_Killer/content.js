let oldMovieKillerEnabled = false;
let isThrottled = false;
let throttleTimer = null;

// 設定のトグルとスタイルの更新を一つの関数で行う
function toggleOldMovieKiller() {
  oldMovieKillerEnabled = !oldMovieKillerEnabled;
  updateHeaderStyle();
}

function updateHeaderStyle() {
  //const header = document.querySelector("div#chips-content");
  const header = document.querySelector(
    "div#container.style-scope.ytd-masthead"
  );
  if (header) {
    header.style.backgroundColor = oldMovieKillerEnabled ? "#FF0000" : "";
    header.querySelectorAll("yt-formatted-string").forEach((element) => {
      element.style.color = oldMovieKillerEnabled ? "#FFFFFF" : "";
    });
  }
}

// キーボードイベントのリスナー
document.addEventListener("keydown", (event) => {
  if (event.key === "Delete") {
    toggleOldMovieKiller();
  }
});

// Throttlingのチェックと処理

function checkAndApplyThrottling() {
  if (!throttleTimer) {
    // throttleTimerがセットされていない場合のみ処理を実行
    observer.disconnect();
    isThrottled = true;

    // 1秒後にobserverを再度接続し、throttle状態をリセットする
    throttleTimer = setTimeout(() => {
      observer.observe(document.body, { childList: true, subtree: true });
      isThrottled = false;

      // タイマーをクリアして、次の処理が実行できるようにする
      clearTimeout(throttleTimer);
      throttleTimer = null;
    }, 100);
  }
}

// MutationObserverの設定と処理の最適化
const observer = new MutationObserver((mutations) => {
  if (isThrottled) return;

  mutations.forEach((mutation) => {
    const url = window.location.href;
    if (url.startsWith("https://www.youtube.com/")) {
      routeActionBasedOnURL(url, mutation);
    }
  });

  checkAndApplyThrottling();
});

// URLに基づいたアクションの実行
function routeActionBasedOnURL(url, mutation) {
  if (
    url === "https://www.youtube.com/" ||
    url === "https://www.youtube.com/?bp=wgUCEAE%3D"
  ) {
    performHomePageActions();
    if (oldMovieKillerEnabled) oldMovieKiller();
  } else if (url.includes("https://www.youtube.com/watch?")) {
    youTubePlayerAdKiller(mutation);
    if (oldMovieKillerEnabled) oldMovieKiller();
  } else if (
    url.includes("https://www.youtube.com/@") ||
    url.includes("https://www.youtube.com/channel")
  ) {
    skipPlayerAd();
  }
}

observer.observe(document.body, { childList: true, subtree: true });

// 処理回数のリセットを1秒ごとに行うのではなく、Throttlingのリセット時に同時に行う
// setInterval(resetThrottle, 1000);

function performHomePageActions() {
  youTubeHomeAdKiller();
  removeElementsBySelector("ytd-rich-section-renderer");
  removeElementsBySelector(
    'a#endpoint[title="ショート"], a#endpoint[title="Shorts"]'
  );
}

const config = { childList: true, subtree: true };
observer.observe(document.body, config);

function youTubePlayerAdKiller(mutation) {
  if (mutation.addedNodes.length || mutation.removedNodes.length) {
    skipPlayerAd();
  }
  removeElementsBySelector("img.ytp-ad-image");
  removeElementsBySelector(
    "div#player-ads.style-scope.ytd-watch-flexy, ytd-ad-slot-renderer.style-scope.ytd-watch-next-secondary-results-renderer"
  );
  removeElementsBySelector("div#main.style-scope.yt-mealbar-promo-renderer");
}

function skipPlayerAd() {
  const video = document.querySelector("video");
  if (!video) return;

  adjustVideoPlaybackForAds(video);
  clickSkipAdButton();
}

function adjustVideoPlaybackForAds(video) {
  const adElements = document.querySelectorAll(".ad-showing, .ad-interrupting");
  if (adElements.length > 0) {
    video.style.filter = "brightness(0%)";
    video.volume = 0;

    if (isFinite(video.duration)) {
      video.currentTime = video.duration;
    }
  } else {
    if (video.style.filter === "brightness(0%)") {
      video.style.filter = "";
    }
  }
}

function clickSkipAdButton() {
  const skipButton = document.querySelector(".ytp-ad-skip-button-container");

  if (skipButton) {
    const buttonText = ["スキップ", "Skip"];

    buttonText.forEach(function (text) {
      const skipTextDiv = skipButton.querySelectorAll("div");
      if (skipTextDiv) {
        skipTextDiv.forEach(function (textDiv) {
          if (textDiv.textContent === text) {
            if (skipTextDiv) {
              skipButton.click();
            }
          }
        });
      }
    });
  }
}

function removeElementsBySelector(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(function (element) {
    element.remove();
  });
}

function removeParentElementsBySelector(childSelector, parentSelector) {
  const childElements = document.querySelectorAll(childSelector);

  childElements.forEach((childElement) => {
    let parentElement = childElement.parentElement;
    while (parentElement && !parentElement.matches(parentSelector)) {
      parentElement = parentElement.parentElement;
    }

    if (parentElement && parentElement.matches(parentSelector)) {
      parentElement.remove();
    }
  });
}

function removeIfElementContainsText(selector, searchTextArray) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    // テキスト内容がsearchTextArrayのいずれかと一致するかをチェック
    const isMatch = searchTextArray.some((text) =>
      element.textContent.includes(text)
    );
    if (isMatch) {
      // 最も近い親要素を見つけて削除する
      const parentElement = element.closest(
        "ytd-rich-item-renderer, ytd-compact-video-renderer"
      );
      if (parentElement) {
        parentElement.remove();
      }
    }
  });
}

function miniPlayerAdKiller() {
  const video = document.querySelector("video");
  if (!video) return;

  adjustVideoPlaybackForAds(video);
  clickSkipAdButton();
}

function youTubeHomeAdKiller() {
  removeParentElementsBySelector(
    "ytd-ad-slot-renderer",
    "ytd-rich-item-renderer"
  );

  removeElementsBySelector("div#big-yoodle, div#masthead-ad");

  removeElementsBySelector("ytd-rich-section-renderer");

  // YouTubeページのytd-rich-grid-row要素をすべて取得
  const gridRows = document.querySelectorAll("ytd-rich-grid-row");

  // 最初のytd-rich-item-rendererからitems-per-rowの値を取得
  const firstItemRenderer = document.querySelector("ytd-rich-item-renderer");
  const itemsPerRow = firstItemRenderer
    ? parseInt(firstItemRenderer.getAttribute("items-per-row"), 10)
    : 0;

  gridRows.forEach((gridRow, index) => {
    // 現在のgridRowのytd-rich-item-rendererをすべて取得
    const itemRenderers = gridRow.querySelectorAll("ytd-rich-item-renderer");

    let itemsNeeded = itemsPerRow - itemRenderers.length; // この行でアイテムが足りない場合の数

    if (itemsNeeded > 0 && index < gridRows.length - 1) {
      for (let i = index + 1; i < gridRows.length && itemsNeeded > 0; i++) {
        const nextGridRow = gridRows[i];
        const nextItemRenderers = nextGridRow.querySelectorAll(
          "ytd-rich-item-renderer"
        );

        Array.from(nextItemRenderers).some((itemToMove) => {
          gridRow.querySelector("div#contents").appendChild(itemToMove);
          itemsNeeded--;
          return itemsNeeded === 0; // itemsNeededが0になったら処理を停止
        });
      }
    }
  });
}

function oldMovieKiller() {
  const spansText = [
    "週間前",
    "か月前",
    "年前",
    "week ago",
    "weeks ago",
    "month ago",
    "months ago",
    "year ago",
    "years ago",
  ];
  removeIfElementContainsText(
    "span.inline-metadata-item.style-scope.ytd-video-meta-block",
    spansText
  );
}
