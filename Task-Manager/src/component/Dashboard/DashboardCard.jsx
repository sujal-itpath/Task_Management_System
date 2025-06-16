import React from 'react';

export const DashboardCard = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        {icon && (
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
            {icon}
          </div>
        )}
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
};