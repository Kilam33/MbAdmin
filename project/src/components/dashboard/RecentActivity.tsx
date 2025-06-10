import React from 'react';
import { Calendar, MessageSquare, Users, Package } from 'lucide-react';
import { Booking, ContactInquiry } from '../../types';
import { format } from 'date-fns';

interface RecentActivityProps {
  recentBookings: Booking[];
  recentInquiries: ContactInquiry[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  recentBookings,
  recentInquiries,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {recentBookings.slice(0, 5).map((booking) => (
            <div key={booking.id} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {booking.contact_name || 'Unknown'}
                </p>
                <p className="text-sm text-gray-500">
                  {booking.adults + booking.children} travelers • {booking.package_id}
                </p>
                <p className="text-xs text-gray-400">
                  {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  booking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Inquiries</h3>
          <MessageSquare className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {recentInquiries.slice(0, 5).map((inquiry) => (
            <div key={inquiry.id} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {inquiry.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {inquiry.subject}
                </p>
                <p className="text-xs text-gray-400">
                  {format(new Date(inquiry.created_at), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  inquiry.status === 'responded' 
                    ? 'bg-green-100 text-green-800'
                    : inquiry.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {inquiry.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};