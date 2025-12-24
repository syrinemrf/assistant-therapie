import { Router } from 'express';
import { 
  createActivity, 
  getUserActivities, 
  getTodayActivities,
  getActivityStats 
} from '../controllers/activityController';

const router = Router();

router.post('/', createActivity);
router.get('/user/:userId', getUserActivities);
router.get('/user/:userId/today', getTodayActivities);
router.get('/user/:userId/stats', getActivityStats);

export default router;
