import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Building2,
  MapPin,
  Calendar,
  MessageSquare,
  Star,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Safari Packages', href: '/admin/packages', icon: Package },
  { name: 'Hotels', href: '/admin/hotels', icon: Building2 },
  { name: 'Destinations', href: '/admin/destinations', icon: MapPin },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Users', href: '/admin/users', icon: Users },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { signOut } = useAuthContext();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      } flex flex-col h-full`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold">Safari Admin</h1>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-gray-700 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};