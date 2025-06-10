import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Destination } from '../types';
import toast from 'react-hot-toast';

export const useDestinationsCrud = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setDestinations(data || []);
    } catch (err) {
      console.error('Error fetching destinations:', err);
      setError('Failed to load destinations');
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const createDestination = async (destinationData: Partial<Destination>) => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .insert([destinationData])
        .select()
        .single();

      if (error) throw error;
      
      setDestinations(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success('Destination created successfully');
      return data;
    } catch (err) {
      console.error('Error creating destination:', err);
      toast.error('Failed to create destination');
      throw err;
    }
  };

  const updateDestination = async (id: string, destinationData: Partial<Destination>) => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .update(destinationData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setDestinations(prev => prev.map(dest => dest.id === id ? data : dest));
      toast.success('Destination updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating destination:', err);
      toast.error('Failed to update destination');
      throw err;
    }
  };

  const deleteDestination = async (id: string) => {
    try {
      const { error } = await supabase
        .from('destinations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setDestinations(prev => prev.filter(dest => dest.id !== id));
      toast.success('Destination deleted successfully');
    } catch (err) {
      console.error('Error deleting destination:', err);
      toast.error('Failed to delete destination');
      throw err;
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  return {
    destinations,
    loading,
    error,
    createDestination,
    updateDestination,
    deleteDestination,
    refreshDestinations: fetchDestinations,
  };
};