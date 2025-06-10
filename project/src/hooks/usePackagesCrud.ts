import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SafariPackage } from '../types';
import toast from 'react-hot-toast';

export const usePackagesCrud = () => {
  const [packages, setPackages] = useState<SafariPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('safari_packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load packages');
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const createPackage = async (packageData: Partial<SafariPackage>) => {
    try {
      const { data, error } = await supabase
        .from('safari_packages')
        .insert([{
          ...packageData,
          package_id: packageData.slug || packageData.title?.toLowerCase().replace(/\s+/g, '-'),
        }])
        .select()
        .single();

      if (error) throw error;
      
      setPackages(prev => [data, ...prev]);
      toast.success('Package created successfully');
      return data;
    } catch (err) {
      console.error('Error creating package:', err);
      toast.error('Failed to create package');
      throw err;
    }
  };

  const updatePackage = async (id: string, packageData: Partial<SafariPackage>) => {
    try {
      const { data, error } = await supabase
        .from('safari_packages')
        .update({
          ...packageData,
          package_id: packageData.slug || packageData.title?.toLowerCase().replace(/\s+/g, '-'),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setPackages(prev => prev.map(pkg => pkg.id === id ? data : pkg));
      toast.success('Package updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating package:', err);
      toast.error('Failed to update package');
      throw err;
    }
  };

  const deletePackage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('safari_packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
      toast.success('Package deleted successfully');
    } catch (err) {
      console.error('Error deleting package:', err);
      toast.error('Failed to delete package');
      throw err;
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return {
    packages,
    loading,
    error,
    createPackage,
    updatePackage,
    deletePackage,
    refreshPackages: fetchPackages,
  };
};