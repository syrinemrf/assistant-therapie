import { Request, Response } from 'express';
import { Activity } from '../models/Activity';
import { logger } from '../utils/logger';
import { startOfDay, endOfDay } from 'date-fns';

export const createActivity = async (req: Request, res: Response) => {
  try {
    const { userId, type, name, description, duration, moodScore, moodNote, metadata } = req.body;

    if (!userId || !type || !name) {
      return res.status(400).json({ message: 'userId, type, and name are required' });
    }

    const activity = await Activity.create({
      userId,
      type,
      name,
      description,
      duration,
      moodScore,
      moodNote,
      metadata,
      timestamp: new Date(),
      completed: true,
    });

    logger.info(`Activity created: ${activity._id} for user: ${userId}`);
    res.status(201).json(activity);
  } catch (error) {
    logger.error('Error creating activity:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserActivities = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, type } = req.query;

    const query: any = { userId };

    if (type) {
      query.type = type;
    }

    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const activities = await Activity.find(query)
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(activities);
  } catch (error) {
    logger.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getTodayActivities = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const today = new Date();

    const activities = await Activity.find({
      userId,
      timestamp: {
        $gte: startOfDay(today),
        $lte: endOfDay(today),
      },
    }).sort({ timestamp: -1 });

    res.json(activities);
  } catch (error) {
    logger.error('Error fetching today activities:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getActivityStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const activities = await Activity.find({
      userId,
      timestamp: { $gte: startDate },
    });

    // Calculate stats
    const stats = {
      totalActivities: activities.length,
      byType: activities.reduce((acc: any, act) => {
        acc[act.type] = (acc[act.type] || 0) + 1;
        return acc;
      }, {}),
      averageMood: activities
        .filter(a => a.moodScore !== undefined)
        .reduce((acc, act, _, arr) => acc + (act.moodScore || 0) / arr.length, 0),
      completionRate: activities.filter(a => a.completed).length / activities.length * 100,
    };

    res.json(stats);
  } catch (error) {
    logger.error('Error fetching activity stats:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
