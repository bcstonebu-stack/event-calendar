import express from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';

const router = express.Router();

// Define routes
router.get('/', getAllEvents);           // GET /api/events
router.get('/:id', getEventById);        // GET /api/events/:id
router.post('/', createEvent);           // POST /api/events
router.put('/:id', updateEvent);         // PUT /api/events/:id
router.delete('/:id', deleteEvent);      // DELETE /api/events/:id

export default router;
