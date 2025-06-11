import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import toast from 'react-hot-toast';

export const useUsersCrud = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Note: In production, you'd typically have a users table or use Supabase Auth Admin API
      // For now, we'll fetch from auth.users (requires service role key in production)
      const { data, error } = await supabase.auth.admin.listUsers();

      if (error) throw error;
      // Ensure type safety for fetched users
      setUsers((data.users || []) as User[]);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(id);

      if (error) throw error;
      
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user');
      throw err;
    }
  };

  const updateUserMetadata = async (id: string, metadata: Partial<User['user_metadata']>) => {
    try {
      const { data, error } = await supabase.auth.admin.updateUserById(id, {
        user_metadata: metadata
      });

      if (error) throw error;
      setUsers(prev => prev.map(user => user.id === id ? data.user as User : user));
      toast.success('User updated successfully');
      return data.user as User;
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Failed to update user');
      throw err;
    }
  };

  const banUser = async (id: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(id, {
        ban_duration: 'indefinite'
      });

      if (error) throw error;
      
      toast.success('User banned successfully');
      await fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error banning user:', err);
      toast.error('Failed to ban user');
      throw err;
    }
  };

  const unbanUser = async (id: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(id, {
        ban_duration: 'none'
      });

      if (error) throw error;
      
      toast.success('User unbanned successfully');
      await fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error unbanning user:', err);
      toast.error('Failed to unban user');
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    deleteUser,
    updateUserMetadata,
    banUser,
    unbanUser,
    refreshUsers: fetchUsers,
  };
};