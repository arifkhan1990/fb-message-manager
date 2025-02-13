export interface UIService {
  showLoading(message: string): HTMLElement;
  hideLoading(element: HTMLElement): void;
  showError(message: string): void;
  showToast(message: string): void;
}

export class FacebookUIService implements UIService {
  showLoading(message: string): HTMLElement {
    const loading = document.createElement('div');
    loading.className = 'chat-manager-loading';
    loading.innerHTML = `
      <div class="loading-spinner"></div>
      <p>${message}</p>
    `;
    document.body.appendChild(loading);
    return loading;
  }

  hideLoading(element: HTMLElement): void {
    element.classList.add('fade-out');
    setTimeout(() => {
      document.body.removeChild(element);
    }, 300);
  }

  showError(message: string): void {
    const error = document.createElement('div');
    error.className = 'chat-manager-error';
    error.textContent = message;
    document.body.appendChild(error);
    setTimeout(() => {
      error.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(error);
      }, 300);
    }, 5000);
  }

  showToast(message: string): void {
    const toast = document.createElement('div');
    toast.className = 'chat-manager-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
} 