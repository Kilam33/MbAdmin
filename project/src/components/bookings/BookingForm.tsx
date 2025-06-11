import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Booking } from '../../types';
import { Button } from '../ui/Button';

interface BookingFormProps {
  booking?: Booking;
  onSubmit: (data: Partial<Booking>) => Promise<void>;
  onCancel: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  booking: existingBooking,
  onSubmit,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Booking>({
    defaultValues: existingBooking || {
      package_id: '',
      start_date: '',
      end_date: '',
      adults: 2,
      children: 0,
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      contact_country: '',
      special_requests: '',
      total_amount: 0,
      status: 'pending',
    },
  });

  const handleFormSubmit = async (data: Booking) => {
    setIsSubmitting(true);
    try {
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
        {/* Booking Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package ID *
            </label>
            <input
              {...register('package_id', { required: 'Package ID is required' })}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.package_id && <p className="text-red-500 text-sm mt-1">{errors.package_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              {...register('start_date', { required: 'Start date is required' })}
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              {...register('end_date', { required: 'End date is required' })}
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adults *
              </label>
              <input
                {...register('adults', { 
                  required: 'Number of adults is required',
                  min: { value: 1, message: 'At least 1 adult required' }
                })}
                type="number"
                min="1"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.adults && <p className="text-red-500 text-sm mt-1">{errors.adults.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Children
              </label>
              <input
                {...register('children', { 
                  min: { value: 0, message: 'Cannot be negative' }
                })}
                type="number"
                min="0"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.children && <p className="text-red-500 text-sm mt-1">{errors.children.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              {...register('status', { required: 'Status is required' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="awaiting_payment">Awaiting Payment</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="failed">Failed</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name *
            </label>
            <input
              {...register('contact_name', { required: 'Contact name is required' })}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.contact_name && <p className="text-red-500 text-sm mt-1">{errors.contact_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email *
            </label>
            <input
              {...register('contact_email', { 
                required: 'Contact email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                }
              })}
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.contact_email && <p className="text-red-500 text-sm mt-1">{errors.contact_email.message}</p>}
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
              Country
            </label>
            <input
              {...register('contact_country')}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount (USD)
            </label>
            <input
              {...register('total_amount', { 
                min: { value: 0, message: 'Amount cannot be negative' }
              })}
              type="number"
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.total_amount && <p className="text-red-500 text-sm mt-1">{errors.total_amount.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Reference
            </label>
            <input
              {...register('payment_reference')}
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Special Requests
        </label>
        <textarea
          {...register('special_requests')}
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
          {existingBooking ? 'Update Booking' : 'Create Booking'}
        </Button>
      </div>
    </form>
  );
};