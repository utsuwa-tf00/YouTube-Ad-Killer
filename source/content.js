// キーボードイベントを使用してフラグを切り替える
let oldMovieKillerEnabled = false;
document.addEventListener("keydown", function (event) {
  if (event.key === "Delete") {
    oldMovieKillerEnabled = !oldMovieKillerEnabled;
  }
});

// YouTubeページ上でのDOM変更を監視する
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const url = window.location.href;
    if (url === "https://www.youtube.com/") {
      youTubeHomeAdKiller();
      shortsKiller();

      if (oldMovieKillerEnabled) {
        oldMovieKiller();
      }
    } else if (url.includes("https://www.youtube.com/watch?")) {
      youTubeVideoPageAdKiller(mutation);
    }
  });
});

// YouTube動画ページの変更を処理する
function youTubeVideoPageAdKiller(mutation) {
  if (mutation.addedNodes.length || mutation.removedNodes.length) {
    attemptToSkipAd();
  }
  removePlayerAds();
  if (oldMovieKillerEnabled) {
    oldMovieKiller();
  }
  removePromoPopups();
}

// 広告をスキップする試み
function attemptToSkipAd() {
  const skipButton = document.querySelector(
    ".ytp-ad-skip-button-modern.ytp-button"
  );
  if (skipButton) {
    skipButton.click();
  } else {
    muteAndHideAd();
  }
}

// 広告をミュートして隠す
function muteAndHideAd() {
  const adModule = document.querySelector(".video-ads.ytp-ad-module");
  const video = document.querySelector("video");
  if (adModule && isElementVisible(adModule)) {
    video.style.opacity = 0;
    video.volume = 0;
    if (video.currentTime <= video.duration) {
      video.currentTime = video.duration + 1;
    }
  } else {
    if (video.style.opacity != 1) {
      video.style.opacity = 1;
    }
  }
}

// プレイヤーの広告を削除する
function removePlayerAds() {
  const playerAds = document.querySelectorAll(
    "div#player-ads.style-scope.ytd-watch-flexy, ytd-ad-slot-renderer.style-scope.ytd-watch-next-secondary-results-renderer"
  );
  playerAds.forEach((element) => {
    element.remove();
  });
}

// プロモーションポップアップを削除する
function removePromoPopups() {
  const ytMealbarPromoRenderer = document.querySelectorAll(
    "div#main.style-scope.yt-mealbar-promo-renderer"
  );
  ytMealbarPromoRenderer.forEach((element) => {
    element.remove();
  });
}

// 要素が表示されているかどうかを判断する
function isElementVisible(element) {
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

// YouTubeホームページ上の広告を削除する
function youTubeHomeAdKiller() {
  const possibleAdElements = document.querySelectorAll(
    "ytd-rich-item-renderer.style-scope, ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer, div#masthead-ad.style-scope.ytd-rich-grid-renderer"
  );

  possibleAdElements.forEach((element) => {
    // ytd-rich-item-renderer内の広告要素を検出し、削除
    if (element.matches("ytd-rich-item-renderer.style-scope")) {
      const adElements = element.querySelectorAll(
        "ytd-in-feed-ad-layout-renderer.style-scope.ytd-ad-slot-renderer, ytd-ad-slot-renderer.style-scope.ytd-rich-item-renderer"
      );
      if (adElements.length > 0) {
        element.remove();
      }
    }
    // div#masthead-adを直接削除
    if (element.matches("div#masthead-ad.style-scope.ytd-rich-grid-renderer")) {
      element.remove();
    }

    if (
      element.matches(
        "ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer"
      )
    ) {
      element.remove();
    }
  });
}

// ショート動画を削除する
function shortsKiller() {
  const short = document.querySelector("ytd-rich-shelf-renderer");
  if (short) {
    //console.log("YouTubeホーム : ショート動画を削除しました");
    short.remove();
  }

  const homeShortTab = document.querySelector(
    'a#endpoint[title="ショート"], a#endpoint[title="Shorts"]'
  );
  if (homeShortTab) {
    //console.log("YouTubeホーム : ホーム画面のショートのタブを削除しました");
    homeShortTab.parentElement.remove();
  }
}

// 古い動画を削除する
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

  const possibleOldMovieElements = document.querySelectorAll(
    "ytd-rich-item-renderer.style-scope"
  );

  possibleOldMovieElements.forEach((element) => {
    const spanElements = element.querySelectorAll(
      "span.inline-metadata-item.style-scope.ytd-video-meta-block"
    );

    spanElements.forEach((spanElement) => {
      const spanTextContent = spanElement.textContent;
      spansText.forEach((text) => {
        if (spanTextContent.includes(text)) {
          element.remove();
        }
      });
    });
  });
}

// MutationObserverを設定して、DOM変更を監視する
const config = { childList: true, subtree: true };
observer.observe(document.body, config);
