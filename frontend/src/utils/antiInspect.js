// Anti-Inspect Protection Utility
// Prevents developer tools access and code inspection

class AntiInspect {
  constructor() {
    this.isDevToolsOpen = false;
    this.init();
  }

  init() {
    // Disable right-click context menu (but allow text selection)
    this.disableRightClick();
    
    // Disable keyboard shortcuts for developer tools
    this.disableKeyboardShortcuts();
    
    // Detect DevTools
    this.detectDevTools();
    
    // Enable text selection and copying
    this.enableTextSelection();
    
    // Clear console periodically
    this.clearConsole();
    
    // Obfuscate console
    this.obfuscateConsole();
    
    // Add copy-friendly right click menu
    this.enableCopyFriendlyRightClick();
    
    // Override global context menu handlers
    this.overrideGlobalHandlers();
  }

  overrideGlobalHandlers() {
    // Override window.oncontextmenu
    window.oncontextmenu = () => false;
    
    // Override document.oncontextmenu
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        document.oncontextmenu = () => false;
      });
    } else {
      document.oncontextmenu = () => false;
    }
    
    // Prevent default context menu on window
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }, true);
    
    // Block selectstart only for non-text elements
    document.addEventListener('selectstart', (e) => {
      // Allow text selection for copying but prevent selection on non-text elements
      const target = e.target;
      const textElements = ['P', 'SPAN', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TD', 'TH', 'LABEL', 'INPUT', 'TEXTAREA'];
      
      if (!textElements.includes(target.tagName) && !target.closest('p, span, div, h1, h2, h3, h4, h5, h6, li, td, th, label')) {
        e.preventDefault();
        return false;
      }
      return true;
    });
  }

  disableRightClick() {
    // Method 1: Block contextmenu event
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }, true);
    
    // Method 2: Block right mouse button down
    document.addEventListener('mousedown', (e) => {
      if (e.button === 2) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    }, true);
    
    // Method 3: Block right mouse button up
    document.addEventListener('mouseup', (e) => {
      if (e.button === 2) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    }, true);
    
    // Method 4: Block auxiliary click (middle/right button)
    document.addEventListener('auxclick', (e) => {
      if (e.button === 2) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    }, true);
    
    // Method 5: Override oncontextmenu for all elements
    document.addEventListener('DOMContentLoaded', () => {
      document.oncontextmenu = () => false;
      document.body.oncontextmenu = () => false;
      
      // Apply to all existing elements
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        element.oncontextmenu = () => false;
      });
    });
    
    // Method 6: Mutation observer to catch dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            node.oncontextmenu = () => false;
            const children = node.querySelectorAll('*');
            children.forEach(child => {
              child.oncontextmenu = () => false;
            });
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Show copy instruction instead of context menu
    document.addEventListener('contextmenu', (e) => {
      const selectedText = window.getSelection().toString();
      if (selectedText.length > 0) {
        this.showCopyInstruction();
      } else {
        this.showWarning('Right-click is disabled for security. Select text and use Ctrl+C to copy.');
      }
    }, true);
  }

  enableCopyFriendlyRightClick() {
    // Allow text selection and copying with keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Allow Ctrl+C (copy), Ctrl+A (select all), Ctrl+V (paste in inputs)
      if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || 
                        e.key === 'a' || e.key === 'A' ||
                        e.key === 'v' || e.key === 'V')) {
        return true; // Allow these copy operations
      }
    });
  }

  isTextSelectable(element) {
    // Check if the element contains selectable text
    const textElements = ['P', 'SPAN', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TD', 'TH', 'LABEL'];
    return textElements.includes(element.tagName) || element.textContent.trim().length > 0;
  }

  disableKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Allow text copying shortcuts (Ctrl+C, Ctrl+A, Ctrl+V)
      if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || 
                        e.key === 'a' || e.key === 'A' ||
                        e.key === 'v' || e.key === 'V')) {
        return true; // Allow copy operations
      }

      // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+J, Ctrl+Shift+C, F11 (fullscreen inspection)
      if (
        e.key === 'F12' ||
        e.key === 'F11' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'S') || // Disable save page
        (e.ctrlKey && e.shiftKey && e.key === 'K') || // Chrome dev tools
        (e.key === 'F10') // Menu key that can open dev tools
      ) {
        e.preventDefault();
        e.stopPropagation();
        this.showWarning('Developer tools access is blocked for security. Text copying is still available.');
        return false;
      }
    });
  }

  detectDevTools() {
    // Method 1: Console detection
    setInterval(() => {
      const start = performance.now();
      console.log('%c', 'font-size: 0;');
      const end = performance.now();
      
      if (end - start > 100) {
        this.handleDevToolsDetection();
      }
    }, 1000);

    // Method 2: Window size detection
    setInterval(() => {
      if (
        window.outerHeight - window.innerHeight > 200 ||
        window.outerWidth - window.innerWidth > 200
      ) {
        this.handleDevToolsDetection();
      }
    }, 500);

    // Method 3: Debugger detection
    setInterval(() => {
      const before = Date.now();
      debugger;
      const after = Date.now();
      if (after - before > 100) {
        this.handleDevToolsDetection();
      }
    }, 2000);
    
    // Method 4: DevTools detection via console object
    setInterval(() => {
      let devtools = {
        open: false,
        orientation: null
      };
      const threshold = 160;
      
      setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            devtools.open = true;
            this.handleDevToolsDetection();
          }
        }
      }, 500);
    }, 100);
    
    // Method 5: Prevent menu bar access and shortcuts
    document.addEventListener('keydown', (e) => {
      // Block Alt key (opens menu bar)
      if (e.altKey) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Block Ctrl+Shift+Del (Clear browsing data - can access dev tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'Delete') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });
  }

  handleDevToolsDetection() {
    if (!this.isDevToolsOpen) {
      this.isDevToolsOpen = true;
      
      // Clear the page
      document.body.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          font-family: Arial, sans-serif;
          z-index: 999999;
        ">
          <div style="text-align: center; max-width: 500px; padding: 40px;">
            <div style="font-size: 4rem; margin-bottom: 20px;">⚠️</div>
            <h1 style="font-size: 2rem; margin-bottom: 20px;">Access Restricted</h1>
            <p style="font-size: 1.2rem; margin-bottom: 30px;">
              Developer tools have been detected. This action has been logged for security purposes.
            </p>
            <p style="color: #ffcccb;">
              Please close developer tools and refresh the page to continue.
            </p>
            <button onclick="window.location.reload()" style="
              margin-top: 30px;
              padding: 15px 30px;
              font-size: 1rem;
              background: rgba(255,255,255,0.2);
              border: 2px solid white;
              color: white;
              border-radius: 10px;
              cursor: pointer;
              transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
               onmouseout="this.style.background='rgba(255,255,255,0.2)'">
              Reload Page
            </button>
          </div>
        </div>
      `;
      
      // Log security event
      this.logSecurityEvent();
    }
  }

  // DISABLED: Allow text selection and copying
  // disableTextSelection() {
  //   document.addEventListener('selectstart', (e) => {
  //     e.preventDefault();
  //     return false;
  //   });

  //   document.addEventListener('dragstart', (e) => {
  //     e.preventDefault();
  //     return false;
  //   });
  // }

  // Enable text selection for copying
  enableTextSelection() {
    // Ensure text selection is enabled
    document.body.style.userSelect = 'text';
    document.body.style.webkitUserSelect = 'text';
    document.body.style.mozUserSelect = 'text';
    document.body.style.msUserSelect = 'text';
    
    // Allow text selection events
    document.addEventListener('selectstart', (e) => {
      return true; // Allow text selection
    });
  }

  clearConsole() {
    setInterval(() => {
      console.clear();
      console.log('%c🛡️ Virtual Hospital - Security Active', 'color: #667eea; font-size: 16px; font-weight: bold;');
    }, 3000);
  }

  obfuscateConsole() {
    // Override console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      if (this.isDevToolsOpen) return;
      originalLog.apply(console, args);
    };

    console.error = (...args) => {
      if (this.isDevToolsOpen) return;
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      if (this.isDevToolsOpen) return;
      originalWarn.apply(console, args);
    };
  }

  showWarning(message) {
    // Create temporary warning
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 999999;
      font-family: Arial, sans-serif;
      font-weight: bold;
      animation: slideIn 0.3s ease;
    `;
    warning.textContent = message;
    
    document.body.appendChild(warning);
    
    setTimeout(() => {
      if (warning.parentNode) {
        warning.parentNode.removeChild(warning);
      }
    }, 3000);
  }

  showCopyInstruction() {
    // Show instruction for copying selected text
    const instruction = document.createElement('div');
    instruction.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 999999;
      font-family: Arial, sans-serif;
      font-weight: bold;
      animation: slideIn 0.3s ease;
    `;
    instruction.innerHTML = `
      📋 Press <kbd style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 3px;">Ctrl+C</kbd> to copy selected text
    `;
    
    document.body.appendChild(instruction);
    
    setTimeout(() => {
      if (instruction.parentNode) {
        instruction.parentNode.removeChild(instruction);
      }
    }, 2000);
  }

  logSecurityEvent() {
    // Log security breach attempt
    const securityLog = {
      timestamp: new Date().toISOString(),
      event: 'DEV_TOOLS_DETECTED',
      userAgent: navigator.userAgent,
      url: window.location.href,
      ip: 'CLIENT_SIDE'
    };
    
    // Store in localStorage for later transmission
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(securityLog);
    localStorage.setItem('security_logs', JSON.stringify(logs));
    
    console.warn('Security event logged:', securityLog);
  }
}

// CSS for animations and text selection
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  /* Allow text selection and copying while maintaining security */
  * {
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
    -webkit-touch-callout: default;
    -webkit-tap-highlight-color: rgba(0,0,0,0.1);
  }
  
  /* Special elements where text selection might interfere */
  button, .btn, [role="button"] {
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
  }
  
  /* Ensure input and textarea work normally */
  input, textarea {
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
  }
`;
document.head.appendChild(style);

export default AntiInspect;
