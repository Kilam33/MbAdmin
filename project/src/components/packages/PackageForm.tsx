import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, Plus } from 'lucide-react';
import { SafariPackage } from '../../types';
import { Button } from '../ui/Button';

interface PackageFormProps {
  package?: SafariPackage;
  onSubmit: (data: Partial<SafariPackage>) => Promise<void>;
  onCancel: () => void;
}

export const PackageForm: React.FC<PackageFormProps> = ({
  package: existingPackage,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SafariPackage>({
    defaultValues: existingPackage || {
      title: '',
      duration: '',
      group_size: '',
      overview: '',
      itinerary_highlights: [''],
      inclusions: [''],
      exclusions: [''],
      best_travel_season: '',
      price_range: 0,
      tags: [''],
      rating: 0,
      image_url: '',
      image_suggestions: [''],
      destination_category: 'Masai Mara',
      package_category: 'Classic',
      is_featured: false,
    },
  });

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    control,
    name: 'itinerary_highlights',
  });

  const { fields: inclusionFields, append: appendInclusion, remove: removeInclusion } = useFieldArray({
    control,
    name: 'inclusions',
  });

  const { fields: exclusionFields, append: appendExclusion, remove: removeExclusion } = useFieldArray({
    control,
    name: 'exclusions',
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: 'tags',
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'image_suggestions',
  });

  const handleFormSubmit = async (data: SafariPackage) => {
    setIsSubmitting(true);
    try {
      // Generate slug from title
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await onSubmit({ ...data, slug });
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
              Package Title *
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration *
            </label>
            <input
              {...register('duration', { required: 'Duration is required' })}
              type="text"
              placeholder="e.g., 4 Days / 3 Nights"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Size *
            </label>
            <input
              {...register('group_size', { required: 'Group size is required' })}
              type="text"
              placeholder="e.g., Max 6 People"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.group_size && <p className="text-red-500 text-sm mt-1">{errors.group_size.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range (USD) *
            </label>
            <input
              {...register('price_range', { 
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' }
              })}
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.price_range && <p className="text-red-500 text-sm mt-1">{errors.price_range.message}</p>}
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
        </div>

        {/* Categories and Image */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination Category *
            </label>
            <select
              {...register('destination_category', { required: 'Destination category is required' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Masai Mara">Masai Mara</option>
              <option value="Combo">Combo</option>
              <option value="Samburu">Samburu</option>
              <option value="Lake Nakuru">Lake Nakuru</option>
              <option value="Amboseli">Amboseli</option>
            </select>
            {errors.destination_category && <p className="text-red-500 text-sm mt-1">{errors.destination_category.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package Category *
            </label>
            <select
              {...register('package_category', { required: 'Package category is required' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Premium">Premium</option>
              <option value="Classic">Classic</option>
              <option value="Adventure">Adventure</option>
              <option value="Cultural">Cultural</option>
            </select>
            {errors.package_category && <p className="text-red-500 text-sm mt-1">{errors.package_category.message}</p>}
          </div>

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
              Best Travel Season *
            </label>
            <input
              {...register('best_travel_season', { required: 'Best travel season is required' })}
              type="text"
              placeholder="e.g., July to October"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.best_travel_season && <p className="text-red-500 text-sm mt-1">{errors.best_travel_season.message}</p>}
          </div>

          <div className="flex items-center">
            <input
              {...register('is_featured')}
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <label className="ml-2 text-sm text-gray-700">
              Featured Package
            </label>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Overview *
        </label>
        <textarea
          {...register('overview', { required: 'Overview is required' })}
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.overview && <p className="text-red-500 text-sm mt-1">{errors.overview.message}</p>}
      </div>

      {/* Dynamic Arrays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Itinerary Highlights */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Itinerary Highlights
          </label>
          {highlightFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mb-2">
              <input
                {...register(`itinerary_highlights.${index}` as const)}
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

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          {tagFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mb-2">
              <input
                {...register(`tags.${index}` as const)}
                type="text"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendTag('')}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Tag
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inclusions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inclusions
          </label>
          {inclusionFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mb-2">
              <input
                {...register(`inclusions.${index}` as const)}
                type="text"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeInclusion(index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendInclusion('')}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Inclusion
          </button>
        </div>

        {/* Exclusions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exclusions
          </label>
          {exclusionFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mb-2">
              <input
                {...register(`exclusions.${index}` as const)}
                type="text"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeExclusion(index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendExclusion('')}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Exclusion
          </button>
        </div>
      </div>

      {/* Image Suggestions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image Suggestions
        </label>
        {imageFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2 mb-2">
            <input
              {...register(`image_suggestions.${index}` as const)}
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
          {existingPackage ? 'Update Package' : 'Create Package'}
        </Button>
      </div>
    </form>
  );
};