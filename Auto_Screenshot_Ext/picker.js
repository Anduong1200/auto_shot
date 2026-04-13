const pickBtn = document.getElementById('pickBtn');
const successMsg = document.getElementById('successMsg');

pickBtn.addEventListener('click', async () => {
  try {
    // Open directory picker
    const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
    
    // Save to IndexedDB
    await saveDirHandle(handle);
    
    // Save folder name to chrome storage for the popup to show
    chrome.storage.local.set({ savedFolder: handle.name });

    // Notify background / popup that folder is ready
    chrome.runtime.sendMessage({ action: "folderSelected", folder: handle.name });

    // Show success and close tab
    pickBtn.style.display = 'none';
    successMsg.style.display = 'block';
    
    setTimeout(() => {
      window.close();
    }, 1500);

  } catch (err) {
    if (err.name !== 'AbortError') {
      alert("Lỗi khi chọn thư mục: " + err.message);
    }
  }
});
