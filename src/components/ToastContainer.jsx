import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="toast-icon" size={18} color="#10b981" />;
      case 'warning': return <AlertTriangle className="toast-icon" size={18} color="#f59e0b" />;
      case 'error': return <AlertCircle className="toast-icon" size={18} color="#f43f5e" />;
      default: return <Info className="toast-icon" size={18} color="#06b6d4" />;
    }
  };

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {getIcon(toast.type)}
          <span style={{ flex: 1, fontSize: '0.88rem' }}>{toast.message}</span>
          <button 
            onClick={() => removeToast(toast.id)} 
            className="btn-icon" 
            style={{ padding: 2 }}
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
