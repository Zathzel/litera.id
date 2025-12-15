import { ReactNode } from "react";
import DashboardSidebar from '../../components/DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Content */}
      <main className="flex-1 p-6">
        <div
          className="
            bg-white dark:bg-gray-800 
            p-6 rounded-xl shadow 
            border border-gray-200/50 dark:border-gray-700/50
          "
        >
          {/* Title */}
          {title && (
            <h1 className="text-2xl font-bold mb-6">{title}</h1>
          )}

          {children}
        </div>
      </main>
    </div>
  );
}
