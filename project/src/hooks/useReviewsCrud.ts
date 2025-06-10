import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Review } from '../types';
import toast from 'react-hot-toast';

export const useReviewsCrud = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          package:safari_packages(
            title,
            destination_category
          )
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (id: string, reviewData: Partial<Review>) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          ...reviewData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          package:safari_packages(
            title,
            destination_category
          )
        `)
        .single();

      if (error) throw error;
      
      setReviews(prev => prev.map(review => review.id === id ? data : review));
      toast.success('Review updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating review:', err);
      toast.error('Failed to update review');
      throw err;
    }
  };

  const deleteReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setReviews(prev => prev.filter(review => review.id !== id));
      toast.success('Review deleted successfully');
    } catch (err) {
      console.error('Error deleting review:', err);
      toast.error('Failed to delete review');
      throw err;
    }
  };

  const approveReview = async (id: string) => {
    return updateReview(id, { is_approved: true });
  };

  const disapproveReview = async (id: string) => {
    return updateReview(id, { is_approved: false });
  };

  const verifyReview = async (id: string) => {
    return updateReview(id, { is_verified: true });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    reviews,
    loading,
    error,
    updateReview,
    deleteReview,
    approveReview,
    disapproveReview,
    verifyReview,
    refreshReviews: fetchReviews,
  };
};