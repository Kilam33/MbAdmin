import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DashboardStats } from '../types';

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPackages: 0,
    totalHotels: 0,
    totalBookings: 0,
    totalInquiries: 0,
    pendingBookings: 0,
    pendingInquiries: 0,
    recentBookings: [],
    recentInquiries: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch counts
        const [
          packagesCount,
          hotelsCount,
          bookingsCount,
          inquiriesCount,
          pendingBookingsCount,
          pendingInquiriesCount,
          recentBookings,
          recentInquiries,
        ] = await Promise.all([
          supabase.from('safari_packages').select('*', { count: 'exact', head: true }),
          supabase.from('hotels').select('*', { count: 'exact', head: true }),
          supabase.from('bookings').select('*', { count: 'exact', head: true }),
          supabase.from('contact_inquiries').select('*', { count: 'exact', head: true }),
          supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('contact_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(10),
          supabase.from('contact_inquiries').select('*').order('created_at', { ascending: false }).limit(10),
        ]);

        setStats({
          totalPackages: packagesCount.count || 0,
          totalHotels: hotelsCount.count || 0,
          totalBookings: bookingsCount.count || 0,
          totalInquiries: inquiriesCount.count || 0,
          pendingBookings: pendingBookingsCount.count || 0,
          pendingInquiries: pendingInquiriesCount.count || 0,
          recentBookings: recentBookings.data || [],
          recentInquiries: recentInquiries.data || [],
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};