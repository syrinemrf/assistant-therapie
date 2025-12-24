import { Request, Response } from 'express';
import Session from '../models/Session';
import Message from '../models/Message';
import { logger } from '../utils/logger';

export const createSession = async (req: Request, res: Response) => {
  try {
    const { userId, initialMood } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const session = await Session.create({
      userId,
      title: 'Nouvelle session',
      initialMood,
      status: 'active',
      startedAt: new Date()
    });

    logger.info(`Session créée: ${session._id} pour user: ${userId}`);
    res.status(201).json(session);
  } catch (error) {
    logger.error('Erreur création session:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUserSessions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const sessions = await Session.find({ userId })
      .sort({ startedAt: -1 })
      .limit(20);

    res.json(sessions);
  } catch (error) {
    logger.error('Erreur récupération sessions:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Nouvelle fonction pour récupérer l'historique complet avec messages
export const getSessionsWithMessages = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    // Récupérer toutes les sessions de l'utilisateur
    const sessions = await Session.find({ userId })
      .sort({ startedAt: -1 })
      .limit(Number(limit));

    // Pour chaque session, récupérer ses messages
    const sessionsWithMessages = await Promise.all(
      sessions.map(async (session) => {
        const messages = await Message.find({ sessionId: session._id })
          .sort({ timestamp: 1 })
          .limit(100);

        return {
          ...session.toObject(),
          messages,
          messageCount: messages.length
        };
      })
    );

    res.json(sessionsWithMessages);
  } catch (error) {
    logger.error('Erreur récupération historique:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Récupérer une session spécifique avec tous ses messages
export const getSessionById = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const messages = await Message.find({ sessionId })
      .sort({ timestamp: 1 });

    res.json({
      ...session.toObject(),
      messages
    });
  } catch (error) {
    logger.error('Erreur récupération session:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const endSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { finalMood, summary } = req.body;

    const session = await Session.findByIdAndUpdate(
      sessionId,
      {
        status: 'completed',
        endedAt: new Date(),
        finalMood,
        summary
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    logger.info(`Session terminée: ${sessionId}`);
    res.json(session);
  } catch (error) {
    logger.error('Erreur fin session:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
