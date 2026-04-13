let dirHandle = null;

document.getElementById('pickBtn').addEventListener('click', async () => {
  try {
    dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
    document.getElementById('pickBtn').style.display = 'none';
    document.getElementById('statusMsg').style.display = 'block';
    console.log("[Saver] Đã nhận quyền truy cập thư mục:", dirHandle.name);
    
    // Báo cho background biết Saver Tab đã sẵn sàng
    chrome.runtime.sendMessage({ action: "saverReady", folder: dirHandle.name });
  } catch (err) {
    if (err.name !== 'AbortError') {
      alert("Lỗi cấp quyền: " + err.message);
    }
  }
});

function base64ToBlob(dataUrl) {
  const parts = dataUrl.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}

// Lắng nghe lệnh lưu ảnh từ background.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "pingSaver") {
    sendResponse({ ready: dirHandle !== null, folder: dirHandle ? dirHandle.name : null });
    return true;
  }

  if (msg.action === "saveImageDirect") {
    if (!dirHandle) {
      sendResponse({ success: false, error: "Chưa cấp quyền thư mục bên thẻ Saver!" });
      return true;
    }

    (async () => {
      try {
        const fileHandle = await dirHandle.getFileHandle(msg.filename, { create: true });
        const writable = await fileHandle.createWritable();
        const blob = base64ToBlob(msg.dataUrl);
        await writable.write(blob);
        await writable.close();
        
        console.log("[Saver] Đã lưu:", msg.filename);
        sendResponse({ success: true });
      } catch (err) {
        console.error("[Saver] Lỗi lưu file:", err);
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true; // Cho biết sẽ trả lời async
  }
});
