import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, Plus } from 'lucide-react';
import { Hotel } from '../../types';
import { Button } from '../ui/Button';

interface HotelFormProps {
  hotel?: Hotel;
  onSubmit: (data: Partial<Hotel>) => Promise<void>;
  onCancel: () => void;
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
  } = useForm<Hotel>({
    defaultValues: existingHotel || {
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
      room_count: 12,
      review_count: 0,
      check_in_time: '3:00 PM',
      check_out_time: '11:00 AM',
      concierge_hours: '24/7',
      certification: 'Certified Safari Lodge',
      rating_location: 0,
      rating_service: 0,
      rating_cleanliness: 0,
      rating_comfort: 0,
      rating_value: 0,
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'images',
  });

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    control,
    name: 'highlights',
  });

  const handleFormSubmit = async (data: Hotel) => {
    setIsSubmitting(true);
    try {
      // Generate ID from name if creating new hotel
      if (!existingHotel) {
        data.id = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      await onSubmit(data);
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hotel Name *
            </label>
            <input
              {...register('name', { required: 'Hotel name is required' })}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              {...register('location', { required: 'Location is required' })}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating *
            </label>
            <input
              {...register('rating', { 
                required: 'Rating is required',
                min: { value: 0, message: 'Rating must be at least 0' },
                max: { value: 5, message: 'Rating cannot exceed 5' }
              })}
              type="number"
              step="0.1"
              min="0"
              max="5"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range *
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Image URL *
            </label>
            <input
              {...register('image_url', { required: 'Image URL is required' })}
              type="url"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.image_url && <p className="text-red-500 text-sm mt-1">{errors.image_url.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Glow Color *
            </label>
            <input
              {...register('glow_color', { required: 'Glow color is required' })}
              type="color"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.glow_color && <p className="text-red-500 text-sm mt-1">{errors.glow_color.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone
            </label>
            <input
              {...register('contact_phone')}
              type="tel"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              {...register('contact_email')}
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Booking Link
            </label>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      {/* Ratings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Ratings</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              {...register('rating_location')}
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service
            </label>
            <input
              {...register('rating_service')}
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cleanliness
            </label>
            <input
              {...register('rating_cleanliness')}
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comfort
            </label>
            <input
              {...register('rating_comfort')}
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              {...register('rating_value')}
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Arrays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Images
          </label>
          {imageFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mb-2">
              <input
                {...register(`images.${index}` as const)}
                type="url"
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
            <Plus className="h-4 w-4 mr-1" />
            Add Image
          </button>
        </div>

        {/* Highlights */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Highlights
          </label>
          {highlightFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mb-2">
              <input
                {...register(`highlights.${index}` as const)}
                type="text"
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
            <Plus className="h-4 w-4 mr-1" />
            Add Highlight
          </button>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
        >
          {existingHotel ? 'Update Hotel' : 'Create Hotel'}
        </Button>
      </div>
    </form>
  );
};