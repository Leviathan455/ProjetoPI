document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const adminConfigBtn = document.getElementById('adminConfigBtn');

  if (!username || !token) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('username').textContent = username;

  try {
    const decoded = parseJwt(token);
    const isAdmin = decoded.role === 'admin' || decoded.permissao === 'admin' || decoded.isAdmin;
    if (!isAdmin && adminConfigBtn) {
      adminConfigBtn.style.display = 'none';
    }
  } catch (err) {
    console.error('Erro ao decodificar token:', err);
    if (adminConfigBtn) adminConfigBtn.style.display = 'none';
  }

  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    return JSON.parse(jsonPayload);
  }

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
  });

  const chatMessages = document.getElementById('chatMessages');
  const userInput = document.getElementById('userInput');
  const sendButton = document.getElementById('sendButton');
  let conversationId = null;

  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage('user', message);
    userInput.value = '';

    try {
      const response = await fetch('/api/chatbot/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId, // null se for a primeira
          message
        })
      });

      const data = await response.json();

      if (!conversationId && data.conversationId) {
        conversationId = data.conversationId;
      }

      addMessage('bot', data.response);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      addMessage('bot', 'Desculpe, ocorreu um erro. Tente novamente.');
    }
  }

  function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  sendButton.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });


});
