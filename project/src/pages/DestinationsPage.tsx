import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { DestinationList } from '../components/destinations/DestinationList';
import { DestinationForm } from '../components/destinations/DestinationForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useDestinationsCrud } from '../hooks/useDestinationsCrud';
import { Destination } from '../types';

export const DestinationsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const {
    destinations,
    loading,
    createDestination,
    updateDestination,
    deleteDestination,
  } = useDestinationsCrud();

  const handleCreate = () => {
    setEditingDestination(null);
    setIsFormOpen(true);
  };

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination);
    setIsFormOpen(true);
  };

  const handleDelete = (destinationId: string) => {
    setShowDeleteConfirm(destinationId);
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      await deleteDestination(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleFormSubmit = async (data: Partial<Destination>) => {
    if (editingDestination) {
      await updateDestination(editingDestination.id, data);
    } else {
      await createDestination(data);
    }
    setIsFormOpen(false);
    setEditingDestination(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingDestination(null);
  };

  if (loading) {
    return <LoadingSpinner text="Loading destinations..." />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage safari destinations and locations
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Destination
        </Button>
      </div>

      <DestinationList
        destinations={destinations}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Destination Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title={editingDestination ? 'Edit Destination' : 'Create New Destination'}
        size="xl"
      >
        <DestinationForm
          destination={editingDestination || undefined}
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
            Are you sure you want to delete this destination? This action cannot be undone.
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