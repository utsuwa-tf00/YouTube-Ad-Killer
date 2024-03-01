// キーボードイベントを使用してフラグを切り替える
let oldMovieKillerEnabled = false;
document.addEventListener("keydown", function (event) {
  if (event.key === "Delete") {
    oldMovieKillerEnabled = !oldMovieKillerEnabled;
    const text = `oldMovieKiller は ${
      oldMovieKillerEnabled ? "有効です" : "無効です"
    }`;
    console.log(text);
  }
});

// YouTubeページ上でのDOM変更を監視する
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    const url = window.location.href;
    if (
      url === "https://www.youtube.com/" ||
      url === "https://www.youtube.com/?bp=wgUCEAE%3D"
    ) {
      youTubeHomeAdKiller();
      shortsKiller();

      if (oldMovieKillerEnabled) {
        oldMovieKiller();
      }
    } else if (url.includes("https://www.youtube.com/watch?")) {
      youTubePlayerAdKiller(mutation);
    }
  });
});

// YouTube動画ページの変更を処理する
function youTubePlayerAdKiller(mutation) {
  if (mutation.addedNodes.length || mutation.removedNodes.length) {
    skipPlayerAd();
  }
  removePlayerAds();
  /*
  if (oldMovieKillerEnabled) {
    oldMovieKiller();
  }
  */
  removePromoPopups();
}

// 広告をスキップする試み
function removeAdModule() {
  const interstitialCard = document.querySelectorAll(
    "div.ytp-ad-action-interstitial-card"
  );

  if (interstitialCard > 0) {
    console.log("youTubePlayerAdKiller : 広告要素削除");
    interstitialCard.forEach(function (card) {
      card.remove();
    });
  }

  /*
  const skipButton = document.querySelector(
    ".ytp-ad-skip-button-modern.ytp-button"
  );
  // スキップボタン内の特定のdivを検索
  const skipButtonText = skipButton
    ? skipButton.querySelector(
        "div.ytp-ad-text.ytp-ad-skip-button-text-centered.ytp-ad-skip-button-text"
      )
    : null;
  // スキップ可能時のボタンテキスト
  const texts = ["スキップ", "skip"];
  
  // スキップボタンとテキスト内容の両方が存在し、テキスト内容が"スキップ"であるか確認
  texts.forEach(function (text) {
    if (skipButton && skipButtonText.textContent === text) {
      
      if (adModule) {
        adModule.remove();
      }
    }
  });
  */
}

// 広告をミュートして隠す
function skipPlayerAd() {
  //const adModule = document.querySelector(".video-ads.ytp-ad-module");
  const video = document.querySelector("video");

  const videoContainer = document.querySelector(
    "div#container.style-scope.ytd-player"
  );

  if (!video) {
    return;
  }

  if (videoContainer.querySelector(".ad-showing")) {
    if (video.currentTime < video.duration) {
      console.log("youTubePlayerAdKiller : 広告スキップ");
      video.style.filter = "brightness(0%)";
      video.volume = 0;
      video.currentTime = video.duration;
    }
  } else {
    if (video.style.filter == "brightness(0%)") {
      video.style.filter = "none";
    }
  }

  const adImage = document.querySelectorAll("img.ytp-ad-image");
  if (adImage.length > 0) {
    adImage.forEach(function (img) {
      img.remove("youTubePlayerAdKiller : 広告画像を削除");
    });
    console.log();
  }

  if (video.currentTime >= video.duration) {
    removeAdModule();
  }
}

// プレイヤーの広告を削除する
function removePlayerAds() {
  const playerAds = document.querySelectorAll(
    "div#player-ads.style-scope.ytd-watch-flexy, ytd-ad-slot-renderer.style-scope.ytd-watch-next-secondary-results-renderer"
  );
  if (playerAds.length > 0) {
    console.log(
      `youTubePlayerAdKiller : バナー広告 ${playerAds.length} 個 削除`
    );
    playerAds.forEach(function (element) {
      element.remove();
    });
  }
}

// プロモーションポップアップを削除する
function removePromoPopups() {
  const ytMealbarPromoRenderer = document.querySelectorAll(
    "div#main.style-scope.yt-mealbar-promo-renderer"
  );
  if (ytMealbarPromoRenderer.length > 0) {
    console.log(
      `youTubePlayerAdKiller : プロモーションポップアップ ${ytMealbarPromoRenderer.length} 個 削除`
    );
    ytMealbarPromoRenderer.forEach(function (element) {
      element.remove();
    });
  }
}

// 要素が表示されているかどうかを判断する
function isElementVisible(element) {
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

// YouTubeホームページ上の広告を削除する
function youTubeHomeAdKiller() {
  // 最初に広告要素を取得
  const adElements = document.querySelectorAll("ytd-ad-slot-renderer");

  if (adElements.length > 0) {
    console.log(
      `youTubeHomeAdKiller : 広告サムネイル ${adElements.length} 個 削除`
    );

    // 各広告要素に対して処理を実行
    adElements.forEach(function (adElement) {
      // 親要素を辿ってytd-rich-item-rendererを探す
      let parentElement = adElement.parentElement;
      while (
        parentElement &&
        !parentElement.matches("ytd-rich-item-renderer")
      ) {
        parentElement = parentElement.parentElement;
      }

      // 見つかったら削除
      if (parentElement && parentElement.matches("ytd-rich-item-renderer")) {
        parentElement.remove();
      }
    });
  }

  const mastheadAd = document.querySelector("div#big-yoodle, div#masthead-ad");
  if (mastheadAd) {
    console.log("youTubeHomeAdKiller : マストヘッド広告削除");
    mastheadAd.remove();
  }

  // ytd-rich-section-rendererの広告を直接削除
  const richSectionAds = document.querySelectorAll("ytd-rich-section-renderer");
  if (richSectionAds.length > 0) {
    console.log(
      `youTubeHomeAdKiller : 大広告を ${richSectionAds.length} 個 削除`
    );
    richSectionAds.forEach(function (ad) {
      ad.remove();
    });
  }
}

// ショート動画を削除する
function shortsKiller() {
  const short = document.querySelector("ytd-rich-section-renderer");
  if (short) {
    console.log("shortsKiller : ショート動画を削除");
    short.remove();
  }

  const homeShortTab = document.querySelector(
    'a#endpoint[title="ショート"], a#endpoint[title="Shorts"]'
  );
  if (homeShortTab) {
    console.log("shortsKiller : ショート動画タブを削除");
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

  // 直接条件にマッチするspan要素を取得
  var spanElements = document.querySelectorAll(
    "span.inline-metadata-item.style-scope.ytd-video-meta-block"
  );
  if (spanElements.length > 0) {
    console.log(`oldMovieKiller : 古い動画を ${spanElements.length} 個 削除`);
    spanElements.forEach(function (spanElement) {
      var spanTextContent = spanElement.textContent;
      var isOldVideo = spansText.some(function (text) {
        return spanTextContent.includes(text);
      });

      if (isOldVideo) {
        // 親要素を辿ってytd-rich-item-rendererを探す
        var parentElement = spanElement.closest(
          "ytd-rich-item-renderer.style-scope"
        );

        // 見つかったら削除
        if (parentElement) {
          parentElement.remove();
        }
      }
    });
  }
}

// MutationObserverを設定して、DOM変更を監視する
const config = { childList: true, subtree: true };
observer.observe(document.body, config);
