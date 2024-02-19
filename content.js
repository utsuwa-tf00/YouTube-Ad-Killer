const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    //ショート動画を消したい場合はtrue、消したくない場合はfalseに設定
    const shortKiller = true;

    const adModule = document.querySelector(".video-ads.ytp-ad-module");
    const skipButton = document.querySelector(
      ".ytp-ad-skip-button-modern.ytp-button"
    );
    const ytdytdInFeedAdLayout = document.querySelector(
      "ytd-in-feed-ad-layout-renderer.style-scope.ytd-ad-slot-renderer"
    );
    const ytdAdSlotRenderer = document.querySelector(
      "ytd-ad-slot-renderer.style-scope.ytd-rich-item-renderer"
    );
    const playerAds = document.querySelector(
      "div#player-ads.style-scope.ytd-watch-flexy"
    );
    const video = document.querySelector("video");

    const short = document.querySelector("ytd-rich-shelf-renderer");
    const homeShortTab = document.querySelector('a#endpoint[title="ショート"]');

    if (ytdytdInFeedAdLayout) {
      console.log("広告動画サムネイルを削除しました");
      ytdytdInFeedAdLayout.remove();
    }

    if (ytdAdSlotRenderer) {
      console.log("広告画像サムネイルを削除しました");
      ytdAdSlotRenderer.remove();
    }

    if (playerAds) {
      console.log("広告表示を削除しました");
      playerAds.remove();
    }

    if (short && shortKiller) {
      console.log("ショート動画を削除しました");
      short.remove();
    }

    if (homeShortTab && shortKiller) {
      console.log("ホーム画面のショートのタブを削除しました");
      homeShortTab.parentElement.remove();
    }

    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      if (skipButton) {
        console.log("スキップボタンをクリックします。");
        skipButton.click();
      } else if (video) {
        if (adModule && isElementVisible(adModule)) {
          video.style.opacity = 0;
          video.volume = 0;
          if (video.currentTime <= video.duration) {
            console.log("広告をスキップします");
            7;
            video.currentTime = video.duration + 1;
          }
        } else {
          if (video.style.opacity != 1) {
            video.style.opacity = 1;
          }
        }
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
