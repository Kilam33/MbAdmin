import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { PackageList } from '../components/packages/PackageList';
import { PackageForm } from '../components/packages/PackageForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { usePackagesCrud } from '../hooks/usePackagesCrud';
import { SafariPackage } from '../types';

export const PackagesPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<SafariPackage | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const {
    packages,
    loading,
    createPackage,
    updatePackage,
    deletePackage,
  } = usePackagesCrud();

  const handleCreate = () => {
    setEditingPackage(null);
    setIsFormOpen(true);
  };

  const handleEdit = (pkg: SafariPackage) => {
    setEditingPackage(pkg);
    setIsFormOpen(true);
  };

  const handleDelete = (packageId: string) => {
    setShowDeleteConfirm(packageId);
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      await deletePackage(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleFormSubmit = async (data: Partial<SafariPackage>) => {
    if (editingPackage) {
      await updatePackage(editingPackage.id, data);
    } else {
      await createPackage(data);
    }
    setIsFormOpen(false);
    setEditingPackage(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingPackage(null);
  };

  if (loading) {
    return <LoadingSpinner text="Loading packages..." />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Safari Packages</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your safari tour packages
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Package
        </Button>
      </div>

      <PackageList
        packages={packages}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Package Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title={editingPackage ? 'Edit Package' : 'Create New Package'}
        size="xl"
      >
        <PackageForm
          package={editingPackage || undefined}
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
            Are you sure you want to delete this package? This action cannot be undone.
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