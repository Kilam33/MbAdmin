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

interface FormData {
  name: string;
  tagline: string;
  image_url: string;
  glow_color: string;
  description: string;
  key_features: Array<{ value: string }>;
  link: string;
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
  } = useForm<FormData>({
    defaultValues: {
      name: existingDestination?.name || '',
      tagline: existingDestination?.tagline || '',
      image_url: existingDestination?.image_url || '',
      glow_color: existingDestination?.glow_color || '#3B82F6',
      description: existingDestination?.description || '',
      key_features: existingDestination?.key_features?.map(feature => ({ value: feature })) || [{ value: '' }],
      link: existingDestination?.link || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'key_features',
  });

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Transform form data to match DB schema
      const formattedData: Partial<Destination> = {
        name: data.name.trim(),
        tagline: data.tagline.trim(),
        image_url: data.image_url.trim(),
        glow_color: data.glow_color,
        description: data.description.trim(),
        key_features: data.key_features
          .map(item => item.value.trim())
          .filter(value => value !== ''), // Store as string array for JSONB
        link: data.link.trim(),
      };
      
      // Generate ID for new destinations based on name
      if (!existingDestination) {
        formattedData.id = data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      
      await onSubmit(formattedData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination Name *
              </label>
              <input
                {...register('name', { 
                  required: 'Destination name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                type="text"
                placeholder="e.g., Masai Mara"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagline *
              </label>
              <input
                {...register('tagline', { 
                  required: 'Tagline is required',
                  minLength: { value: 5, message: 'Tagline must be at least 5 characters' }
                })}
                type="text"
                placeholder="e.g., Where the Great Migration Begins"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.tagline && <p className="text-red-500 text-xs mt-1">{errors.tagline.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL *
              </label>
              <input
                {...register('image_url', { 
                  required: 'Image URL is required',
                  pattern: {
                    value: /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i,
                    message: 'Please enter a valid image URL'
                  }
                })}
                type="url"
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.image_url && <p className="text-red-500 text-xs mt-1">{errors.image_url.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Glow Color *
              </label>
              <div className="flex items-center space-x-2">
                <input
                  {...register('glow_color', { required: 'Glow color is required' })}
                  type="color"
                  className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  {...register('glow_color')}
                  type="text"
                  placeholder="#3B82F6"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {errors.glow_color && <p className="text-red-500 text-xs mt-1">{errors.glow_color.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link *
              </label>
              <input
                {...register('link', { 
                  required: 'Link is required',
                  pattern: {
                    value: /^\/.*$/,
                    message: 'Link must start with /'
                  }
                })}
                type="text"
                placeholder="/destinations/masai-mara"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.link && <p className="text-red-500 text-xs mt-1">{errors.link.message}</p>}
              <p className="text-xs text-gray-500 mt-1">Internal link path starting with /</p>
            </div>
          </div>

          {/* Right Column - Key Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features * (at least 1 required)
              </label>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <input
                      {...register(`key_features.${index}.value`, { 
                        required: 'Feature cannot be empty' 
                      })}
                      type="text"
                      placeholder="e.g., World's most spectacular wildlife migration"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      disabled={fields.length === 1}
                      title="Remove feature"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={() => append({ value: '' })}
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2 p-2 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Feature
              </button>
              
              {errors.key_features && (
                <p className="text-red-500 text-xs mt-1">At least one feature is required</p>
              )}
            </div>
          </div>
        </div>

        {/* Full Width - Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            {...register('description', { 
              required: 'Description is required',
              minLength: { value: 20, message: 'Description must be at least 20 characters' }
            })}
            rows={4}
            placeholder="Provide a detailed description of this destination..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {existingDestination ? 'Update Destination' : 'Create Destination'}
          </Button>
        </div>
      </form>
    </div>
  );
};