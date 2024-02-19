const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    //ショート動画を消したい場合はtrue、消したくない場合はfalseに設定
    const shortKiller = true;

    if (window.location.href === "https://www.youtube.com/") {
      const ytdAdElements = document.querySelectorAll(
        "ytd-in-feed-ad-layout-renderer.style-scope.ytd-ad-slot-renderer, ytd-ad-slot-renderer.style-scope.ytd-rich-item-renderer, div#masthead-ad.style-scope.ytd-rich-grid-renderer"
      );
      if (ytdAdElements.length > 0) {
        ytdAdElements.forEach((element) => {
          //console.log("YouTubeホーム : 広告を削除しました");
          element.remove();
        });
      }

      if (shortKiller) {
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
    } else if (
      window.location.href.includes("https://www.youtube.com/watch?")
    ) {
      if (mutation.addedNodes.length || mutation.removedNodes.length) {
        const skipButton = document.querySelector(
          ".ytp-ad-skip-button-modern.ytp-button"
        );
        if (skipButton) {
          //console.log("YouTube動画再生ページ : スキップボタンをクリックします。");
          skipButton.click();
        } else {
          const adModule = document.querySelector(".video-ads.ytp-ad-module");
          const video = document.querySelector("video");
          if (adModule && isElementVisible(adModule)) {
            video.style.opacity = 0;
            video.volume = 0;
            if (video.currentTime <= video.duration) {
              //console.log("YouTube動画再生ページ : 広告をスキップします");
              video.currentTime = video.duration + 1;
            }
          } else {
            if (video.style.opacity != 1) {
              video.style.opacity = 1;
            }
          }
        }
      }

      const playerAds = document.querySelectorAll(
        "div#player-ads.style-scope.ytd-watch-flexy, ytd-ad-slot-renderer.style-scope.ytd-watch-next-secondary-results-renderer"
      );
      if (playerAds.length > 0) {
        playerAds.forEach((element) => {
          //console.log("YouTube動画再生ページ : 広告を削除しました");
          element.remove();
        });
      }
    }
  });
});

function isElementVisible(element) {
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

const config = { childList: true, subtree: true };
observer.observe(document.body, config);
