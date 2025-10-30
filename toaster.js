/**
 * Toaster Notification System
 * Provides elegant toast notifications instead of browser alerts
 */

class Toaster {
  constructor() {
    this.toastContainer = null;
    this.toasts = [];
    this.init();
  }

  init() {
    // Create container if it doesn't exist
    if (!document.getElementById('toaster-container')) {
      const container = document.createElement('div');
      container.id = 'toaster-container';
      container.className = 'toaster-container';
      document.body.appendChild(container);
      this.toastContainer = container;
    } else {
      this.toastContainer = document.getElementById('toaster-container');
    }

    // Inject CSS if not already present
    if (!document.getElementById('toaster-styles')) {
      const style = document.createElement('style');
      style.id = 'toaster-styles';
      style.textContent = this.getStyles();
      document.head.appendChild(style);
    }
  }

  getStyles() {
    return `
      .toaster-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
        pointer-events: none;
      }

      .toast {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 18px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
        pointer-events: auto;
        max-width: 100%;
        word-wrap: break-word;
        backdrop-filter: blur(10px);
      }

      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }

      .toast.removing {
        animation: slideOut 0.3s ease-in forwards;
      }

      .toast.success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border-left: 4px solid #047857;
      }

      .toast.success .toast-icon::before {
        content: '✓';
        font-weight: bold;
        font-size: 18px;
      }

      .toast.error {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        border-left: 4px solid #b91c1c;
      }

      .toast.error .toast-icon::before {
        content: '✕';
        font-weight: bold;
        font-size: 18px;
      }

      .toast.warning {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        border-left: 4px solid #b45309;
      }

      .toast.warning .toast-icon::before {
        content: '⚠';
        font-weight: bold;
        font-size: 16px;
      }

      .toast.info {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
        border-left: 4px solid #1d4ed8;
      }

      .toast.info .toast-icon::before {
        content: 'ℹ';
        font-weight: bold;
        font-size: 18px;
      }

      .toast-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        width: 24px;
        height: 24px;
        flex-shrink: 0;
      }

      .toast-message {
        flex: 1;
        line-height: 1.4;
      }

      .toast-close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
        flex-shrink: 0;
        background: none;
        border: none;
        color: inherit;
        font-size: 18px;
        padding: 0;
      }

      .toast-close:hover {
        opacity: 1;
      }

      .toast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 0 0 8px 0;
        animation: progress linear;
      }

      @keyframes progress {
        from {
          width: 100%;
        }
        to {
          width: 0%;
        }
      }

      @media (max-width: 480px) {
        .toaster-container {
          left: 10px;
          right: 10px;
          top: 10px;
          max-width: none;
        }

        .toast {
          padding: 12px 14px;
          font-size: 13px;
        }
      }
    `;
  }

  show(message, type = 'info', duration = 8000) {
    const toastId = Date.now() + Math.random();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.id = `toast-${toastId}`;

    const icon = document.createElement('div');
    icon.className = 'toast-icon';

    const messageEl = document.createElement('div');
    messageEl.className = 'toast-message';
    messageEl.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => this.remove(toastId);

    const progress = document.createElement('div');
    progress.className = 'toast-progress';
    progress.style.animation = `progress linear ${duration}ms forwards`;

    toast.appendChild(icon);
    toast.appendChild(messageEl);
    toast.appendChild(closeBtn);
    toast.appendChild(progress);

    this.toastContainer.appendChild(toast);
    this.toasts.push(toastId);

    if (duration > 0) {
      setTimeout(() => this.remove(toastId), duration);
    }

    return toastId;
  }

  success(message, duration = 8000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 10000) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration = 8000) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration = 8000) {
    return this.show(message, 'info', duration);
  }

  remove(toastId) {
    const toast = document.getElementById(`toast-${toastId}`);
    if (toast) {
      toast.classList.add('removing');
      setTimeout(() => {
        toast.remove();
        this.toasts = this.toasts.filter(id => id !== toastId);
      }, 300);
    }
  }

  clear() {
    this.toasts.forEach(toastId => this.remove(toastId));
  }
}

const toaster = new Toaster();

