const username = prompt('Your name?')?.trim() || `Guest-${Math.floor(Math.random() * 1000)}`;
const socket = io({
  query: { username }
});

const form = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const messagesEl = document.getElementById('messages');

function appendElement(el) {
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addChatMessage({ username: sender, text, timestamp }) {
  const wrapper = document.createElement('article');
  wrapper.className = 'message';

  const meta = document.createElement('div');
  meta.className = 'meta';
  const time = new Date(timestamp).toLocaleTimeString();
  meta.textContent = `${sender} • ${time}`;

  const body = document.createElement('div');
  body.textContent = text;

  wrapper.append(meta, body);
  appendElement(wrapper);
}

function addSystemMessage(text) {
  const el = document.createElement('div');
  el.className = 'system';
  el.textContent = text;
  appendElement(el);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text) {
    return;
  }

  socket.emit('chat-message', text);
  messageInput.value = '';
  messageInput.focus();
});

socket.on('chat-message', addChatMessage);
socket.on('system-message', ({ text }) => addSystemMessage(text));
