import React, { useState } from "react";

const NotificationsPage = ({ darkMode }) => {
  const [activeCategory, setActiveCategory] = useState("Payment");

  const [notifications, setNotifications] = useState([
    // Payment notifications
    {
      id: 1,
      category: "Payment",
      title: "Withdrawal Request Approved",
      message:
        "Your withdrawal request of ₹5,000 has been approved and will be credited soon.",
      time: "1 hour ago",
      type: "success",
      read: false,
    },
    {
      id: 2,
      category: "Payment",
      title: "Withdrawal Request Pending",
      message: "Your withdrawal request of ₹2,000 is pending approval.",
      time: "2 hours ago",
      type: "warning",
      read: false,
    },

    // Profile notifications
    {
      id: 3,
      category: "Profile",
      title: "KYC Confirmed",
      message: "Your KYC details have been confirmed by the system.",
      time: "1 day ago",
      type: "info",
      read: true,
    },
    {
      id: 4,
      category: "Profile",
      title: "KYC Approved",
      message:
        "Your KYC has been approved by admin. You can now make transactions.",
      time: "2 days ago",
      type: "success",
      read: false,
    },
    {
      id: 5,
      category: "Profile",
      title: "KYC Rejected",
      message:
        "Your KYC documents were rejected. Please resubmit correct documents.",
      time: "3 days ago",
      type: "warning",
      read: false,
    },

    // Offer notifications
    {
      id: 6,
      category: "Offer",
      title: "New Offer Available!",
      message: "Get 20% cashback on your next transaction.",
      time: "3 days ago",
      type: "success",
      read: false,
    },
  ]);

  const categories = ["Payment", "Profile", "Offer"];

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const typeColors = {
    success:
      "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
    warning:
      "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400",
    info: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
  };

  const filteredNotifications = notifications.filter(
    (n) => n.category === activeCategory
  );

  return (
    <div
      className={`min-h-screen pt-6 lg:pt-8 pb-6 transition-all duration-300 
        ${darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"}`}
      style={{ paddingLeft: 0, paddingRight: 0 }}
    >
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Notifications</h2>
          <button
            onClick={markAllRead}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition whitespace-nowrap"
          >
            Mark all as read
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 sm:gap-4 mb-6 flex-wrap px-4 sm:px-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-md font-medium text-sm sm:text-base transition ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : darkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat} Related
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div
          className={`border-t border-b shadow-sm ${
            darkMode
              ? "border-gray-700 bg-gray-900"
              : "border-gray-200 bg-white"
          }`}
        >
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`flex justify-between items-start p-4 sm:p-5 border-b last:border-0 transition 
                  ${
                    n.read
                      ? darkMode
                        ? "bg-gray-900"
                        : "bg-white"
                      : darkMode
                      ? "bg-gray-800"
                      : "bg-blue-50"
                  } ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <span
                    className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-base sm:text-lg font-semibold flex-shrink-0 ${typeColors[n.type]}`}
                  >
                    {n.type === "success"
                      ? "✓"
                      : n.type === "warning"
                      ? "⚠️"
                      : "ℹ️"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base">
                      {n.title}
                    </h3>
                    <p className="text-xs sm:text-sm mt-1 text-gray-600 dark:text-gray-400 break-words">
                      {n.message}
                    </p>
                    <p className="text-xs mt-1 text-gray-500 dark:text-gray-500">
                      {n.time}
                    </p>
                  </div>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0 ml-2"></span>
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
