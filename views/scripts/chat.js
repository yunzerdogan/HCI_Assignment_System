let randomTimes = {};
let messageHistory = JSON.parse(localStorage.getItem('messageHistory')) || {};
let currentChat = localStorage.getItem('currentChat');

function getRandomWorkHour(tutorName) {
  if (!randomTimes[tutorName]) {
    const hour = Math.floor(Math.random() * (17 - 9 + 1)) + 9;
    const minute = Math.floor(Math.random() * 60); 
    randomTimes[tutorName] = { hour, minute };
  }
  return randomTimes[tutorName];
}

function formatTime(hour, minute) {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

function saveMessageHistory() {
  localStorage.setItem('messageHistory', JSON.stringify(messageHistory));
}

function updateLastMessage(tutorName, message) {
  const tutorBox = document.querySelector(`.tutor-box[onclick*="${tutorName}"] p`);
  if (tutorBox) {
    tutorBox.textContent = `Letzte Nachricht: ${message}`;
  }
}

function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  if (message) {
    const messages = document.getElementById('messages');
    
    // Create user message container
    const userMessageContainer = document.createElement('div');
    userMessageContainer.classList.add('message-container', 'user-message-container');
    
    // Create user message box
    const userMessageBox = document.createElement('div');
    userMessageBox.classList.add('message-box', 'user-message');
    const userMessageText = document.createElement('h4');
    userMessageText.textContent = message;
    const userTimestamp = document.createElement('div');
    userTimestamp.classList.add('timestamp');
    const now = new Date();
    userTimestamp.textContent = `Send: ${formatTime(now.getHours(), now.getMinutes())}`;
    userMessageBox.appendChild(userMessageText);
    userMessageBox.appendChild(userTimestamp);
    userMessageContainer.appendChild(userMessageBox);
    messages.appendChild(userMessageContainer);

    // Save user message to history
    const chatTitle = document.getElementById('chatTitle').textContent;
    if (!messageHistory[chatTitle]) {
      messageHistory[chatTitle] = [];
    }
    messageHistory[chatTitle].push({ type: 'user', text: message, timestamp: now });
    saveMessageHistory();

    // Create automatic reply container
    const replyMessageContainer = document.createElement('div');
    replyMessageContainer.classList.add('message-container');
    
    // Create automatic reply
    const replyMessageBox = document.createElement('div');
    replyMessageBox.classList.add('message-box', 'tutor-message');
    const replyMessageText = document.createElement('h4');
    replyMessageText.textContent = 'Ok';
    const replyTimestamp = document.createElement('div');
    replyTimestamp.classList.add('timestamp');
    replyTimestamp.textContent = `Send: ${formatTime(now.getHours(), now.getMinutes())}`;
    replyMessageBox.appendChild(replyMessageText);
    replyMessageBox.appendChild(replyTimestamp);
    replyMessageContainer.appendChild(replyMessageBox);
    messages.appendChild(replyMessageContainer);

    // Save reply message to history
    messageHistory[chatTitle].push({ type: 'tutor', text: 'Ok', timestamp: now });
    saveMessageHistory();

    // Update last message in sidebar
    const lastMessage = messageHistory[chatTitle].slice(-1)[0].text;
    const tutorName = chatTitle.split(' ')[2];
    updateLastMessage(tutorName, lastMessage);

    input.value = '';
  }
}

function switchChat(tutorName, initialMessage) {
  currentChat = tutorName;
  localStorage.setItem('currentChat', currentChat);

  const now = new Date();
  let formattedDate;
  if (tutorName === 'Tutor 3') {
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);
    formattedDate = `${twoDaysAgo.getDate().toString().padStart(2, '0')}.${(twoDaysAgo.getMonth() + 1).toString().padStart(2, '0')}.${twoDaysAgo.getFullYear()}`;
  } else {
    formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
  }
  const chatTitle = `Chat mit ${tutorName}`;
  document.getElementById('chatTitle').textContent = chatTitle;
  document.querySelector('.lastchat').textContent = `Last Chat with "${tutorName}" on ${formattedDate}`;
  const messages = document.getElementById('messages');
  messages.innerHTML = '';

  // Load chat history
  if (messageHistory[chatTitle]) {
    messageHistory[chatTitle].forEach(msg => {
      const messageContainer = document.createElement('div');
      messageContainer.classList.add('message-container');
      if (msg.type === 'user') {
        messageContainer.classList.add('user-message-container');
      }
      const messageBox = document.createElement('div');
      messageBox.classList.add('message-box', msg.type === 'user' ? 'user-message' : 'tutor-message');
      const messageText = document.createElement('h4');
      messageText.textContent = msg.text;
      const timestamp = document.createElement('div');
      timestamp.classList.add('timestamp');
      timestamp.textContent = `Send: ${formatTime(new Date(msg.timestamp).getHours(), new Date(msg.timestamp).getMinutes())}`;
      messageBox.appendChild(messageText);
      messageBox.appendChild(timestamp);
      messageContainer.appendChild(messageBox);
      messages.appendChild(messageContainer);
    });
  } else {
    // Create initial message container
    const initialMessageContainer = document.createElement('div');
    initialMessageContainer.classList.add('message-container');
    
    // Create initial message box
    const initialMessageBox = document.createElement('div');
    initialMessageBox.classList.add('message-box', 'tutor-message');
    const messageText = document.createElement('h4');
    messageText.textContent = initialMessage;
    const timestamp = document.createElement('div');
    timestamp.classList.add('timestamp');
    const { hour, minute } = getRandomWorkHour(tutorName);
    timestamp.textContent = `Send: ${formatTime(hour, minute)}`;
    initialMessageBox.appendChild(messageText);
    initialMessageBox.appendChild(timestamp);
    initialMessageContainer.appendChild(initialMessageBox);
    messages.appendChild(initialMessageContainer);

    // Save initial message to history
    messageHistory[chatTitle] = [{ type: 'tutor', text: initialMessage, timestamp: new Date(now.setHours(hour, minute)) }];
    saveMessageHistory();
  }

  // Update last message in sidebar
  const lastMessage = messageHistory[chatTitle].slice(-1)[0].text;
  updateLastMessage(tutorName, lastMessage);
}

// Initialize chat with the current chat
document.addEventListener('DOMContentLoaded', () => {
  // Update the last message in the sidebar for each tutor
  document.querySelectorAll('.tutor-box').forEach(box => {
    const tutorName = box.querySelector('h4').textContent.split(' - ')[0];
    const chatTitle = `Chat mit ${tutorName}`;
    if (messageHistory[chatTitle]) {
      const lastMessage = messageHistory[chatTitle].slice(-1)[0].text;
      updateLastMessage(tutorName, lastMessage);
    } else {
      updateLastMessage(tutorName, '');
    }
  });

  const initialMessageElement = document.querySelector(`.tutor-box[onclick*="${currentChat}"] p`);
  const initialMessage = initialMessageElement ? initialMessageElement.textContent.split(': ')[1] || 'Kann ich helfen?' : 'Kann ich helfen?';
  switchChat(currentChat, initialMessage);
});

document.getElementById('messageInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});