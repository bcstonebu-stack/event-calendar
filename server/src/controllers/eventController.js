import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        startDate: 'asc'
      }
    });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

// Validation helper
const validateEventData = (data, isUpdate = false) => {
  const errors = [];

  // Title validation
  if (!isUpdate && !data.title) {
    errors.push('Title is required');
  }
  if (data.title && typeof data.title !== 'string') {
    errors.push('Title must be a string');
  }
  if (data.title && data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  // Description validation
  if (data.description && typeof data.description !== 'string') {
    errors.push('Description must be a string');
  }
  if (data.description && data.description.length > 2000) {
    errors.push('Description must be less than 2000 characters');
  }

  // Date validation
  if (!isUpdate && !data.startDate) {
    errors.push('Start date is required');
  }
  if (data.startDate && isNaN(new Date(data.startDate).getTime())) {
    errors.push('Invalid start date');
  }
  if (data.endDate && isNaN(new Date(data.endDate).getTime())) {
    errors.push('Invalid end date');
  }
  if (data.startDate && data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
    errors.push('End date must be after start date');
  }

  // Color validation (hex color format)
  if (data.color && !/^#[0-9A-F]{6}$/i.test(data.color)) {
    errors.push('Color must be a valid hex color (e.g., #3B82F6)');
  }

  // Location validation
  if (data.location && typeof data.location !== 'string') {
    errors.push('Location must be a string');
  }
  if (data.location && data.location.length > 200) {
    errors.push('Location must be less than 200 characters');
  }

  // AllDay validation
  if (data.allDay !== undefined && typeof data.allDay !== 'boolean') {
    errors.push('AllDay must be a boolean');
  }

  return errors;
};

// Create new event
export const createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, allDay, color, location } = req.body;

    // Validation
    const validationErrors = validateEventData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: validationErrors.join(', ') });
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        allDay: allDay || false,
        color: color || '#3B82F6',
        location: location?.trim() || null
      }
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate, allDay, color, location } = req.body;

    // Validation
    const validationErrors = validateEventData(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: validationErrors.join(', ') });
    }

    // Build update data object (only include fields that are provided)
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (allDay !== undefined) updateData.allDay = allDay;
    if (color !== undefined) updateData.color = color;
    if (location !== undefined) updateData.location = location?.trim() || null;

    const event = await prisma.event.update({
      where: { id },
      data: updateData
    });

    res.json(event);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Event not found' });
    }
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Event not found' });
    }
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
