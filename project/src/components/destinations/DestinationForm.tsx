import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, Plus } from 'lucide-react';
import { Destination } from '../../types';
import { Button } from '../ui/Button';

interface DestinationFormProps {
  destination?: Destination;
  onSubmit: (data: Partial<Destination>) => Promise<void>;
  onCancel: () => void;
}

export const DestinationForm: React.FC<DestinationFormProps> = ({
  destination: existingDestination,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Destination>({
    defaultValues: existingDestination || {
      id: '',
      name: '',
      tagline: '',
      image_url: '',
      glow_color: '#3B82F6',
      description: '',
      key_features: [''],
      link: '',
    },
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: 'key_features',
  });

  const handleFormSubmit = async (data: Destination) => {
    setIsSubmitting(true);
    try {
      // Generate ID from name if creating new destination
      if (!existingDestination) {
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
              Destination Name *
            </label>
            <input
              {...register('name', { required: 'Destination name is required' })}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tagline *
            </label>
            <input
              {...register('tagline', { required: 'Tagline is required' })}
              type="text"
              placeholder="e.g., Where the Great Migration Begins"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.tagline && <p className="text-red-500 text-sm mt-1">{errors.tagline.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL *
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
              Link *
            </label>
            <input
              {...register('link', { required: 'Link is required' })}
              type="text"
              placeholder="e.g., /destinations/masai-mara"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link.message}</p>}
          </div>
        </div>

        {/* Key Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Features *
          </label>
          {featureFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mb-2">
              <input
                {...register(`key_features.${index}` as const, { required: 'Feature is required' })}
                type="text"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendFeature('')}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Feature
          </button>
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
          {existingDestination ? 'Update Destination' : 'Create Destination'}
        </Button>
      </div>
    </form>
  );
};