/**
 * CyberBot - AI Chatbot for TECH 3498 Portfolio
 * Provides intelligent, instant answers about Ronald's profile,
 * TECH 3498 IT Computer Security course, goals, and cybersecurity tips.
 */

(function () {
  // Knowledge Base
  const KB = {
    profile: {
      name: "Ronald De La Cruz Acevedo",
      major: "Information Technology",
      year: "Junior",
      career: "Troubleshooting Problems (with an interest in exploring cybersecurity career pathways)",
      hobbies: "Rhythm Games, Fighting Games, and Trading Card Games (TCG)",
      strengths: "Technical Mindset and Analytical Inquiry",
      whyTaking: "I am taking this course to improve my knowledge and skills in cybersecurity, using the experience to decide whether to pursue a career in cybersecurity or not."
    },
    course: {
      name: "IT Computer Security",
      code: "TECH 3498",
      semester: "Fall 2026",
      focus: "System and network defense, security architecture (CIA triad), firewalls, cryptography & PKI, vulnerability management, and threat mitigation."
    },
    goals: [
      { id: 1, title: "Master Core Security & Audit Tooling", target: "20%", desc: "Fluency with Wireshark, Nmap, OpenVAS, and Linux utilities in virtual labs." },
      { id: 2, title: "Apply Defensive System Hardening", target: "20%", desc: "Defense-in-depth, least-privilege access, and firewall configuration." },
      { id: 3, title: "Prepare for Professional Certification", target: "20%", desc: "Align with CompTIA Security+ or ISC2 SSCP certification objectives." },
      { id: 4, title: "Achieve Coursework & Lab Excellence", target: "20%", desc: "High academic performance, rigorous lab reports, and peer collaboration." }
    ],
    techInterests: [
      { title: "SQL Database Systems", desc: "Relational database modeling, complex joins, indexing, query optimization, and SQL injection prevention." },
      { title: "Homelab & Virtualization", desc: "Self-hosting simulated enterprise networks, hypervisors, and testing with Proxmox." },
      { title: "Cloud", desc: "Cloud infrastructure security, IAM policies, AWS/Azure configurations, and container workload isolation." },
      { title: "Linux Server Management", desc: "System administration, CLI operations, permissions, service orchestration, and OS hardening." }
    ],
    project: {
      title: "AI-Powered SQL Database Analytics Platform",
      desc: "A web application created by Ronald that integrates relational SQL databases with AI to dynamically query, inspect, and analyze databases using SQL commands and natural language prompts."
    },
    tip: "Enforce Multi-Factor Authentication (MFA) & Use a Password Manager: Over 80% of breaches involve compromised passwords. Enabling MFA blocks over 99% of bulk automated attacks according to CISA and Microsoft research!"
  };

  // Chat Responses Matcher
  function getBotResponse(input) {
    const text = input.toLowerCase().trim();

    // Greetings
    if (/^(hi|hello|hey|greetings|howdy|sup|good (morning|afternoon|evening))\b/.test(text)) {
      return `Hello! 👋 I'm <strong>CyberBot</strong>, Ronald's portfolio assistant for <strong>TECH 3498</strong>. How can I help you today? You can ask me about Ronald's profile, his course details, goals, or technical interests!`;
    }

    // Who are you / Bot Identity
    if (text.includes("who are you") || text.includes("what are you") || text.includes("your name")) {
      return `I am <strong>CyberBot</strong> 🤖, an interactive portfolio assistant built to answer questions about Ronald De La Cruz Acevedo's coursework in <strong>TECH 3498: IT Computer Security</strong>.`;
    }

    // Student identity / name / major / year
    if (text.includes("name") || text.includes("who is") || text.includes("student") || text.includes("about ronald") || text.includes("about you")) {
      return `<strong>Student Profile:</strong><br>
      👤 <strong>Name:</strong> ${KB.profile.name}<br>
      🎓 <strong>Major:</strong> ${KB.profile.major}<br>
      📅 <strong>Year:</strong> ${KB.profile.year}<br>
      🎯 <strong>Career Interest:</strong> ${KB.profile.career}<br>
      🔗 <a href="about.html" class="text-info text-decoration-underline">Visit the About Me page &rarr;</a>`;
    }

    // Major / Academic program
    if (text.includes("major") || text.includes("program") || text.includes("study") || text.includes("degree")) {
      return `Ronald is a <strong>${KB.profile.year}</strong> majoring in <strong>${KB.profile.major}</strong>. <a href="about.html" class="text-info text-decoration-underline">Learn more on About Me</a>.`;
    }

    // Year of study
    if (text.includes("year") || text.includes("junior") || text.includes("senior") || text.includes("sophomore")) {
      return `Ronald is currently a <strong>${KB.profile.year}</strong> in the ${KB.profile.major} program. <a href="about.html" class="text-info text-decoration-underline">View student profile</a>.`;
    }

    // Why taking the course
    if (text.includes("why") || text.includes("reason") || text.includes("motivation") || text.includes("taking this course") || text.includes("enroll")) {
      return `<strong>Why Ronald is taking this course:</strong><br>
      <em>"${KB.profile.whyTaking}"</em><br>
      🔗 <a href="about.html" class="text-info text-decoration-underline">Read more on About Me</a>.`;
    }

    // Security Control Page / Webpage Modifiers
    if (text.includes("security page") || text.includes("control page") || text.includes("control room") || text.includes("modify") || text.includes("palette") || text.includes("console")) {
      return `🛡️ <strong>Security Control Console:</strong><br>
      The <strong>Security Control Page</strong> (<code>security.html</code>) is an administrative console accessible from any page when logged in.<br>
      It features the <strong>Webpage Color Palette Modifier</strong> which lets administrators dynamically change the site's accent theme across all webpages in real time (Cyan Matrix, Terminal Emerald, Crimson Threat, Incident Amber, Cyber Ultraviolet, or Electric Blue).<br>
      🔗 <a href="security.html" class="text-warning text-decoration-underline">Access Security Control Page &rarr;</a>`;
    }

    // Current Course / Class information
    if (text.includes("course") || text.includes("class") || text.includes("tech 3498") || text.includes("3498") || text.includes("semester") || text.includes("security")) {
      return `<strong>Course Information:</strong><br>
      📚 <strong>Course:</strong> ${KB.course.name}<br>
      🏷️ <strong>Course Number:</strong> ${KB.course.code}<br>
      🗓️ <strong>Semester:</strong> ${KB.course.semester}<br>
      🛡️ <strong>Focus:</strong> ${KB.course.focus}<br>
      🔗 <a href="cybersecurity.html" class="text-info text-decoration-underline">Visit the CyberSecurity page &rarr;</a>`;
    }

    // Goals / Competency / Progress
    if (text.includes("goal") || text.includes("target") || text.includes("competency") || text.includes("milestone") || text.includes("progress") || text.includes("percent") || text.includes("20")) {
      let goalsHtml = `<strong>Course Goals for TECH 3498 (Target: 20% each):</strong><ul class="mb-1 ps-3 mt-1">`;
      KB.goals.forEach(g => {
        goalsHtml += `<li><strong>${g.title} (${g.target})</strong>: ${g.desc}</li>`;
      });
      goalsHtml += `</ul>🔗 <a href="cybersecurity.html#goals" class="text-info text-decoration-underline">Track goals on CyberSecurity page &rarr;</a>`;
      return goalsHtml;
    }

    // Technological Interests / Tech Stack
    if (text.includes("tech") || text.includes("homelab") || text.includes("virtualization") || text.includes("cloud") || text.includes("linux") || text.includes("server") || text.includes("technology")) {
      let techHtml = `<strong>Technological Interests:</strong><ul class="mb-1 ps-3 mt-1">`;
      KB.techInterests.forEach(t => {
        techHtml += `<li><strong>${t.title}:</strong> ${t.desc}</li>`;
      });
      techHtml += `</ul>🔗 <a href="technology.html" class="text-info text-decoration-underline">Explore Technological Knowledge page &rarr;</a>`;
      return techHtml;
    }

    // SQL & Database / AI Project
    if (text.includes("sql") || text.includes("database") || text.includes("project") || text.includes("analytics") || text.includes("analyze") || text.includes("website that")) {
      return `🗄️ <strong>${KB.project.title}:</strong><br>
      Ronald has strong knowledge of <strong>SQL database systems</strong> and built a full-stack website that integrates a relational SQL database with Artificial Intelligence! The application translates prompts into SQL commands, inspects schemas, and generates intelligent data analysis.<br>
      🔗 <a href="technology.html" class="text-info text-decoration-underline">View Project Spotlight on the Tech page &rarr;</a>`;
    }

    // Hobbies / Personal interests / Games
    if (text.includes("hobby") || text.includes("hobbies") || text.includes("game") || text.includes("games") || text.includes("tcg") || text.includes("rhythm") || text.includes("fighting") || text.includes("fun") || text.includes("free time")) {
      return `🎮 <strong>Hobbies & Personal Interests:</strong><br>Outside of coursework, Ronald enjoys <strong>${KB.profile.hobbies}</strong>!`;
    }

    // Career interests / job
    if (text.includes("career") || text.includes("job") || text.includes("work") || text.includes("troubleshoot") || text.includes("future")) {
      return `💼 <strong>Career Interests:</strong><br>Ronald is passionate about <strong>${KB.profile.career}</strong>, using his IT and security coursework to solve real-world problems.`;
    }

    // Strengths
    if (text.includes("strength") || text.includes("skills") || text.includes("mindset") || text.includes("analytical")) {
      return `💪 <strong>Core Strengths:</strong><br>Ronald focuses on two primary pillars: <strong>Technical Mindset</strong> (mastering foundational IT protocols & controls) and <strong>Analytical Inquiry</strong> (telemetry inspection & threat investigation).`;
    }

    // Cybersecurity Tip
    if (text.includes("tip") || text.includes("advice") || text.includes("mfa") || text.includes("password") || text.includes("hack") || text.includes("protect") || text.includes("safety")) {
      return `💡 <strong>Cybersecurity Tip:</strong><br>${KB.tip}`;
    }

    // Contact / Links / Socials
    if (text.includes("contact") || text.includes("email") || text.includes("github") || text.includes("reach") || text.includes("linkedin") || text.includes("connect")) {
      return `📬 <strong>Get In Touch:</strong><br>
      You can connect via:<br>
      • <a href="mailto:student@example.com" class="text-info text-decoration-underline">Email Me</a><br>
      • <a href="https://github.com" target="_blank" class="text-info text-decoration-underline">GitHub</a><br>
      • <a href="https://linkedin.com" target="_blank" class="text-info text-decoration-underline">LinkedIn</a>`;
    }

    // Login & Account Credentials
    if (text.includes("login") || text.includes("log in") || text.includes("account") || text.includes("credential") || text.includes("admin")) {
      return `🔐 <strong>Admin Portal Login:</strong><br>
      You can access the login page using the <strong>Login</strong> option in the navbar or visit <a href="login.html" class="text-info text-decoration-underline">login.html</a>.<br>
      Administrative access is restricted to authorized users:<br>
      • <strong>Username:</strong> <code>admin</code><br>
      • Enter your administrator password on the secure login form.<br>
      🔗 <a href="login.html" class="text-info text-decoration-underline">Go to Login Page &rarr;</a>`;
    }

    // Fallback response with suggestions
    return `I'm not completely sure about that, but I can tell you about:
    <div class="mt-2 d-flex flex-wrap gap-1">
      <button class="btn btn-sm btn-outline-info py-0 px-2 quick-ask" data-query="Tell me about Ronald">About Ronald</button>
      <button class="btn btn-sm btn-outline-info py-0 px-2 quick-ask" data-query="What is the current course?">Course Info</button>
      <button class="btn btn-sm btn-outline-info py-0 px-2 quick-ask" data-query="What are Ronald's goals?">Course Goals</button>
      <button class="btn btn-sm btn-outline-info py-0 px-2 quick-ask" data-query="Give me a cybersecurity tip">Security Tip</button>
    </div>`;
  }

  // DOM Elements setup
  document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("chatbot-toggle");
    const chatWindow = document.getElementById("chatbot-window");
    const closeBtn = document.getElementById("chatbot-close");
    const messagesContainer = document.getElementById("chatbot-messages");
    const chatForm = document.getElementById("chatbot-form");
    const chatInput = document.getElementById("chatbot-input");
    const micBtn = document.getElementById("chatbot-mic");

    if (!toggleBtn || !chatWindow || !messagesContainer || !chatForm || !chatInput) {
      return;
    }

    let isFirstOpen = true;

    // Toggle Chat Window
    function toggleChat(open) {
      const shouldOpen = open !== undefined ? open : chatWindow.classList.contains("d-none");
      if (shouldOpen) {
        chatWindow.classList.remove("d-none");
        chatWindow.classList.add("chat-window-slide-in");
        chatInput.focus();
        toggleBtn.classList.add("active");

        if (isFirstOpen) {
          isFirstOpen = false;
          // Initial greeting
          appendBotMessage(
            `👋 Hi there! I'm <strong>CyberBot</strong>, your assistant for Ronald's portfolio. You can type or click the <i class="bi bi-mic text-info"></i> mic button to ask questions using <strong>voice commands</strong>!`,
            true
          );
        }
      } else {
        chatWindow.classList.add("d-none");
        toggleBtn.classList.remove("active");
        if (speechSynthesis.speaking) {
          speechSynthesis.cancel();
        }
      }
    }

    toggleBtn.addEventListener("click", () => toggleChat());
    closeBtn.addEventListener("click", () => toggleChat(false));

    // Append User Message
    function appendUserMessage(text) {
      const msgDiv = document.createElement("div");
      msgDiv.className = "chat-bubble user-bubble";
      msgDiv.textContent = text;
      messagesContainer.appendChild(msgDiv);
      scrollToBottom();
    }

    // Convert HTML response to clean plain text for speech synthesis
    function stripHtml(html) {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    }

    // Text to Speech Helper
    function speakText(text) {
      if (!("speechSynthesis" in window)) return;
      try {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.lang = "en-US";
        speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn("Speech synthesis error:", e);
      }
    }

    // Append Bot Message with simulated typing indicator
    function appendBotMessage(htmlContent, immediate = false, shouldSpeak = false) {
      if (immediate) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "chat-bubble bot-bubble";
        msgDiv.innerHTML = htmlContent;
        messagesContainer.appendChild(msgDiv);
        bindQuickAskButtons(msgDiv);
        scrollToBottom();
        if (shouldSpeak) {
          speakText(stripHtml(htmlContent));
        }
        return;
      }

      // Show typing indicator
      const typingDiv = document.createElement("div");
      typingDiv.className = "chat-bubble bot-bubble typing-indicator";
      typingDiv.innerHTML = `<span></span><span></span><span></span>`;
      messagesContainer.appendChild(typingDiv);
      scrollToBottom();

      // Delay to simulate thinking/typing
      setTimeout(function () {
        if (typingDiv.parentNode) {
          typingDiv.parentNode.removeChild(typingDiv);
        }
        const msgDiv = document.createElement("div");
        msgDiv.className = "chat-bubble bot-bubble";
        msgDiv.innerHTML = htmlContent;
        messagesContainer.appendChild(msgDiv);
        bindQuickAskButtons(msgDiv);
        scrollToBottom();
        if (shouldSpeak) {
          speakText(stripHtml(htmlContent));
        }
      }, 400);
    }

    // Scroll chat history to bottom
    function scrollToBottom() {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Send Message Handler
    function handleSend(spoken = false) {
      const userText = chatInput.value.trim();
      if (!userText) return;

      appendUserMessage(userText);
      chatInput.value = "";

      const botReply = getBotResponse(userText);
      appendBotMessage(botReply, false, spoken);
    }

    chatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleSend(false);
    });

    // Web Speech API - Voice Recognition
    // Web Speech API - Voice Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isListening = false;
    
    if (SpeechRecognition && micBtn) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
    
      recognition.onstart = function () {
        isListening = true;
        micBtn.classList.add("is-listening");
        micBtn.innerHTML = '<i class="bi bi-mic-fill"></i>';
        micBtn.setAttribute("title", "Listening... Speak your command or question");
        chatInput.placeholder = "Listening... Speak now";
      };
    
      recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          chatInput.value = transcript.trim();
          handleSend(true);
        }
      };
    
      recognition.onerror = function (event) {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          appendBotMessage(
            "⚠️ Microphone access was denied or unavailable. Please enable microphone permissions in your browser to use voice commands.",
            true
          );
        }
        stopListening();
      };
    
      recognition.onend = function () {
        stopListening();
      };
    
      function stopListening() {
        isListening = false;
        micBtn.classList.remove("is-listening");
        micBtn.innerHTML = '<i class="bi bi-mic"></i>';
        micBtn.setAttribute("title", "Speak to CyberBot (Voice Command)");
        chatInput.placeholder = "Ask about Ronald or TECH 3498...";
      }
    
      micBtn.addEventListener("click", function () {
        if (isListening) {
          recognition.stop();
        } else {
          try {
            recognition.start();
          } catch (err) {
            console.warn("Recognition start failed:", err);
          }
        }
      });
    } else if (micBtn) {
      // Speech recognition not supported in this browser
      micBtn.setAttribute("title", "Voice commands are not supported in this browser");
      micBtn.addEventListener("click", function () {
        appendBotMessage(
          "ℹ️ Voice recognition is not supported in this browser. For voice commands, please use a modern Chromium-based browser like <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>.",
          true
        );
      });
    }
    

    // Quick suggestion buttons binding
    function bindQuickAskButtons(context = document) {
      const buttons = context.querySelectorAll(".quick-ask");
      buttons.forEach(btn => {
        btn.addEventListener("click", function () {
          const query = this.getAttribute("data-query");
          if (query) {
            appendUserMessage(query);
            const reply = getBotResponse(query);
            appendBotMessage(reply, false, false);
          }
        });
      });
    }

    bindQuickAskButtons();
  });
})();
