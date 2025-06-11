import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Hotel, NearbyAttraction } from '../types';
import toast from 'react-hot-toast';

export const useHotelsCrud = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      
      // First, fetch hotels with basic data
      const { data: hotelsData, error: hotelsError } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false });

      if (hotelsError) throw hotelsError;

      // Then fetch nearby attractions for all hotels
      const { data: attractionsData, error: attractionsError } = await supabase
        .from('nearby_attractions')
        .select('*');

      if (attractionsError) throw attractionsError;

      // Combine the data
      const hotelsWithAttractions = hotelsData?.map(hotel => ({
        ...hotel,
        nearby_attractions: attractionsData?.filter(attraction => attraction.hotel_id === hotel.id) || []
      })) || [];

      setHotels(hotelsWithAttractions);
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
      // Separate nearby attractions from hotel data
      const { nearby_attractions, ...cleanHotelData } = hotelData;

      const { data, error } = await supabase
        .from('hotels')
        .insert([cleanHotelData])
        .select()
        .single();

      if (error) throw error;

      // If there are nearby attractions, insert them
      if (nearby_attractions && nearby_attractions.length > 0) {
        const attractionsToInsert = nearby_attractions.map(attraction => ({
          ...attraction,
          hotel_id: data.id
        }));

        const { error: attractionsError } = await supabase
          .from('nearby_attractions')
          .insert(attractionsToInsert);

        if (attractionsError) {
          console.error('Error inserting attractions:', attractionsError);
          // Continue anyway - hotel was created successfully
        }
      }

      // Fetch the complete hotel data with attractions
      await fetchHotels();
      
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
      // Separate nearby attractions from hotel data
      const { nearby_attractions, ...cleanHotelData } = hotelData;

      const { data, error } = await supabase
        .from('hotels')
        .update(cleanHotelData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Handle nearby attractions update
      if (nearby_attractions !== undefined) {
        // Delete existing attractions
        await supabase
          .from('nearby_attractions')
          .delete()
          .eq('hotel_id', id);

        // Insert new attractions if any
        if (nearby_attractions.length > 0) {
          const attractionsToInsert = nearby_attractions.map(attraction => ({
            ...attraction,
            hotel_id: id,
            id: undefined // Let the database generate new IDs
          }));

          const { error: attractionsError } = await supabase
            .from('nearby_attractions')
            .insert(attractionsToInsert);

          if (attractionsError) {
            console.error('Error updating attractions:', attractionsError);
            // Continue anyway - hotel was updated successfully
          }
        }
      }

      // Fetch the complete updated data
      await fetchHotels();
      
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
      // Delete nearby attractions first (should be handled by CASCADE, but being explicit)
      await supabase
        .from('nearby_attractions')
        .delete()
        .eq('hotel_id', id);

      // Delete the hotel
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

  // Utility function to manage nearby attractions separately
  const updateNearbyAttractions = async (hotelId: string, attractions: Partial<NearbyAttraction>[]) => {
    try {
      // Delete existing attractions
      await supabase
        .from('nearby_attractions')
        .delete()
        .eq('hotel_id', hotelId);

      // Insert new attractions if any
      if (attractions.length > 0) {
        const attractionsToInsert = attractions.map(attraction => ({
          ...attraction,
          hotel_id: hotelId,
          id: undefined // Let the database generate new IDs
        }));

        const { error } = await supabase
          .from('nearby_attractions')
          .insert(attractionsToInsert);

        if (error) throw error;
      }

      await fetchHotels(); // Refresh the data
      toast.success('Nearby attractions updated successfully');
    } catch (err) {
      console.error('Error updating nearby attractions:', err);
      toast.error('Failed to update nearby attractions');
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
    updateNearbyAttractions,
    refreshHotels: fetchHotels,
  };
};