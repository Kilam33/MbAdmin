import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ContactInquiry } from '../types';
import toast from 'react-hot-toast';

export const useInquiriesCrud = () => {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
      setError('Failed to load inquiries');
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const updateInquiry = async (id: string, inquiryData: Partial<ContactInquiry>) => {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .update({
          ...inquiryData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setInquiries(prev => prev.map(inquiry => inquiry.id === id ? data : inquiry));
      toast.success('Inquiry updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating inquiry:', err);
      toast.error('Failed to update inquiry');
      throw err;
    }
  };

  const deleteInquiry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setInquiries(prev => prev.filter(inquiry => inquiry.id !== id));
      toast.success('Inquiry deleted successfully');
    } catch (err) {
      console.error('Error deleting inquiry:', err);
      toast.error('Failed to delete inquiry');
      throw err;
    }
  };

  const updateInquiryStatus = async (id: string, status: ContactInquiry['status']) => {
    return updateInquiry(id, { status });
  };

  const markAsSpam = async (id: string) => {
    return updateInquiry(id, { status: 'spam' });
  };

  const archiveInquiry = async (id: string) => {
    return updateInquiry(id, { status: 'archived' });
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return {
    inquiries,
    loading,
    error,
    updateInquiry,
    deleteInquiry,
    updateInquiryStatus,
    markAsSpam,
    archiveInquiry,
    refreshInquiries: fetchInquiries,
  };
};