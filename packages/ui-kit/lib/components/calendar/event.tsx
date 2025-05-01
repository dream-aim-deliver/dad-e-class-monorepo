import React from 'react';
import { Button } from '../button';
import { X } from 'lucide-react';

export type Event = {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  attendees?: string;
  isCoachAvailability?: boolean;
  isYourMeeting?: boolean;
  extendedProps?: {
    numberOfSessions?: number;
    sessionId?: string;
  };
};

type EventContentProps = {
  eventInfo: any;
  onClick: () => void;
};

export const EventContent: React.FC<EventContentProps> = ({ eventInfo, onClick }) => {
  const isCoachAvailability = eventInfo.event.extendedProps.isCoachAvailability;
  const isYourMeeting = eventInfo.event.extendedProps.isYourMeeting;

  const eventStyle = isCoachAvailability
    ? 'bg-action-semi-transparent-medium text-action-primary'
    : isYourMeeting
    ? 'bg-action-default text-black border border-action-default'
    : 'bg-action-default text-black border border-action-default';

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-lg ${eventStyle} p-2 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <h3 className="truncate text-sm font-semibold">
          {eventInfo.event.title}
          {eventInfo.event.extendedProps.numberOfSessions &&
            eventInfo.event.extendedProps.numberOfSessions > 1 && (
              <span> (x{eventInfo.event.extendedProps.numberOfSessions})</span>
            )}
        </h3>
        <span className="rounded-full bg-white/20 px-2 py-1 text-xs flex items-start">
          {new Date(eventInfo.event.start).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
      <p className="mt-1 truncate text-xs">{eventInfo.event.extendedProps.description}</p>
      <div className="absolute left-0 top-full z-50 mt-2 hidden w-64 rounded-lg bg-gray-800 p-3 text-white shadow-xl group-hover:block">
        <h4 className="font-semibold">
          {eventInfo.event.title}
          {eventInfo.event.extendedProps.numberOfSessions &&
            eventInfo.event.extendedProps.numberOfSessions > 1 && (
              <span> (x{eventInfo.event.extendedProps.numberOfSessions})</span>
            )}
        </h4>
        <p className="mt-1 text-sm">{eventInfo.event.extendedProps.description}</p>
        <p className="mt-2 text-xs">
          {new Date(eventInfo.event.start).toLocaleString()} -{' '}
          {new Date(eventInfo.event.end).toLocaleString()}
        </p>
        {eventInfo.event.extendedProps.attendees && (
          <p className="mt-2 text-xs">Attendees: {eventInfo.event.extendedProps.attendees}</p>
        )}
      </div>
    </div>
  );
};

// EventModal component
type EventModalProps = {
  isOpen: boolean;
  selectedEvent: Event | null;
  newEvent: { title: string; description: string; start: string; end: string; attendees: string };
  setNewEvent: (event: {
    title: string;
    description: string;
    start: string;
    end: string;
    attendees: string;
  }) => void;
  onClose: () => void;
  onSave: () => void;
};

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  selectedEvent,
  newEvent,
  setNewEvent,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedEvent ? 'Edit Event' : 'Add Event'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Event title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Event description"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="datetime-local"
              value={newEvent.start.slice(0, 16)}
              onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="datetime-local"
              value={newEvent.end.slice(0, 16)}
              onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attendees (comma-separated emails)
            </label>
            <input
              type="text"
              value={newEvent.attendees}
              onChange={(e) => setNewEvent({ ...newEvent, attendees: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="email1@example.com, email2@example.com"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <Button
            variant="secondary"
            size="small"
            onClick={onClose}
            text="Cancel"
          />
          <Button
            variant="primary"
            size="small"
            onClick={onSave}
            text={selectedEvent ? 'Update Meeting' : 'Send Meeting Request'}
          />
        </div>
      </div>
    </div>
  );
};