import React from 'react';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useDashboardStats } from '../hooks/useDashboardStats';

export const Dashboard: React.FC = () => {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome to your safari tour admin panel
        </p>
      </div>

      <DashboardStats stats={stats} />
      <RecentActivity 
        recentBookings={stats.recentBookings}
        recentInquiries={stats.recentInquiries}
      />
    </div>
  );
};