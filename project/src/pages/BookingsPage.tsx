import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { BookingList } from '../components/bookings/BookingList';
import { BookingForm } from '../components/bookings/BookingForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useBookingsCrud } from '../hooks/useBookingsCrud';
import { Booking } from '../types';

export const BookingsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const {
    bookings,
    loading,
    updateBooking,
    deleteBooking,
    updateBookingStatus,
  } = useBookingsCrud();

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setIsFormOpen(true);
  };

  const handleDelete = (bookingId: string) => {
    setShowDeleteConfirm(bookingId);
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      await deleteBooking(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleFormSubmit = async (data: Partial<Booking>) => {
    if (editingBooking) {
      await updateBooking(editingBooking.id, data);
    }
    setIsFormOpen(false);
    setEditingBooking(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingBooking(null);
  };

  if (loading) {
    return <LoadingSpinner text="Loading bookings..." />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage customer bookings and reservations
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 rounded-full"></div>
            <span>Confirmed: {bookings.filter(b => b.status === 'confirmed').length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
            <span>Pending: {bookings.filter(b => b.status === 'pending').length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 rounded-full"></div>
            <span>Awaiting Payment: {bookings.filter(b => b.status === 'awaiting_payment').length}</span>
          </div>
        </div>
      </div>

      <BookingList
        bookings={bookings}
        onUpdateStatus={updateBookingStatus}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Booking Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title="Edit Booking"
        size="xl"
      >
        <BookingForm
          booking={editingBooking || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this booking? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};