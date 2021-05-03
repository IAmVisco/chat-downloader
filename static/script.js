const form = document.getElementById('urlForm');
const urlInput = document.getElementById('url');
const formButton = document.getElementById('urlFormButton');
const tableBlock = document.getElementById('resultTable');

let intervalRef = null;
let isFormButtonDisabled = false;

const toggleButton = () => {
  formButton.disabled = !isFormButtonDisabled;
  formButton.innerHTML = isFormButtonDisabled
    ? 'Load'
    : `Loading... <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
  isFormButtonDisabled = !isFormButtonDisabled;
}

const fetchChatInfo = async (taskId) => {
  const response = await fetch(`/chat/${taskId}`)
  toggleButton();
  if (response.ok) {
    const data = await response.json();
    const tableBody = document.getElementById('tableBody');
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
    tableBody.innerHTML = '';
    for (const message of data) {
      const newRow = tableBody.insertRow();
      newRow.innerHTML = `      
      <tr>
        <td><a href="https://youtu.be/${taskId}?t=${message.time > 0 ? message.time.toFixed(0) : 0}">${message.time_text}</a></td>
        <td>${message.amount}</td>
        <td>${message.author}</td>
        <td>${message.message}</td>
      </tr>`;
    }
    tableBlock.style.display = 'block';
  }
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
  const response = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: urlInput.value }),
  })
  const data = await response.json();
  intervalRef = setInterval(() => checkTaskStatus(data.id), 500);
}