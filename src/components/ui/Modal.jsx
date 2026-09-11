import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({
  isOpen = false,
  onClose,
  title,
  subtitle,
  children,
  footer,
  className = ''
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className={`cyber-glass rounded-2xl border border-slate-700/80 shadow-2xl w-full max-w-lg overflow-hidden cyber-corner animate-scaleUp ${className}`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div>
            {title && <h3 className="text-lg font-bold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs font-mono text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800 bg-slate-950/40">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
