import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Booking } from '../types';
import toast from 'react-hot-toast';

export const useBookingsCrud = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          package:safari_packages(
            title,
            duration,
            destination_category,
            price_range
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id: string, bookingData: Partial<Booking>) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          ...bookingData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          package:safari_packages(
            title,
            duration,
            destination_category,
            price_range
          )
        `)
        .single();

      if (error) throw error;
      
      setBookings(prev => prev.map(booking => booking.id === id ? data : booking));
      toast.success('Booking updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating booking:', err);
      toast.error('Failed to update booking');
      throw err;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setBookings(prev => prev.filter(booking => booking.id !== id));
      toast.success('Booking deleted successfully');
    } catch (err) {
      console.error('Error deleting booking:', err);
      toast.error('Failed to delete booking');
      throw err;
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    return updateBooking(id, { status });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    updateBooking,
    deleteBooking,
    updateBookingStatus,
    refreshBookings: fetchBookings,
  };
};