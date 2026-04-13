const startBtn   = document.getElementById('startBtn');
const stopBtn    = document.getElementById('stopBtn');
const statusBar  = document.getElementById('statusBar');
const statusText = document.getElementById('statusText');
const countText  = document.getElementById('countText');
const delaySlider = document.getElementById('delay');
const delayValue  = document.getElementById('delayValue');

delaySlider.addEventListener('input', () => {
  delayValue.textContent = delaySlider.value + 's';
});

// Restore saved preferences
chrome.storage.local.get(['subfolder', 'prefix', 'selector', 'limit', 'startIndex'], (res) => {
  if (res.subfolder) document.getElementById('subfolder').value = res.subfolder;
  if (res.prefix) document.getElementById('prefix').value = res.prefix;
  if (res.selector) document.getElementById('selector').value = res.selector;
  if (res.limit !== undefined) document.getElementById('limit').value = res.limit;
  if (res.startIndex !== undefined) document.getElementById('startIndex').value = res.startIndex;
});

// Restore running state
chrome.runtime.sendMessage({ action: "getStatus" }, (res) => {
  if (res && res.isRunning) showRunningState(res.count);
});

startBtn.addEventListener('click', async () => {
  const subfolder = document.getElementById('subfolder').value.trim();
  const prefix   = document.getElementById('prefix').value.trim();
  const selector = document.getElementById('selector').value.trim();
  const limit    = parseInt(document.getElementById('limit').value, 10) || 0;
  const startIndex = parseInt(document.getElementById('startIndex').value, 10) || 1;
  const delay    = parseFloat(delaySlider.value) * 1000;

  if (!subfolder) { alert("Nhập tên thư mục!"); return; }
  if (!prefix) { alert("Nhập tiền tố!"); return; }

  // Save preferences
  chrome.storage.local.set({ subfolder, prefix, selector, limit, startIndex });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.runtime.sendMessage({
    action: "start",
    tabId: tab.id,
    config: { subfolder, prefix, selector, limit, startIndex, delay }
  });

  showRunningState(startIndex - 1);
});

stopBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "stop" });
  showStoppedState("Người dùng dừng");
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "updateCount") countText.textContent = msg.count;
  if (msg.action === "stopped") showStoppedState(msg.reason || "Đã dừng");
});

function showRunningState(count) {
  startBtn.style.display = 'none';
  stopBtn.style.display = 'block';
  statusBar.classList.add('active');
  statusText.textContent = 'Đang chạy...';
  statusText.className = 'status-value running';
  countText.textContent = count || 0;
}

function showStoppedState(reason) {
  startBtn.style.display = 'block';
  stopBtn.style.display = 'none';
  statusText.textContent = 'Đã dừng (' + reason + ')';
  statusText.className = 'status-value stopped';
}
