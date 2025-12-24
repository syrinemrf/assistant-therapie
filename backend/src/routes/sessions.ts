import { Router } from 'express';
import { 
  createSession, 
  getUserSessions, 
  getSessionsWithMessages,
  getSessionById,
  endSession 
} from '../controllers/sessionController';

const router = Router();

router.post('/', createSession);
router.get('/user/:userId', getUserSessions);
router.get('/user/:userId/history', getSessionsWithMessages); // Historique complet
router.get('/:sessionId', getSessionById); // Session spécifique avec messages
router.patch('/:sessionId/end', endSession);

export default router;
