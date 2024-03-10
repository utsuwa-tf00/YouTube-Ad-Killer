let oldMovieKillerEnabled = false;

document.addEventListener("keydown", function (event) {
  if (event.key === "Delete") {
    oldMovieKillerEnabled = !oldMovieKillerEnabled;
    const text = `oldMovieKiller は ${
      oldMovieKillerEnabled ? "有効です" : "無効です"
    }`;
    console.log(text);

    // header要素の背景色を切り替える
    const header = document.querySelector("div#chips-content");
    if (header) {
      if (oldMovieKillerEnabled) {
        header.style.backgroundColor = "#FF0000"; // 背景色を赤に設定
        // header内のyt-formatted-stringのカラーを#FFFFFFに設定
        const formattedStrings = header.querySelectorAll("yt-formatted-string");
        formattedStrings.forEach((element) => {
          element.style.color = "#FFFFFF";
        });
      } else {
        header.style.backgroundColor = ""; // 背景色をデフォルト(または空)に戻す
        // 注意: デフォルトのカラーが分からない場合は、この部分を調整する必要があります。
        const formattedStrings = header.querySelectorAll("yt-formatted-string");
        formattedStrings.forEach((element) => {
          element.style.color = ""; // デフォルトカラーに戻す (この方法は元のカラーに依存する)
        });
      }
    }
  }
});

let processingCount = 0; // 処理回数を追跡する変数
let isThrottled = false; // 処理を一時停止しているかどうかのフラグ

// 処理回数のリセットを1秒ごとに行う
setInterval(() => {
  processingCount = 0;
}, 1000); // 1秒ごとに処理回数をリセット

// 処理回数のリセットとフラグの更新を行う関数
function resetThrottling() {
  isThrottled = false;
}

const observer = new MutationObserver(function (mutations) {
  if (isThrottled) return; // 処理が一時停止されている場合は何もしない

  mutations.forEach(function (mutation) {
    // 以下、URLに基づいた処理を実行
    const url = window.location.href;
    if (
      url === "https://www.youtube.com/" ||
      url === "https://www.youtube.com/?bp=wgUCEAE%3D"
    ) {
      processingCount++; // 処理回数をインクリメント
      if (processingCount > 100) {
        // 1秒間に100回以上の処理があった場合
        observer.disconnect(); // MutationObserverの監視を停止
        isThrottled = true; // 処理を一時停止する
        setTimeout(() => {
          observer.observe(document.body, { childList: true, subtree: true }); // 監視を再開
          resetThrottling(); // フラグをリセット
        }, 1000); // 1秒後に処理を再開
        return; // この時点で処理を中断
      }
      youTubeHomeAdKiller();
      shortsKiller();
      if (oldMovieKillerEnabled) {
        oldMovieKiller();
      }
    } else if (url.includes("https://www.youtube.com/watch?")) {
      youTubePlayerAdKiller(mutation);
    } else if (
      url.includes("https://www.youtube.com/@") ||
      url.includes("https://www.youtube.com/channel")
    ) {
      miniPlayerAdKiller();
    }
  });
});

// MutationObserverを設定して、DOM変更を監視する
const config = { childList: true, subtree: true };
observer.observe(document.body, config);

// YouTube動画ページの変更を処理する
function youTubePlayerAdKiller(mutation) {
  if (mutation.addedNodes.length || mutation.removedNodes.length) {
    skipPlayerAd();
  }
  removePlayerAds();
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
}

// 広告をミュートして隠す
function skipPlayerAd() {
  //const adModule = document.querySelector(".video-ads.ytp-ad-module");
  const video = document.querySelector("video");

  if (!video) {
    return;
  }

  const videoContainer = document.querySelector(
    "div#container.style-scope.ytd-player"
  );

  const adElement = videoContainer.querySelectorAll(
    ".ad-showing, .ad-interrupting"
  );

  if (adElement.length > 0) {
    adElement.forEach(function (ad) {
      if (ad.classList.contains("paused-mode")) {
        ad.classList.add("playing-mode");
        ad.classList.remove("paused-mode");
      }
    });

    if (video.paused) {
      console.log("広告を強制再生");
      video.play();
    }

    console.log("youTubePlayerAdKiller : 広告スキップ");
    video.style.filter = "brightness(0%)";
    video.volume = 0;

    const duration = video.duration;
    if (video.currentTime < duration) {
      video.currentTime = duration;
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

function miniPlayerAdKiller() {
  const video = document.querySelector("video");
  if (!video) {
    return;
  }

  const videoContainer = document.querySelector(
    "div#container.style-scope.ytd-player"
  );

  const adElement = videoContainer.querySelectorAll(
    ".ad-showing, .ad-interrupting"
  );

  if (adElement.length > 0) {
    adElement.forEach(function (ad) {
      if (ad.classList.contains("paused-mode")) {
        ad.classList.add("playing-mode");
        ad.classList.remove("paused-mode");
      }
    });

    if (video.paused) {
      console.log("広告を強制再生");
      video.play();
    }

    console.log("youTubePlayerAdKiller : 広告スキップ");
    video.style.filter = "brightness(0%)";
    video.volume = 0;

    const duration = video.duration;
    if (video.currentTime < duration) {
      video.currentTime = duration;
    }
  } else {
    if (video.style.filter == "brightness(0%)") {
      video.style.filter = "none";
    }
  }
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
