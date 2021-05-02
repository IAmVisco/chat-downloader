const form = document.getElementById('urlForm');
const urlInput = document.getElementById('url');

form.onsubmit = async (e) => {
  e.preventDefault();
  // form.checkValidity();
  const result = await fetch('/chats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: urlInput.value }),
  })
  const data = await result.json();
  console.log(data.id);
}