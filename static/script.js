const cacheKey = 'cachedFormData';
const form = document.getElementById('urlForm');
const urlInput = document.getElementById('url');
const scOnlyCheckbox = document.getElementById('scOnly');
const errorAlert = document.getElementById('errorAlert');

const tableBody = document.getElementById('tableBody');

let intervalRef = null;
let isFormButtonDisabled = false;

const toggleButton = () => {
  const formButton = document.getElementById('urlFormButton');
  formButton.disabled = !isFormButtonDisabled;
  formButton.innerHTML = isFormButtonDisabled
    ? 'Load'
    : `Loading... <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
  isFormButtonDisabled = !isFormButtonDisabled;
};

const showError = (message) => {
  errorAlert.innerHTML = message;
  errorAlert.style.display = 'block';
};

const insertMessagesIntoDOM = (table, messages, videoId) => {
  tableBody.innerHTML = '';
  const tableContainer = document.getElementById('resultContainer');
  for (const message of messages) {
    const newRow = table.insertRow();
    const timestamp = message.time > 0 ? message.time.toFixed(0) : 0;
    newRow.innerHTML = `      
      <tr>
        <td><a href="https://youtu.be/${videoId}?t=${timestamp}">${message.time_text}</a></td>
        <td>${message.amount || '-'}</td>
        <td>${message.author}</td>
        <td>${message.message || ''}</td>
      </tr>`;
  }
  tableContainer.style.display = 'block';

};

const fetchChatInfo = async (taskId) => {
  const PREVIEW_LIMIT = 5000;
  tableBody.innerHTML = '';
  const response = await fetch(`/chat/${taskId}`);
  if (response.ok) {
    const data = await response.json();

    const total = document.getElementById('total');
    const downloadCsvButton = document.getElementById('downloadCsvButton');

    downloadCsvButton.onclick = async () => {
      const response = await fetch(`/chat/${taskId}/csv`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${taskId}.csv`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
      }
    };

    total.innerHTML = data.length;
    if (!data.length) {
      const tryDifferentHelperText = document.createElement('span');
      tryDifferentHelperText.innerHTML = 'Maybe try different filters?';
      total.parentElement.appendChild(tryDifferentHelperText);
    }
    if (data.length > PREVIEW_LIMIT) {
      const loadAnywayLink = document.createElement('a');
      loadAnywayLink.innerHTML = 'Show preview anyway';
      loadAnywayLink.className = 'link-info';
      loadAnywayLink.href = '#';
      loadAnywayLink.onclick = () => insertMessagesIntoDOM(tableBody, data, taskId);
      total.parentElement.insertAdjacentText('beforeend', `Preview for more than ${PREVIEW_LIMIT} messages is disabled by default. `);
      total.parentElement.appendChild(loadAnywayLink);
    } else {
      insertMessagesIntoDOM(tableBody, data, taskId);
    }
  } else {
    const error = await response.json();
    showError(error.msg);
  }
  toggleButton();
};

const checkTaskStatus = async (taskId) => {
  const response = await fetch(`/chat/status/${taskId}`);
  const data = await response.json();
  if (data.state !== 'SENT') {
    clearInterval(intervalRef);
    fetchChatInfo(taskId);
  }
};

const loadFormData = () => {
  const formData = JSON.parse(localStorage.getItem(cacheKey) || '{}');
  urlInput.value = formData.url;
  scOnlyCheckbox.checked = formData.scOnly;
};

form.onsubmit = async (e) => {
  e.preventDefault();
  toggleButton();
  errorAlert.style.display = 'none';
  const body = JSON.stringify({ url: urlInput.value, scOnly: scOnlyCheckbox.checked });
  localStorage.setItem(cacheKey, body);

  const response = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (response.ok) {
    const data = await response.json();
    intervalRef = setInterval(() => checkTaskStatus(data.id), 2000);
  } else {
    const error = await response.json();
    showError(error.msg);
  }
};

loadFormData();