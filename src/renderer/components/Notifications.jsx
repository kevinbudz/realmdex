// src/renderer/components/Notifications.jsx
import React from 'react';
import { useTheme, themes } from '../context/ThemeContext';
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';

export const NotificationType = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning'
};

// Create a context for notifications
export const NotificationContext = React.createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = React.useState([]);

    const addNotification = (type, message, duration = 5000) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, message }]);

        // Auto remove after duration
        if (duration) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ addNotification, removeNotification }}>
            {children}
            <NotificationContainer notifications={notifications} onRemove={removeNotification} />
        </NotificationContext.Provider>
    );
};

// Hook to use notifications
export const useNotifications = () => {
    const context = React.useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

const NotificationIcon = ({ type, className }) => {
    switch (type) {
        case NotificationType.SUCCESS:
            return <CheckCircle className={`${className} text-green-500`} size={20} />;
        case NotificationType.ERROR:
            return <XCircle className={`${className} text-red-500`} size={20} />;
        case NotificationType.WARNING:
            return <AlertCircle className={`${className} text-yellow-500`} size={20} />;
        case NotificationType.INFO:
            return <Info className={`${className} text-blue-500`} size={20} />;
        default:
            return null;
    }
};

const NotificationContainer = ({ notifications, onRemove }) => {
    const { currentTheme } = useTheme();

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`${themes[currentTheme].card} rounded-lg shadow-lg 
                               transform transition-all duration-300 hover:scale-[1.02]
                               animate-slide-in`}
                >
                    <div className="flex items-start p-4 gap-3">
                        <NotificationIcon type={notification.type} />
                        <p className={`flex-1 text-sm ${themes[currentTheme].text}`}>
                            {notification.message}
                        </p>
                        <button
                            onClick={() => onRemove(notification.id)}
                            className={`${themes[currentTheme].textSecondary} hover:${themes[currentTheme].text} 
                                      transition-colors duration-200`}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};