import React from 'react';
import { Package, Building2, Calendar, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { DashboardStats as StatsType } from '../../types';

interface DashboardStatsProps {
  stats: StatsType;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Packages',
      value: stats.totalPackages,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Total Hotels',
      value: stats.totalHotels,
      icon: Building2,
      color: 'bg-green-500',
      change: '+5%',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-purple-500',
      change: '+23%',
    },
    {
      title: 'Pending Inquiries',
      value: stats.pendingInquiries,
      icon: MessageSquare,
      color: 'bg-orange-500',
      change: '+8%',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">{stat.change}</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};