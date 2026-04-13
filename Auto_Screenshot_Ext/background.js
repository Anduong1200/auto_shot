let isRunning = false;
let currentTabId = null;
let count = 0;
let runConfig = {};
let processingLock = false;
let imagesCapturedThisSession = 0; // Đếm số ảnh đã thực chụp trong lần bấm Start này

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "start") {
    isRunning = true;
    currentTabId = msg.tabId;
    runConfig = msg.config;
    count = runConfig.startIndex ? runConfig.startIndex - 1 : 0; // Đặt chỉ mục đếm bằng start - 1
    imagesCapturedThisSession = 0;
    processingLock = false;
    console.log("[AutoScreenshot] ▶ Bắt đầu", runConfig);
    doCapture();
    return;
  }
  if (msg.action === "stop") {
    stop("Người dùng dừng");
    return;
  }
  if (msg.action === "getStatus") {
    sendResponse({ isRunning, count });
    return true;
  }
});

function doCapture() {
  if (!isRunning || processingLock) return;
  processingLock = true;

  chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
    if (chrome.runtime.lastError) {
      stop("Lỗi chụp: " + chrome.runtime.lastError.message);
      return;
    }
    
    count++; // Lên số (VD: start = 21 -> -1 = 20 -> ++ = 21)
    imagesCapturedThisSession++; // Đếm số lượng thực tế đã chụp

    // --- BẢO VỆ TÊN FILE NGUY HIỂM ---
    let cleanSub = runConfig.subfolder || '';
    cleanSub = cleanSub.replace(/^[a-zA-Z]:/, ""); 
    cleanSub = cleanSub.replace(/\\/g, '/');
    cleanSub = cleanSub.replace(/^\/+/, '').replace(/\/+$/, '');
    cleanSub = cleanSub.replace(/[:*?"<>|]/g, '_');

    let cleanPrefix = runConfig.prefix || 'Trang';
    cleanPrefix = cleanPrefix.replace(/[:*?"<>|/\\]/g, '_');

    const folderPath = cleanSub.length > 0 ? cleanSub + '/' : '';
    const filename = `${folderPath}${cleanPrefix}_${String(count).padStart(3, '0')}.png`;

    chrome.downloads.download({
      url: dataUrl,
      filename: filename,
      saveAs: false,
      conflictAction: 'uniquify'
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        stop("Lỗi download: " + chrome.runtime.lastError.message);
        return;
      }
      broadcastToPopup({ action: "updateCount", count });
      
      // KIỂM TRA GIỚI HẠN DỰA TRÊN SỐ LƯỢNG MỤC TIÊU MONG MUỐN
      // Ví dụ: Bắt đầu 21, Dừng ở 50 -> Nghĩa là chụp làm sao cho đến tấm thứ 50 thì ngưng.
      // Do đó nếu count >= limit thì dừng luôn.
      if (runConfig.limit > 0 && count >= runConfig.limit) {
        stop(`Hoàn tất / Đạt mục tiêu ${runConfig.limit} ảnh`);
        return;
      }
      
      clickNextAndContinue();
    });
  });
}

function clickNextAndContinue() {
  if (!isRunning) return;

  chrome.scripting.executeScript({
    target: { tabId: currentTabId },
    func: injectedClickNext,
    args: [runConfig.selector]
  }, (results) => {
    if (chrome.runtime.lastError) {
      stop("Đã dừng (Trang web bị đóng hoặc mất kết nối)");
      return;
    }

    const clicked = results && results[0] && results[0].result;
    if (!clicked) {
      stop("Hoàn tất / Không tìm thấy nút Next");
      return;
    }
    
    setTimeout(() => {
      processingLock = false;
      if (isRunning) doCapture();
    }, runConfig.delay || 1500);
  });
}

function injectedClickNext(selector) {
  const btn = document.querySelector(selector);
  if (!btn || btn.disabled) return false;
  const cs = window.getComputedStyle(btn);
  if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
  btn.click();
  return true;
}

function stop(reason) {
  isRunning = false;
  processingLock = false;
  broadcastToPopup({ action: "stopped", reason });
}

function broadcastToPopup(message) {
  chrome.runtime.sendMessage(message).catch(() => {});
}
