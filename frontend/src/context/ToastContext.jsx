import React, { createContext, useContext, useState, useCallback } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`flex items-center justify-between min-w-[300px] p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-up ${
              toast.type === 'success' 
                ? 'bg-white border-green-100 border-l-4 border-l-green-500' 
                : 'bg-white border-red-100 border-l-4 border-l-red-500'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' ? (
                <FaCheckCircle className="text-green-500 shrink-0" size={20} />
              ) : (
                <FaExclamationCircle className="text-red-500 shrink-0" size={20} />
              )}
              <p className="text-sm font-semibold text-gray-800">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            >
              <FaTimes size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
