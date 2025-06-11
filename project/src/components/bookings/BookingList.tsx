import React, { useState } from 'react';
import { Calendar, User, MapPin, Phone, Mail, DollarSign, Clock, Edit, Trash2 } from 'lucide-react';
import { Booking } from '../../types';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

interface BookingListProps {
  bookings: Booking[];
  onUpdateStatus: (bookingId: string, status: Booking['status']) => void;
  onEdit: (booking: Booking) => void;
  onDelete: (bookingId: string) => void;
  loading?: boolean;
}

export const BookingList: React.FC<BookingListProps> = ({
  bookings,
  onUpdateStatus,
  onEdit,
  onDelete,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.package_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const bookingDate = new Date(booking.start_date);
      const now = new Date();
      const daysDiff = Math.ceil((bookingDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      
      switch (dateFilter) {
        case 'upcoming': return daysDiff > 0;
        case 'past': return daysDiff < 0;
        case 'this_month': return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
        default: return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'awaiting_payment': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'failed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Bookings
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or package..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="awaiting_payment">Awaiting Payment</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="this_month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Booking Cards */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {booking.contact_name || 'Unknown Guest'}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{booking.package_id}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{format(new Date(booking.start_date), 'MMM dd, yyyy')} - {format(new Date(booking.end_date), 'MMM dd, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{booking.adults} adults, {booking.children} children</span>
                  </div>
                  
                  {booking.contact_email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{booking.contact_email}</span>
                    </div>
                  )}
                  
                  {booking.contact_phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{booking.contact_phone}</span>
                    </div>
                  )}
                  
                  {booking.total_amount && (
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>${booking.total_amount}</span>
                    </div>
                  )}
                </div>
                
                {booking.special_requests && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      <strong>Special Requests:</strong> {booking.special_requests}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                Booked on {format(new Date(booking.created_at), 'MMM dd, yyyy')}
              </div>
              
              <div className="flex space-x-2">
                {booking.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                      className="text-green-600 hover:text-green-700"
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                      className="text-red-600 hover:text-red-700"
                    >
                      Cancel
                    </Button>
                  </>
                )}
                
                {booking.status === 'awaiting_payment' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                    className="text-green-600 hover:text-green-700"
                  >
                    Mark Paid
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(booking)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(booking.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredBookings.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No bookings found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};