const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.onresult = (e) => {
  const text = e.results[0][0].transcript;
  handleUserPrompt(text);
};
recognition.start();
