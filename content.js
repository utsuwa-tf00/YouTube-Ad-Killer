const observer = new MutationObserver((mutations) => {
  let skipButtonFound = false;
  let adModuleVisible = false;

  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      // ここで一度だけ要素を取得
      const skipButton = document.querySelector(
        ".ytp-ad-skip-button-modern.ytp-button"
      );
      const video = document.querySelector("video");

      if (skipButton && !skipButtonFound) {
        console.log("スキップボタンをクリックします。");
        skipButton.click();
        skipButtonFound = true; // スキップボタンが見つかったことを記録
      }

      if (video && !adModuleVisible) {
        const adModule = document.querySelector(".video-ads.ytp-ad-module");
        adModuleVisible = adModule && isElementVisible(adModule); // 広告モジュールの可視性をチェック

        if (adModuleVisible) {
          console.log("広告をスキップします");
          video.style.opacity = 0;
          video.volume = 0;
          video.currentTime = video.duration;
        } else {
          video.style.opacity = 1;
          video.volume = 1; // 音量を元に戻す（必要に応じて）
        }
      }
    }
  });

  // 広告サムネイルとミニウィンドウの削除を一度だけ実行
  document
    .querySelectorAll(
      "ytd-in-feed-ad-layout-renderer.style-scope.ytd-ad-slot-renderer"
    )
    .forEach((element) => {
      console.log("広告サムネイルを削除しました");
      element.remove();
    });

  const adMiniWindow = document.querySelector(
    "div#player-ads.style-scope.ytd-watch-flexy"
  );
  if (adMiniWindow) {
    console.log("広告表示を削除しました");
    adMiniWindow.remove();
  }
});

function isElementVisible(element) {
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

const config = { childList: true, subtree: true };
observer.observe(document.body, config);
