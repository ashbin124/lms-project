import api from "../api/axios";
export const getNotifications = async () => {
  const response = await api.get("notifications/");
  return response.data;
};

export const markNotificationRead = async (notificationId) => {
  const response = await api.post(
    `notifications/${notificationId}/mark_read/`
  );
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.post("notifications/mark_all_read/");
  return response.data;
};