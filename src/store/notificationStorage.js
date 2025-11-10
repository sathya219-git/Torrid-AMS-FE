// Key to store notifications
const STORAGE_KEY = "upload_notifications";

export const notificationStorage = {
  getAll() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  add(notification) {
    const all = this.getAll();
    all.push({
      id: Date.now(), // unique ID
      fileName: notification.fileName,
      status: notification.status, // "SUCCESS" or "FAILED"
      message: notification.message,
      time: new Date().toLocaleString(),
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },
};
