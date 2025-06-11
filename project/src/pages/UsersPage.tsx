import React, { useState } from 'react';
import { UserList } from '../components/users/UserList';
import { UserForm } from '../components/users/UserForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useUsersCrud } from '../hooks/useUsersCrud';
import { User } from '../types';

export const UsersPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showBanConfirm, setShowBanConfirm] = useState<string | null>(null);
  
  const {
    users,
    loading,
    deleteUser,
    updateUserMetadata,
    banUser,
    unbanUser,
  } = useUsersCrud();

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (userId: string) => {
    setShowDeleteConfirm(userId);
  };

  const handleBan = (userId: string) => {
    setShowBanConfirm(userId);
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      await deleteUser(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const confirmBan = async () => {
    if (showBanConfirm) {
      await banUser(showBanConfirm);
      setShowBanConfirm(null);
    }
  };

  const handleFormSubmit = async (data: Partial<User['user_metadata']>) => {
    if (editingUser) {
      await updateUserMetadata(editingUser.id, data);
    }
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  if (loading) {
    return <LoadingSpinner text="Loading users..." />;
  }

  const activeUsers = users.filter(user => !user.banned_until || new Date(user.banned_until) <= new Date());
  const bannedUsers = users.filter(user => user.banned_until && new Date(user.banned_until) > new Date());

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 rounded-full"></div>
            <span>Active: {activeUsers.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 rounded-full"></div>
            <span>Banned: {bannedUsers.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 rounded-full"></div>
            <span>Total: {users.length}</span>
          </div>
        </div>
      </div>

      <UserList
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBan={handleBan}
        onUnban={unbanUser}
        loading={loading}
      />

      {/* User Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title="Edit User"
        size="lg"
      >
        <UserForm
          user={editingUser || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this user? This action cannot be undone and will remove all associated data.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>

      {/* Ban Confirmation Modal */}
      <Modal
        isOpen={!!showBanConfirm}
        onClose={() => setShowBanConfirm(null)}
        title="Confirm Ban"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to ban this user? They will be unable to access the platform.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowBanConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmBan}
            >
              Ban User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};