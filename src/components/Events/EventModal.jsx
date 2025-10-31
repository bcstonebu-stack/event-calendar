import React, { useState, useEffect } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { EVENT_COLORS } from '../../utils/constants';
import { validateEvent } from '../../utils/eventHelpers';

export function EventModal({ isOpen, onClose, onSave, event = null, prefilledDate = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    allDay: false,
    color: '#3B82F6',
    location: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.startDate);
      const endDate = event.endDate ? new Date(event.endDate) : null;

      setFormData({
        title: event.title,
        description: event.description || '',
        startDate: startDate.toISOString().split('T')[0],
        startTime: event.allDay ? '' : startDate.toTimeString().slice(0, 5),
        endDate: endDate ? endDate.toISOString().split('T')[0] : '',
        endTime: endDate && !event.allDay ? endDate.toTimeString().slice(0, 5) : '',
        allDay: event.allDay,
        color: event.color,
        location: event.location || ''
      });
    } else {
      // Reset form for new event
      let now = new Date();

      if (prefilledDate) {
        if (prefilledDate instanceof Date && !isNaN(prefilledDate.getTime())) {
          now = prefilledDate;
        } else if (typeof prefilledDate === 'string' || typeof prefilledDate === 'number') {
          const parsedDate = new Date(prefilledDate);
          if (!isNaN(parsedDate.getTime())) {
            now = parsedDate;
          }
        }
      }

      setFormData({
        title: '',
        description: '',
        startDate: now.toISOString().split('T')[0],
        startTime: now.toTimeString().slice(0, 5),
        endDate: '',
        endTime: '',
        allDay: false,
        color: '#3B82F6',
        location: ''
      });
    }
    setErrors({});
  }, [event, prefilledDate, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct date strings
    let startDateStr, endDateStr = null;

    if (formData.allDay) {
      startDateStr = new Date(formData.startDate + 'T00:00:00').toISOString();
      if (formData.endDate) {
        endDateStr = new Date(formData.endDate + 'T23:59:59').toISOString();
      }
    } else {
      startDateStr = new Date(formData.startDate + 'T' + formData.startTime).toISOString();
      if (formData.endDate && formData.endTime) {
        endDateStr = new Date(formData.endDate + 'T' + formData.endTime).toISOString();
      }
    }

    const eventData = {
      title: formData.title,
      description: formData.description,
      startDate: startDateStr,
      endDate: endDateStr,
      allDay: formData.allDay,
      color: formData.color,
      location: formData.location
    };

    const validation = validateEvent(eventData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSave(eventData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Edit Event' : 'Add New Event'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Event title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Add a description..."
          />
        </div>

        {/* All Day Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allDay"
            name="allDay"
            checked={formData.allDay}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="allDay" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            All day event
          </label>
        </div>

        {/* Start Date/Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
          </div>

          {!formData.allDay && (
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          )}
        </div>

        {/* End Date/Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>

          {!formData.allDay && (
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Add a location..."
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {EVENT_COLORS.map((colorOption) => (
              <button
                key={colorOption.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, color: colorOption.value }))}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  formData.color === colorOption.value
                    ? 'border-gray-900 dark:border-gray-100 scale-110'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: colorOption.value }}
                aria-label={colorOption.name}
              />
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {event ? 'Update Event' : 'Add Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
