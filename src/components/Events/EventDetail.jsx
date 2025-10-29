import React from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { Calendar, Clock, MapPin, Edit2, Trash2 } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateHelpers';
import { getEventDuration, isMultiDayEvent } from '../../utils/eventHelpers';

export function EventDetail({ event, isOpen, onClose, onEdit, onDelete }) {
  if (!event) return null;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Event Details">
      <div className="space-y-6">
        {/* Title with color indicator */}
        <div className="flex items-start gap-3">
          <div
            className="w-1 h-12 rounded-full"
            style={{ backgroundColor: event.color }}
          />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
            <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <div>{formatDate(event.startDate)}</div>
              {event.endDate && isMultiDayEvent(event) && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  to {formatDate(event.endDate)}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Clock className="w-5 h-5 flex-shrink-0" />
            <span>{getEventDuration(event)}</span>
          </div>

          {event.location && (
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <div>
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Description
            </h4>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div>Created: {formatDate(event.createdAt, 'MMM d, yyyy h:mm a')}</div>
          {event.updatedAt !== event.createdAt && (
            <div>Updated: {formatDate(event.updatedAt, 'MMM d, yyyy h:mm a')}</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="danger"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onEdit(event);
              onClose();
            }}
            className="flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
