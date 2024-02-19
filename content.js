const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const adModule = document.querySelector(".video-ads.ytp-ad-module");
    const skipButton = document.querySelector(
      ".ytp-ad-skip-button-modern.ytp-button"
    );
    const adThumbnail = document.querySelectorAll(
      "ytd-in-feed-ad-layout-renderer.style-scope.ytd-ad-slot-renderer"
    );
    const adMiniWindow = document.querySelector(
      "div#player-ads.style-scope.ytd-watch-flexy"
    );
    const video = document.querySelector("video");
    4;

    if (adThumbnail.length > 0) {
      adThumbnail.forEach(function (element) {
        console.log("広告サムネイルを削除しました");
        element.remove();
      });
    }

    if (adMiniWindow) {
      console.log("広告表示を削除しました");
      adMiniWindow.remove();
    }

    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      if (skipButton) {
        console.log("スキップボタンをクリックします。");
        skipButton.click();
      } else if (video) {
        if (adModule && isElementVisible(adModule)) {
          //video.style.filter = "brightness(0%)";
          video.style.opacity = 0;
          video.volume = 0;
          if (video.currentTime <= video.duration) {
            console.log("広告をスキップします");
            7;
            video.currentTime = video.duration + 1;
          }
          //video.playbackRate = 16;
        } else {
          //if (video.style.filter != "") {video.style.filter = "";}
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
