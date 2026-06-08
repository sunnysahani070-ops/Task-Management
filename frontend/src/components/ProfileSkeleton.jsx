import React from 'react';
import { Card, CardContent } from './ui/Card';

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 h-16"></header>
      
      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-6 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>

        <Card className="overflow-hidden border-t-4 border-t-indigo-500 animate-pulse bg-white dark:bg-slate-800">
          <CardContent className="p-0">
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-800"></div>
            
            <div className="px-6 sm:px-10 pb-10">
              <div className="relative flex justify-between items-end -mt-16 mb-8">
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 bg-gray-200 dark:bg-slate-700 z-10"></div>
                <div className="h-10 w-28 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="h-5 w-40 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="h-10 w-full bg-gray-100 dark:bg-slate-700/50 rounded"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-5 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-10 w-full bg-gray-100 dark:bg-slate-700/50 rounded"></div>
                  </div>
                  <div>
                    <div className="h-5 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-10 w-full bg-gray-100 dark:bg-slate-700/50 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 overflow-hidden border-t-4 border-t-amber-500 animate-pulse bg-white dark:bg-slate-800">
          <CardContent className="p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 shrink-0"></div>
              <div className="space-y-2">
                <div className="h-6 w-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 w-48 bg-gray-100 dark:bg-slate-700/50 rounded"></div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="h-5 w-40 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-100 dark:bg-slate-700/50 rounded"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-10 w-full bg-gray-100 dark:bg-slate-700/50 rounded"></div>
                <div className="h-10 w-full bg-gray-100 dark:bg-slate-700/50 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfileSkeleton;
