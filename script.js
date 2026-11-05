/**
 * ============================================================================
 * PORTFOLIO JAVASCRIPT - DAMARLA MANVITHA SRI
 * Vanilla JavaScript (No Frameworks, No Build Step)
 * Designed for AWS Amplify Deployment
 * ============================================================================
 * 
 * Features Included:
 * 1. Mobile Hamburger Menu Toggle & Auto-Close
 * 2. Active Section Highlighting on Scroll
 * 3. Interactive Terminal ("Manvitha-CLI") with Custom Command Parser
 * 4. Real-time Ghost Data Auditor Simulation in Terminal
 * 5. Floating Quick Launcher & Hint Dismissal
 * 6. Quick Action Command Chips for Mobile/Touch Users
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initMobileNav();
  initScrollSpy();
  initTerminal();
  initFloatingLauncher();
  initAuditTrigger();
});

/* ----------------------------------------------------------------------------
   1. MOBILE NAVIGATION TOGGLE
   Controls opening, closing, and keyboard dismissal of mobile navbar.
   ---------------------------------------------------------------------------- */
function initMobileNav() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navLinks) return;

  // Toggle mobile menu on hamburger button click
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Automatically close mobile menu when any navigation link is clicked
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Close mobile menu if user presses Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}

/* ----------------------------------------------------------------------------
   2. SCROLL SPY (ACTIVE NAVIGATION HIGHLIGHTER)
   Highlights the navbar link corresponding to the section currently in view.
   ---------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollPosition = window.scrollY + 120; // Offset for sticky navbar height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink(); // Initial check on load
}

/* ----------------------------------------------------------------------------
   3. CREATIVE FEATURE: INTERACTIVE TERMINAL ("Manvitha-CLI")
   Fully functional terminal emulator allowing visitors to explore background,
   skills, mottos, and run a live cybersecurity Ghost Data Audit simulation.
   ---------------------------------------------------------------------------- */
function initTerminal() {
  const screen = document.getElementById('terminal-screen');
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const chips = document.querySelectorAll('.cmd-chip');
  const closeDot = document.querySelector('.dot-red');

  if (!screen || !form || !input) return;

  // Command history buffer for up/down arrow key recall
  const commandHistory = [];
  let historyIndex = -1;

  // Real data for command responses
  const commands = {
    help: () => [
      '<span class="term-cyan">Available Commands:</span>',
      '  <span class="term-highlight">help</span>        - Display this menu of available commands',
      '  <span class="term-highlight">about</span>       - Print my university, background, and core focus',
      '  <span class="term-highlight">skills</span>      - List technical stack &amp; superpowers',
      '  <span class="term-highlight">ghost-audit</span>  - Run live simulated data privacy audit scan',
      '  <span class="term-highlight">motto</span>       - Display my core engineering philosophy',
      '  <span class="term-highlight">socials</span>     - Output verified links (GitHub, LinkedIn, LeetCode, Devpost)',
      '  <span class="term-highlight">clear</span>       - Clear the terminal screen',
      '<span class="term-muted">Tip: Click any quick command chip above for one-tap execution.</span>'
    ],

    about: () => [
      '<span class="term-cyan">Damarla Manvitha Sri</span>',
      '• University: <span class="term-green">Amrita Vishwa Vidyapeetham</span>',
      '• Degree: 1st-Year B.Tech Computer Science and Engineering (Artificial Intelligence)',
      '• Focus: Artificial Intelligence, Cybersecurity &amp; Data Privacy, Software Development',
      '• Goal: Creating innovative, useful, and responsible technological solutions.'
    ],

    skills: () => [
      '<span class="term-cyan">Technical Toolkit &amp; Superpowers:</span>',
      '• Languages:    <span class="term-green">Python (Primary)</span>, C (Foundations), HTML5, CSS3, JavaScript',
      '• Frameworks:    Streamlit, Pandas, Responsive Web Architecture',
      '• Domains:       Cybersecurity, Data Privacy Auditing, AI/ML Concepts, Problem Solving',
      '• Developer:     Git, GitHub, AWS Amplify Hosting, LeetCode, VS Code'
    ],

    motto: () => [
      '<span class="term-purple">Personal Philosophy:</span>',
      '“A curious learner with the drive to become a creator of impactful technology.”',
      '<span class="term-muted">— Damarla Manvitha Sri</span>'
    ],

    socials: () => [
      '<span class="term-cyan">Verified Professional Profiles (No Email Displayed):</span>',
      '• GitHub:   <a href="https://github.com/DamarlaManvithaSri" target="_blank" class="term-cyan">https://github.com/DamarlaManvithaSri</a>',
      '• LinkedIn: <a href="https://www.linkedin.com/in/damarla-manvitha-sri-9909b9416/" target="_blank" class="term-cyan">https://www.linkedin.com/in/damarla-manvitha-sri-9909b9416/</a>',
      '• LeetCode: <a href="https://leetcode.com/u/ManvithaSriDamarla/" target="_blank" class="term-cyan">https://leetcode.com/u/ManvithaSriDamarla/</a>',
      '• Devpost:  <a href="https://devpost.com/manvithasridamarla" target="_blank" class="term-cyan">https://devpost.com/manvithasridamarla</a>'
    ],

    clear: () => {
      screen.innerHTML = '';
      return [];
    }
  };

  /**
   * Executes a command string and displays output in the terminal log
   */
  window.executeCommand = function(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Save to history
    commandHistory.push(rawCmd);
    historyIndex = commandHistory.length;

    // Append the command line that the visitor ran
    appendLine(`visitor@manvitha:~$ ${escapeHTML(rawCmd)}`, 'term-muted');

    // Handle 'ghost-audit' with a real-time multi-step animation
    if (cmd === 'ghost-audit' || cmd === 'audit') {
      runAuditSimulation();
      return;
    }

    if (commands[cmd]) {
      const outputLines = commands[cmd]();
      outputLines.forEach(line => appendLine(line));
    } else {
      appendLine(`Command not found: "${escapeHTML(rawCmd)}". Type <span class="term-highlight">help</span> for a list of valid commands.`, 'term-rose');
    }

    appendSeparator();
    scrollToBottom();
  };

  /**
   * Simulated Cybersecurity Ghost Data Audit
   * Mirrors the capabilities of Manvitha's Ghost Data Auditor application
   */
  function runAuditSimulation() {
    appendLine('<span class="term-yellow">⏳ Initializing Ghost Data Auditor engine v1.0.0...</span>');
    appendLine('Scanning systems for deletion request compliance &amp; residual PII...');

    const auditSteps = [
      { delay: 350, text: '• [1/4] Inspecting data retention logs in <span class="term-cyan">cluster-db-primary</span>... <span class="term-green">[PURGED ✔]</span>' },
      { delay: 750, text: '• [2/4] Verifying cache records in <span class="term-cyan">redis-session-store</span>... <span class="term-green">[PURGED ✔]</span>' },
      { delay: 1150, text: '• [3/4] Checking offline replica in <span class="term-cyan">s3-backup-node-03</span>... <span class="term-rose">[RESIDUAL FOUND ⚠]</span>' },
      { delay: 1550, text: '• [4/4] Cross-referencing customer erasure token #GDPR-9041... <span class="term-yellow">[FLAGGED]</span>' },
      { delay: 1950, text: '<span class="term-rose">══════════════════ AUDIT OUTCOME &amp; REMEDIATION ══════════════════</span>' },
      { delay: 2150, text: 'Status: <span class="term-rose">Retention Risk Detected</span> | Ghost Records Found: <strong>142</strong>' },
      { delay: 2350, text: 'Remediation: Issue hard purge trigger to <span class="term-cyan">s3-backup-node-03</span>' },
      { delay: 2550, text: 'Verification Report generated: <a href="https://github.com/DamarlaManvithaSri/Ghost-Data-Auditor" target="_blank" class="term-cyan">View Full Project on GitHub →</a>' }
    ];

    auditSteps.forEach(step => {
      setTimeout(() => {
        appendLine(step.text);
        scrollToBottom();
        if (step === auditSteps[auditSteps.length - 1]) {
          appendSeparator();
        }
      }, step.delay);
    });
  }

  function appendLine(contentHtml, customClass = '') {
    const line = document.createElement('div');
    line.className = `term-line ${customClass}`;
    line.innerHTML = contentHtml;
    screen.appendChild(line);
  }

  function appendSeparator() {
    const sep = document.createElement('div');
    sep.className = 'term-line term-separator';
    sep.textContent = '────────────────────────────────────────────────────────────';
    screen.appendChild(sep);
  }

  function scrollToBottom() {
    screen.scrollTop = screen.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value;
    input.value = '';
    window.executeCommand(val);
  });

  // Handle Command Chips (One-tap buttons)
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-command');
      if (cmd) {
        window.executeCommand(cmd);
        input.focus();
      }
    });
  });

  // Command history recall using ArrowUp and ArrowDown
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      if (commandHistory.length > 0 && historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
      e.preventDefault();
    }
  });

  // Close / Reset dot action
  if (closeDot) {
    closeDot.addEventListener('click', () => {
      commands.clear();
      appendLine('<span class="term-cyan">Terminal reset. Type <span class="term-highlight">help</span> to begin.</span>');
      appendSeparator();
    });
  }
}

/* ----------------------------------------------------------------------------
   4. FLOATING QUICK CLI LAUNCHER & HINT
   Scrolls visitor directly to terminal and focuses input. Never blocks screen.
   ---------------------------------------------------------------------------- */
function initFloatingLauncher() {
  const launcherBtn = document.getElementById('cli-launcher-btn');
  const dismissBtn = document.getElementById('dismiss-hint');
  const hintBubble = document.querySelector('.cli-hint-bubble');
  const terminalInput = document.getElementById('terminal-input');
  const terminalSection = document.getElementById('creative-feature');

  if (launcherBtn && terminalSection) {
    launcherBtn.addEventListener('click', () => {
      terminalSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        if (terminalInput) terminalInput.focus();
      }, 600);
    });
  }

  // Allow visitor to dismiss the floating hint bubble
  if (dismissBtn && hintBubble) {
    dismissBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hintBubble.style.display = 'none';
    });
  }
}

/* ----------------------------------------------------------------------------
   5. EXTERNAL TRIGGER: RUN MINI AUDIT IN CLI BUTTON
   Located inside the Ghost Data Auditor Hero Project Card.
   ---------------------------------------------------------------------------- */
function initAuditTrigger() {
  const triggerBtn = document.getElementById('trigger-audit-btn');
  const terminalSection = document.getElementById('creative-feature');

  if (triggerBtn && terminalSection) {
    triggerBtn.addEventListener('click', () => {
      terminalSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        if (typeof window.executeCommand === 'function') {
          window.executeCommand('ghost-audit');
        }
      }, 600);
    });
  }
}
