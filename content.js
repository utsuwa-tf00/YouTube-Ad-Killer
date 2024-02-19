const observer = new MutationObserver((mutations) => {
  // 広告の表示・非表示に関わるDOM変更を監視
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      // 広告の有無をチェックし、存在する場合は再生速度を設定
      checkForAdsAndAdjustPlayback();
    }
  });
});

// 広告の有無をチェックし、存在する場合は再生速度を設定する関数
function checkForAdsAndAdjustPlayback() {
  const adModule = document.querySelector(".video-ads.ytp-ad-module");
  if (adModule && isElementVisible(adModule)) {
    console.log("広告が検出されました。ビデオの再生速度を16に設定します。");
    setPlaybackRate(16);
  }
}

// 要素の可視性をチェックする関数
function isElementVisible(element) {
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

// ビデオの再生速度を設定する関数
function setPlaybackRate(rate) {
  const videoElements = document.querySelectorAll("video");
  videoElements.forEach((video) => {
    video.playbackRate = rate;
    video.volume = 0; // 音量を0に設定（ミュート）
  });
}

// 監視を開始するための設定
const config = { childList: true, subtree: true };

// YouTubeプレイヤーの要素（またはその他の適切な親要素）に対して監視を開始
observer.observe(document.body, config);

// 初回の広告チェックを実行
checkForAdsAndAdjustPlayback();
