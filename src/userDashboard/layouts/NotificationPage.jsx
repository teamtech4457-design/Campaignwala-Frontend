import React, { useState } from "react";

const NotificationsPage = ({ darkMode }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "KYC Verification Pending",
      message: "Your KYC documents are under review. You’ll be notified once approved.",
      time: "2 hours ago",
      type: "warning",
      read: false,
    },
    {
      id: 2,
      title: "Withdrawal Request Approved",
      message: "Your withdrawal request of ₹5,000 has been approved and will be credited soon.",
      time: "1 day ago",
      type: "success",
      read: true,
    },
    {
      id: 3,
      title: "Profile Update Successful",
      message: "You’ve successfully updated your profile details.",
      time: "3 days ago",
      type: "info",
      read: true,
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const typeColors = {
    success: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
    warning: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400",
    info: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <div
      className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 transition-all duration-300 ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Notifications</h2>
          <button
            onClick={markAllRead}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Mark all as read
          </button>
        </div>

        <div
          className={`border rounded-xl overflow-hidden shadow-sm ${
            darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
          }`}
        >
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex justify-between items-start p-5 border-b last:border-0 transition ${
                  n.read
                    ? darkMode
                      ? "bg-gray-900"
                      : "bg-white"
                    : darkMode
                    ? "bg-gray-800"
                    : "bg-blue-50"
                } ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-semibold ${typeColors[n.type]}`}
                  >
                    {n.type === "success"
                      ? "✓"
                      : n.type === "warning"
                      ? "⚠️"
                      : "ℹ️"}
                  </span>
                  <div>
                    <h3 className="font-semibold text-base">{n.title}</h3>
                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                      {n.message}
                    </p>
                    <p className="text-xs mt-1 text-gray-500 dark:text-gray-500">
                      {n.time}
                    </p>
                  </div>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No new notifications 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
