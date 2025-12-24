import { Server, Socket } from 'socket.io';
import geminiService from './gemini.service';
import Message from '../models/Message';
import Session from '../models/Session';
import { logger } from '../utils/logger';

export const setupSocketIO = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    logger.info(`Client connecté: ${socket.id}`);

    socket.on('join_session', async ({ userId, sessionId }) => {
      socket.join(`session_${sessionId}`);
      
      // Charger l'historique depuis MongoDB
      const messages = await Message.find({ sessionId })
        .sort({ timestamp: 1 })
        .limit(50)
        .lean();
      
      socket.emit('session_history', messages);
    });

    socket.on('send_message', async (data) => {
      const { message, userId, sessionId } = data;

      try {
        // Sauvegarder le message de l'utilisateur
        const userMessage = await Message.create({
          sessionId,
          userId,
          role: 'user',
          content: message,
          timestamp: new Date()
        });

        socket.emit('receive_message', userMessage);

        // Charger l'historique pour le contexte
        const history = await Message.find({ sessionId })
          .sort({ timestamp: -1 })
          .limit(10)
          .lean();

        // Obtenir la réponse de Gemini
        const aiResponse = await geminiService.chat(
          message, 
          history.reverse()
        );

        // Analyser l'humeur (optionnel)
        const mood = await geminiService.analyzeMood(message);

        // Sauvegarder la réponse de l'assistant
        const assistantMessage = await Message.create({
          sessionId,
          userId,
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
          metadata: { mood }
        });

        socket.emit('receive_message', assistantMessage);

      } catch (error) {
        logger.error('Erreur lors du traitement du message:', error);
        socket.emit('error', { message: 'Une erreur est survenue' });
      }
    });

    socket.on('end_session', async ({ sessionId }) => {
      await Session.findByIdAndUpdate(sessionId, {
        status: 'completed',
        endedAt: new Date()
      });
      
      socket.emit('session_ended');
    });

    socket.on('disconnect', () => {
      logger.info(`Client déconnecté: ${socket.id}`);
    });
  });
};