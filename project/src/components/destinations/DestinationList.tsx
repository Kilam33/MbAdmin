import React, { useState } from 'react';
import { Edit, Trash2, MapPin, ExternalLink } from 'lucide-react';
import { Destination } from '../../types';
import { Button } from '../ui/Button';

interface DestinationListProps {
  destinations: Destination[];
  onEdit: (destination: Destination) => void;
  onDelete: (destinationId: string) => void;
  loading?: boolean;
}

export const DestinationList: React.FC<DestinationListProps> = ({
  destinations,
  onEdit,
  onDelete,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDestinations = destinations.filter(destination =>
    destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.tagline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Destinations
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or tagline..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Destination Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDestinations.map((destination) => (
          <div key={destination.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative">
              <img
                src={destination.image_url}
                alt={destination.name}
                className="w-full h-48 object-cover"
              />
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                style={{ backgroundColor: `${destination.glow_color}20` }}
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">{destination.name}</h3>
                <p className="text-sm opacity-90">{destination.tagline}</p>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {destination.description}
              </p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {destination.key_features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                    >
                      {feature}
                    </span>
                  ))}
                  {destination.key_features.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      +{destination.key_features.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Destination</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <span className="text-xs">{destination.link}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(destination)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(destination.id)}
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
      
      {filteredDestinations.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No destinations found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};