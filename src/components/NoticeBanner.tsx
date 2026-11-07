import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Bell, AlertTriangle } from 'lucide-react';

export const NoticeBanner: React.FC = () => {
  const { settings } = useApp();

  if (!settings?.announcementNotice && !settings?.emergencyNotice) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs sm:text-sm py-2 px-4 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          {settings.emergencyNotice ? (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <Bell className="w-4 h-4 text-amber-600 shrink-0 animate-bounce" />
          )}
          <span className="font-bold text-amber-950 shrink-0">તાજી સૂચના:</span>
          <p className="truncate text-amber-900 font-medium">
            {settings.emergencyNotice || settings.announcementNotice}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-amber-800 shrink-0">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>વારાહી કેન્દ્ર સેવા સમય: ૯:૦૦ થી ૭:૦૦</span>
        </div>
      </div>
    </div>
  );
};
