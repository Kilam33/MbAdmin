import React, { useState } from 'react';
import { User, Mail, Calendar, Shield, Ban, Trash2, Edit } from 'lucide-react';
import { User as UserType } from '../../types';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

interface UserListProps {
  users: UserType[];
  onEdit: (user: UserType) => void;
  onDelete: (userId: string) => void;
  onBan: (userId: string) => void;
  onUnban: (userId: string) => void;
  loading?: boolean;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onEdit,
  onDelete,
  onBan,
  onUnban,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.user_metadata?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.user_metadata?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && !user.banned_until) ||
                         (statusFilter === 'banned' && user.banned_until);
    
    return matchesSearch && matchesStatus;
  });

  // Add a type guard for user_metadata
  const getUserDisplayName = (user: UserType) => {
    const meta = user.user_metadata ?? {};
    return meta.full_name || meta.name || user.email.split('@')[0];
  };

  const getUserAvatar = (user: UserType) => {
    const meta = user.user_metadata ?? {};
    return meta.avatar_url; // Only use avatar_url as defined in User type
  };

  const isUserBanned = (user: UserType) => {
    return user.banned_until && new Date(user.banned_until) > new Date();
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Users
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-shrink-0">
                {getUserAvatar(user) ? (
                  <img
                    src={getUserAvatar(user)}
                    alt={getUserDisplayName(user)}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {getUserDisplayName(user)}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="h-4 w-4 mr-1" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                {isUserBanned(user) ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                    <Ban className="h-3 w-3 mr-1" />
                    Banned
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Active
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              {user.created_at && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Joined {format(new Date(user.created_at), 'MMM dd, yyyy')}</span>
                </div>
              )}
              
              {user.last_sign_in_at && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Last seen {format(new Date(user.last_sign_in_at), 'MMM dd, yyyy')}</span>
                </div>
              )}
              
              {user.app_metadata?.provider && (
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Provider: {user.app_metadata.provider}</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(user)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              
              {isUserBanned(user) ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onUnban(user.id)}
                  className="flex-1 text-green-600 hover:text-green-700"
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Unban
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onBan(user.id)}
                  className="flex-1 text-orange-600 hover:text-orange-700"
                >
                  <Ban className="h-4 w-4 mr-1" />
                  Ban
                </Button>
              )}
              
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(user.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};