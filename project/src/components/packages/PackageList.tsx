import React, { useState } from 'react';
import { Edit, Trash2, Star, MapPin, Users, Calendar } from 'lucide-react';
import { SafariPackage } from '../../types';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

interface PackageListProps {
  packages: SafariPackage[];
  onEdit: (pkg: SafariPackage) => void;
  onDelete: (packageId: string) => void;
  loading?: boolean;
}

export const PackageList: React.FC<PackageListProps> = ({
  packages,
  onEdit,
  onDelete,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [destinationFilter, setDestinationFilter] = useState('all');

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.overview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || pkg.package_category === categoryFilter;
    const matchesDestination = destinationFilter === 'all' || pkg.destination_category === destinationFilter;
    
    return matchesSearch && matchesCategory && matchesDestination;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Packages
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Premium">Premium</option>
              <option value="Classic">Classic</option>
              <option value="Adventure">Adventure</option>
              <option value="Cultural">Cultural</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Destinations</option>
              <option value="Masai Mara">Masai Mara</option>
              <option value="Combo">Combo</option>
              <option value="Samburu">Samburu</option>
              <option value="Lake Nakuru">Lake Nakuru</option>
              <option value="Amboseli">Amboseli</option>
            </select>
          </div>
        </div>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative">
              <img
                src={pkg.image_url}
                alt={pkg.title}
                className="w-full h-48 object-cover"
              />
              {pkg.is_featured && (
                <div className="absolute top-2 left-2">
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Featured
                  </span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                  ${pkg.price_range}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {pkg.title}
                </h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">{pkg.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {pkg.overview}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {pkg.duration}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {pkg.group_size}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-gray-600">{pkg.destination_category}</span>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {pkg.package_category}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(pkg)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(pkg.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredPackages.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No packages found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};