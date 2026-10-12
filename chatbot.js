/**
 * CyberBot - AI Chatbot for the TECH 3498 Portfolio
 *
 * Sends messages to the same-origin Vercel endpoint at /api/chat.
 * The OpenAI API key belongs on the server, never in this browser script.
 */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("chatbot-toggle");
    const chatWindow = document.getElementById("chatbot-window");
    const closeBtn = document.getElementById("chatbot-close");
    const messagesContainer = document.getElementById("chatbot-messages");
    const chatForm = document.getElementById("chatbot-form");
    const chatInput = document.getElementById("chatbot-input");
    const micBtn = document.getElementById("chatbot-mic");
    const sendBtn = chatForm
      ? chatForm.querySelector('button[type="submit"]')
      : null;

    if (!toggleBtn || !chatWindow || !messagesContainer || !chatForm || !chatInput) {
      return;
    }

    // Keep recent turns locally so the API can use conversation context.
    const conversation = [];
    let isFirstOpen = true;
    let isSending = false;
    let recognition = null;
    let isListening = false;

    function scrollToBottom() {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function appendMessage(text, sender) {
      const message = document.createElement("div");
      message.className = `chat-bubble ${sender}-bubble`;
      // Treat AI and user content as text, not HTML.
      message.textContent = text;
      messagesContainer.appendChild(message);
      scrollToBottom();
      return message;
    }

    function appendTypingIndicator() {
      const indicator = document.createElement("div");
      indicator.className = "chat-bubble bot-bubble typing-indicator";
      indicator.setAttribute("aria-label", "CyberBot is typing");
      indicator.innerHTML = "<span></span><span></span><span></span>";
      messagesContainer.appendChild(indicator);
      scrollToBottom();
      return indicator;
    }

    function speakText(text) {
      if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.warn("Speech synthesis error:", error);
      }
    }

    async function requestAI(messages) {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          assistant: "portfolio",
          messages: messages.slice(-12)
        })
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("The chat service returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(data.error || "The chat request failed.");
      }

      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("The chat service returned an empty response.");
      }

      return data.reply.trim();
    }

    async function handleSend(shouldSpeak = false) {
      const userText = chatInput.value.trim();

      if (!userText || isSending) return;

      appendMessage(userText, "user");
      chatInput.value = "";
      conversation.push({ role: "user", content: userText });

      isSending = true;
      chatInput.disabled = true;
      if (sendBtn) sendBtn.disabled = true;

      const typingIndicator = appendTypingIndicator();

      try {
        const reply = await requestAI(conversation);
        conversation.push({ role: "assistant", content: reply });

        // Retain the latest six exchanges in this browser session.
        if (conversation.length > 12) {
          conversation.splice(0, conversation.length - 12);
        }

        typingIndicator.remove();
        appendMessage(reply, "bot");

        if (shouldSpeak) {
          speakText(reply);
        }
      } catch (error) {
        console.error("CyberBot request error:", error);
        typingIndicator.remove();

        const message =
          error.message === "Failed to fetch"
            ? "I couldn't reach the chat service. Please try again in a moment."
            : error.message || "Sorry, the chat service is unavailable right now.";

        appendMessage(message, "bot");
      } finally {
        isSending = false;
        chatInput.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        chatInput.focus();
      }
    }

    function stopListening() {
      isListening = false;

      if (micBtn) {
        micBtn.classList.remove("is-listening");
        micBtn.innerHTML = '<i class="bi bi-mic"></i>';
        micBtn.setAttribute("title", "Speak to CyberBot (Voice Command)");
      }

      chatInput.placeholder = "Ask about Ronald or TECH 3498...";
    }

    function toggleChat(open) {
      const shouldOpen =
        open !== undefined ? open : chatWindow.classList.contains("d-none");

      if (shouldOpen) {
        chatWindow.classList.remove("d-none");
        chatWindow.classList.add("chat-window-slide-in");
        toggleBtn.classList.add("active");
        toggleBtn.setAttribute("aria-expanded", "true");
        chatInput.focus();

        if (isFirstOpen) {
          isFirstOpen = false;
          appendMessage(
            "👋 Hi! I'm CyberBot, the AI assistant for Ronald's portfolio. Ask me about Ronald, his technical interests, or TECH 3498.",
            "bot"
          );
        }
      } else {
        chatWindow.classList.add("d-none");
        toggleBtn.classList.remove("active");
        toggleBtn.setAttribute("aria-expanded", "false");

        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }

        if (isListening && recognition) {
          recognition.stop();
        }
      }
    }

    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.addEventListener("click", () => toggleChat());

    if (closeBtn) {
      closeBtn.addEventListener("click", () => toggleChat(false));
    }

    chatForm.addEventListener("submit", function (event) {
      event.preventDefault();
      handleSend(false);
    });

    // Voice recognition is optional and depends on browser support.
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition && micBtn) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = function () {
        isListening = true;
        micBtn.classList.add("is-listening");
        micBtn.innerHTML = '<i class="bi bi-mic-fill"></i>';
        micBtn.setAttribute("title", "Listening… Speak your question");
        chatInput.placeholder = "Listening… Speak now";
      };

      recognition.onresult = function (event) {
        const transcript =
          event.results &&
          event.results[0] &&
          event.results[0][0] &&
          event.results[0][0].transcript;

        if (transcript && transcript.trim()) {
          chatInput.value = transcript.trim();
          handleSend(true);
        }
      };

      recognition.onerror = function (event) {
        console.warn("Speech recognition error:", event.error);

        if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          appendMessage(
            "Microphone access was denied or unavailable. Check your browser's microphone permissions to use voice input.",
            "bot"
          );
        }

        stopListening();
      };

      recognition.onend = stopListening;

      micBtn.addEventListener("click", function () {
        if (isListening) {
          recognition.stop();
          return;
        }

        try {
          recognition.start();
        } catch (error) {
          console.warn("Could not start speech recognition:", error);
        }
      });
    } else if (micBtn) {
      micBtn.setAttribute(
        "title",
        "Voice commands are not supported in this browser"
      );

      micBtn.addEventListener("click", function () {
        appendMessage(
          "Voice recognition is not supported in this browser. Try a supported browser, or type your question instead.",
          "bot"
        );
      });
    }

    // Supports any quick-ask buttons already present in the page.
    document.querySelectorAll(".quick-ask").forEach(button => {
      button.addEventListener("click", function () {
        const query = button.getAttribute("data-query");
        if (!query || isSending) return;

        chatInput.value = query;
        handleSend(false);
      });
    });
  });
})();
