const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      // スキップボタンの存在をチェック
      const skipButton = document.querySelector(
        ".ytp-ad-skip-button-modern.ytp-button"
      );
      if (skipButton) {
        console.log("スキップボタンが検出されました。自動でクリックします。");
        skipButton.click();
      } else {
        // 広告が表示されているがスキップボタンがない場合の処理
        checkForAdsAndAdjustPlayback();
      }
    }
  });
});

function checkForAdsAndAdjustPlayback() {
  const adModule = document.querySelector(".video-ads.ytp-ad-module");
  if (adModule && isElementVisible(adModule)) {
    console.log(
      "広告が検出されましたが、スキップできません。ビデオの再生速度を16に設定し、音量を0にします。"
    );
    adjustVideoPlayback();
  }
}

function isElementVisible(element) {
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

function adjustVideoPlayback() {
  const videoElements = document.querySelectorAll("video");
  videoElements.forEach((video) => {
    video.playbackRate = 16;
    video.volume = 0;
  });
}

const config = { childList: true, subtree: true };
observer.observe(document.body, config);
checkForAdsAndAdjustPlayback();
