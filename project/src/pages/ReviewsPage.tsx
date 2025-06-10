import React, { useState } from 'react';
import { ReviewList } from '../components/reviews/ReviewList';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useReviewsCrud } from '../hooks/useReviewsCrud';

export const ReviewsPage: React.FC = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const {
    reviews,
    loading,
    approveReview,
    disapproveReview,
    verifyReview,
    deleteReview,
  } = useReviewsCrud();

  const handleDelete = (reviewId: string) => {
    setShowDeleteConfirm(reviewId);
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      await deleteReview(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading reviews..." />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and moderate customer reviews
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 rounded-full"></div>
            <span>Approved: {reviews.filter(r => r.is_approved).length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
            <span>Pending: {reviews.filter(r => !r.is_approved).length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 rounded-full"></div>
            <span>Verified: {reviews.filter(r => r.is_verified).length}</span>
          </div>
        </div>
      </div>

      <ReviewList
        reviews={reviews}
        onApprove={approveReview}
        onDisapprove={disapproveReview}
        onVerify={verifyReview}
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
            Are you sure you want to delete this review? This action cannot be undone.
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