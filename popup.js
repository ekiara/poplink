document.addEventListener('DOMContentLoaded', () => {
  const mainMenu = document.getElementById('mainMenu');
  const addSetForm = document.getElementById('addSetForm');
  const addSetBtn = document.getElementById('addSetBtn');
  const saveSetBtn = document.getElementById('saveSetBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const setsList = document.getElementById('setsList');

  // Load and display existing sets
  function loadSets() {
    setsList.innerHTML = '';
    chrome.storage.local.get(null, (data) => {
      for (const [setName, urls] of Object.entries(data)) {
        if (Array.isArray(urls)) {
          const div = document.createElement('div');
          div.className = 'set-item';
          div.textContent = setName;
          div.onclick = () => {
            chrome.runtime.sendMessage({ action: 'openSet', urls });
          };
          setsList.appendChild(div);
        }
      }
    });
  }

  addSetBtn.addEventListener('click', () => {
    mainMenu.classList.add('hidden');
    addSetForm.classList.remove('hidden');
  });

  cancelBtn.addEventListener('click', () => {
    mainMenu.classList.remove('hidden');
    addSetForm.classList.add('hidden');
    document.getElementById('setName').value = '';
    document.getElementById('urlInput').value = '';
  });

  saveSetBtn.addEventListener('click', () => {
    const name = document.getElementById('setName').value.trim();
    const urlsText = document.getElementById('urlInput').value.trim();

    if (!name || !urlsText) {
      alert('Please enter both a set name and at least one URL.');
      return;
    }

    const urls = urlsText
      .split('\n')
      .map(u => u.trim())
      .filter(u => u && (u.startsWith('http://') || u.startsWith('https://')));

    if (urls.length === 0) {
      alert('Please enter valid URLs (must start with http:// or https://).');
      return;
    }

    chrome.storage.local.set({ [name]: urls }, () => {
      mainMenu.classList.remove('hidden');
      addSetForm.classList.add('hidden');
      document.getElementById('setName').value = '';
      document.getElementById('urlInput').value = '';
      loadSets();
    });
  });

  loadSets();
});
