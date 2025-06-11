import React, { useState } from 'react';
import { InquiryList } from '../components/inquiries/InquiryList';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useInquiriesCrud } from '../hooks/useInquiriesCrud';

export const InquiriesPage: React.FC = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const {
    inquiries,
    loading,
    updateInquiryStatus,
    markAsSpam,
    archiveInquiry,
    deleteInquiry,
  } = useInquiriesCrud();

  const handleDelete = (inquiryId: string) => {
    setShowDeleteConfirm(inquiryId);
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      await deleteInquiry(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading inquiries..." />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Inquiries</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage customer inquiries and support requests
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
            <span>Pending: {inquiries.filter(i => i.status === 'pending').length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 rounded-full"></div>
            <span>Responded: {inquiries.filter(i => i.status === 'responded').length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 rounded-full"></div>
            <span>Spam: {inquiries.filter(i => i.status === 'spam').length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-100 rounded-full"></div>
            <span>Archived: {inquiries.filter(i => i.status === 'archived').length}</span>
          </div>
        </div>
      </div>

      <InquiryList
        inquiries={inquiries}
        onUpdateStatus={updateInquiryStatus}
        onMarkAsSpam={markAsSpam}
        onArchive={archiveInquiry}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this inquiry? This action cannot be undone.
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