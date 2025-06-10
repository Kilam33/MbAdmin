import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { HotelList } from '../components/hotels/HotelList';
import { HotelForm } from '../components/hotels/HotelForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useHotelsCrud } from '../hooks/useHotelsCrud';
import { Hotel } from '../types';

export const HotelsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const {
    hotels,
    loading,
    createHotel,
    updateHotel,
    deleteHotel,
  } = useHotelsCrud();

  const handleCreate = () => {
    setEditingHotel(null);
    setIsFormOpen(true);
  };

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setIsFormOpen(true);
  };

  const handleDelete = (hotelId: string) => {
    setShowDeleteConfirm(hotelId);
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      await deleteHotel(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleFormSubmit = async (data: Partial<Hotel>) => {
    if (editingHotel) {
      await updateHotel(editingHotel.id, data);
    } else {
      await createHotel(data);
    }
    setIsFormOpen(false);
    setEditingHotel(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingHotel(null);
  };

  if (loading) {
    return <LoadingSpinner text="Loading hotels..." />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hotels & Accommodations</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage hotels, camps, and lodges
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Hotel
        </Button>
      </div>

      <HotelList
        hotels={hotels}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Hotel Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title={editingHotel ? 'Edit Hotel' : 'Create New Hotel'}
        size="xl"
      >
        <HotelForm
          hotel={editingHotel || undefined}
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
            Are you sure you want to delete this hotel? This action cannot be undone.
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