import React, { useState } from 'react';
import { Edit, Trash2, Star, MapPin, Phone, Mail } from 'lucide-react';
import { Hotel } from '../../types';
import { Button } from '../ui/Button';

interface HotelListProps {
  hotels: Hotel[];
  onEdit: (hotel: Hotel) => void;
  onDelete: (hotelId: string) => void;
  loading?: boolean;
}

export const HotelList: React.FC<HotelListProps> = ({
  hotels,
  onEdit,
  onDelete,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || hotel.type === typeFilter;
    const matchesLocation = locationFilter === 'all' || hotel.location === locationFilter;
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const uniqueLocations = [...new Set(hotels.map(hotel => hotel.location))];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Hotels
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or location..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="hotel">Hotel</option>
              <option value="camp">Camp</option>
              <option value="lodge">Lodge</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hotel Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative">
              <img
                src={hotel.image_url}
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                  {hotel.price_range}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {hotel.name}
                </h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">{hotel.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {hotel.location}
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {hotel.description}
              </p>
              
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs capitalize">
                  {hotel.type}
                </span>
                <div className="flex items-center space-x-2 text-gray-500">
                  {hotel.contact_phone && <Phone className="h-4 w-4" />}
                  {hotel.contact_email && <Mail className="h-4 w-4" />}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(hotel)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(hotel.id)}
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
      
      {filteredHotels.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hotels found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};