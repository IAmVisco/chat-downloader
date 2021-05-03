const form = document.getElementById('urlForm');
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
}

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

}

const fetchChatInfo = async (taskId) => {
  const PREVIEW_LIMIT = 5000;
  tableBody.innerHTML = '';
  const response = await fetch(`/chat/${taskId}`)
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
    }
    total.innerHTML = data.length;
    if (data.length > PREVIEW_LIMIT) {
      const loadAnyway = document.createElement('a');
      loadAnyway.innerHTML = 'Show preview anyway';
      loadAnyway.className = 'link-info';
      loadAnyway.href = '#';
      loadAnyway.onclick = () => insertMessagesIntoDOM(tableBody, data, taskId);
      total.parentElement.insertAdjacentText('beforeend', `Preview for more than ${PREVIEW_LIMIT} messages is disabled by default. `)
      total.parentElement.appendChild(loadAnyway);
    } else {
      insertMessagesIntoDOM(tableBody, data, taskId);
    }
  }
  toggleButton();
}

const checkTaskStatus = async (taskId) => {
  const response = await fetch(`/chat/status/${taskId}`)
  const data = await response.json()
  if (data.state !== 'PENDING') {
    clearInterval(intervalRef);
    fetchChatInfo(taskId);
  }
}

form.onsubmit = async (e) => {
  e.preventDefault();
  toggleButton();
  const urlInput = document.getElementById('url');
  const response = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: urlInput.value }),
  })
  const data = await response.json();
  intervalRef = setInterval(() => checkTaskStatus(data.id), 500);
}