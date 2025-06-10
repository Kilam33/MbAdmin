import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Hotel } from '../types';
import toast from 'react-hot-toast';

export const useHotelsCrud = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hotels')
        .select(`
          *,
          amenities,
          room_types(*),
          nearby_attractions(*),
          special_offers(*),
          safari_experiences(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHotels(data || []);
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError('Failed to load hotels');
      toast.error('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const createHotel = async (hotelData: Partial<Hotel>) => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .insert([hotelData])
        .select()
        .single();

      if (error) throw error;
      
      setHotels(prev => [data, ...prev]);
      toast.success('Hotel created successfully');
      return data;
    } catch (err) {
      console.error('Error creating hotel:', err);
      toast.error('Failed to create hotel');
      throw err;
    }
  };

  const updateHotel = async (id: string, hotelData: Partial<Hotel>) => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .update(hotelData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setHotels(prev => prev.map(hotel => hotel.id === id ? data : hotel));
      toast.success('Hotel updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating hotel:', err);
      toast.error('Failed to update hotel');
      throw err;
    }
  };

  const deleteHotel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setHotels(prev => prev.filter(hotel => hotel.id !== id));
      toast.success('Hotel deleted successfully');
    } catch (err) {
      console.error('Error deleting hotel:', err);
      toast.error('Failed to delete hotel');
      throw err;
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return {
    hotels,
    loading,
    error,
    createHotel,
    updateHotel,
    deleteHotel,
    refreshHotels: fetchHotels,
  };
};