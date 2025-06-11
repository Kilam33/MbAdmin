import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, Plus } from 'lucide-react';
import { Hotel, NearbyAttraction } from '../../types';
import { Button } from '../ui/Button';

interface HotelFormProps {
  hotel?: Hotel;
  onSubmit: (data: Partial<Hotel>) => Promise<void>;
  onCancel: () => void;
}

interface FormData extends Omit<Hotel, 'nearby_attractions'> {
  nearby_attractions: Partial<NearbyAttraction>[];
}

export const HotelForm: React.FC<HotelFormProps> = ({
  hotel: existingHotel,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      ...(existingHotel || {
        id: '',
        name: '',
        type: 'hotel',
        location: '',
        description: '',
        rating: 0,
        price_range: '',
        glow_color: '#3B82F6',
        contact_phone: '',
        contact_email: '',
        booking_link: '',
        image_url: '',
        images: [''],
        highlights: [''],
        location_highlights: [''],
        room_count: 12,
        review_count: 234,
        check_in_time: '3:00 PM',
        check_out_time: '11:00 AM',
        concierge_hours: '24/7',
        certification: 'Certified Safari Lodge',
        rating_location: 9.2,
        rating_service: 9.0,
        rating_cleanliness: 8.8,
        rating_comfort: 9.1,
        rating_value: 8.9,
        amenities: [],
        destinations: [],
      }),
      nearby_attractions: existingHotel?.nearby_attractions || [{ name: '', distance: '', type: '' }],
    },
  });

  // Workaround: useFieldArray for string[] fields with custom name cast to any
  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'images' as any,
  });
  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    control,
    name: 'highlights' as any,
  });
  const { fields: locationHighlightFields, append: appendLocationHighlight, remove: removeLocationHighlight } = useFieldArray({
    control,
    name: 'location_highlights' as any,
  });
  const { fields: attractionFields, append: appendAttraction, remove: removeAttraction } = useFieldArray({
    control,
    name: 'nearby_attractions',
  });

  const numericFieldNames: (keyof FormData)[] = [
    'rating',
    'room_count',
    'review_count',
    'rating_location',
    'rating_service',
    'rating_cleanliness',
    'rating_comfort',
    'rating_value',
  ];

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (!existingHotel) {
        data.id = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      if (data.images) {
        data.images = data.images.filter(img => img && img.trim() !== '');
        if (data.images.length === 0) {
          data.images = [];
        }
      }
      if (data.highlights) {
        data.highlights = data.highlights.filter(highlight => highlight && highlight.trim() !== '');
        if (data.highlights.length === 0) {
          data.highlights = [];
        }
      }
      if (data.location_highlights) {
        data.location_highlights = data.location_highlights.filter(highlight => highlight && highlight.trim() !== '');
        if (data.location_highlights.length === 0) {
          data.location_highlights = [];
        }
      }
      if (data.nearby_attractions) {
        data.nearby_attractions = data.nearby_attractions.filter(attraction => attraction.name && attraction.name.trim() !== '');
      }
      // Type-safe numeric conversion
      numericFieldNames.forEach(field => {
        if (typeof data[field] === 'string' || typeof data[field] === 'number') {
          // @ts-expect-error: dynamic numeric assignment
          data[field] = Number(data[field]);
        }
      });
      // Fix: ensure nearby_attractions is Hotel[] compatible (all required fields)
      const fixedData: Partial<Hotel> = {
        ...data,
        nearby_attractions: data.nearby_attractions?.map((a, i) => ({
          id: a.id || `${data.id}-attraction-${i}`,
          hotel_id: data.id,
          name: a.name || '',
          distance: a.distance || '',
          type: a.type || '',
        })) || [],
      };
      await onSubmit(fixedData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name *</label>
            <input
              {...register('name', { required: 'Hotel name is required' })}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select
              {...register('type', { required: 'Type is required' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="hotel">Hotel</option>
              <option value="camp">Camp</option>
              <option value="lodge">Lodge</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input
              {...register('location', { required: 'Location is required' })}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating * (0-9.9)</label>
            <input
              {...register('rating', {
                required: 'Rating is required',
                min: { value: 0, message: 'Rating must be at least 0' },
                max: { value: 9.9, message: 'Rating cannot exceed 9.9' },
                valueAsNumber: true
              })}
              type="number"
              step="0.1"
              min="0"
              max="9.9"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range *</label>
            <input
              {...register('price_range', { required: 'Price range is required' })}
              type="text"
              placeholder="e.g., $200-400/night"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.price_range && <p className="text-red-500 text-sm mt-1">{errors.price_range.message}</p>}
          </div>
        </div>
        {/* Contact & Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Image URL</label>
            <input
              {...register('image_url')}
              type="url"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.image_url && <p className="text-red-500 text-sm mt-1">{errors.image_url.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Glow Color *</label>
            <input
              {...register('glow_color', { required: 'Glow color is required' })}
              type="color"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.glow_color && <p className="text-red-500 text-sm mt-1">{errors.glow_color.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input
              {...register('contact_phone')}
              type="tel"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              {...register('contact_email')}
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking Link</label>
            <input
              {...register('booking_link')}
              type="url"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>
      {/* Hotel Details */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Hotel Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Count</label>
            <input
              {...register('room_count', { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review Count</label>
            <input
              {...register('review_count', { valueAsNumber: true })}
              type="number"
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
            <input
              {...register('check_in_time')}
              type="text"
              placeholder="3:00 PM"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
            <input
              {...register('check_out_time')}
              type="text"
              placeholder="11:00 AM"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Concierge Hours</label>
            <input
              {...register('concierge_hours')}
              type="text"
              placeholder="24/7"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certification</label>
            <input
              {...register('certification')}
              type="text"
              placeholder="Certified Safari Lodge"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      {/* Detailed Ratings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Ratings (0-9.9)</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              {...register('rating_location', { valueAsNumber: true })}
              type="number"
              step="0.1"
              min="0"
              max="9.9"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <input
              {...register('rating_service', { valueAsNumber: true })}
              type="number"
              step="0.1"
              min="0"
              max="9.9"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cleanliness</label>
            <input
              {...register('rating_cleanliness', { valueAsNumber: true })}
              type="number"
              step="0.1"
              min="0"
              max="9.9"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comfort</label>
            <input
              {...register('rating_comfort', { valueAsNumber: true })}
              type="number"
              step="0.1"
              min="0"
              max="9.9"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input
              {...register('rating_value', { valueAsNumber: true })}
              type="number"
              step="0.1"
              min="0"
              max="9.9"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      {/* Dynamic Arrays */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
          {imageFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mb-2">
              <input
                {...register(`images.${index}` as const)}
                type="url"
                placeholder="https://example.com/image.jpg"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendImage('')}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />Add Image
          </button>
        </div>
        {/* Highlights */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
          {highlightFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mb-2">
              <input
                {...register(`highlights.${index}` as const)}
                type="text"
                placeholder="e.g., Luxury Spa"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeHighlight(index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendHighlight('')}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />Add Highlight
          </button>
        </div>
        {/* Location Highlights */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location Highlights</label>
          {locationHighlightFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mb-2">
              <input
                {...register(`location_highlights.${index}` as const)}
                type="text"
                placeholder="e.g., Near River"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeLocationHighlight(index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendLocationHighlight('')}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />Add Location Highlight
          </button>
        </div>
      </div>
      {/* Location Highlights and Nearby Attractions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nearby Attractions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nearby Attractions</label>
          {attractionFields.map((field, index) => (
            <div key={field.id} className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 mb-2">
              <input
                {...register(`nearby_attractions.${index}.name` as const)}
                type="text"
                placeholder="Attraction Name"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                {...register(`nearby_attractions.${index}.distance` as const)}
                type="text"
                placeholder="Distance (e.g., 2km)"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                {...register(`nearby_attractions.${index}.type` as const)}
                type="text"
                placeholder="Type (e.g., Park)"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeAttraction(index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendAttraction({ name: '', distance: '', type: '' })}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />Add Attraction
          </button>
        </div>
      </div>
      {/* Note about JSONB fields */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-sm text-blue-700">Note: Amenities and destinations fields are JSONB and can be managed separately in the database or with a custom UI.</p>
      </div>
      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>Save Hotel</Button>
      </div>
    </form>
  );
};