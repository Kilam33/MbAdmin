import React, { useState } from 'react';
import { Star, Check, X, Trash2, Shield, Calendar, User } from 'lucide-react';
import { Review } from '../../types';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

interface ReviewListProps {
  reviews: Review[];
  onApprove: (reviewId: string) => void;
  onDisapprove: (reviewId: string) => void;
  onVerify: (reviewId: string) => void;
  onDelete: (reviewId: string) => void;
  loading?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  onApprove,
  onDisapprove,
  onVerify,
  onDelete,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (review.title && review.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && review.is_approved) ||
                         (statusFilter === 'pending' && !review.is_approved) ||
                         (statusFilter === 'verified' && review.is_verified);
    
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    
    return matchesSearch && matchesStatus && matchesRating;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Reviews
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, title, or comment..."
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
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">{review.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                  <div className="flex items-center space-x-2">
                    {review.is_approved && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Approved
                      </span>
                    )}
                    {review.is_verified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </span>
                    )}
                    {!review.is_approved && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(review.submitted_at), 'MMM dd, yyyy')}
                  <span className="mx-2">•</span>
                  <span>{review.email}</span>
                </div>
                
                {review.title && (
                  <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                )}
                
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Review ID: {review.id.slice(0, 8)}...
              </div>
              
              <div className="flex space-x-2">
                {!review.is_approved && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onApprove(review.id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                )}
                
                {review.is_approved && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDisapprove(review.id)}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Disapprove
                  </Button>
                )}
                
                {!review.is_verified && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onVerify(review.id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Verify
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(review.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredReviews.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No reviews found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};