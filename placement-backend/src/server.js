import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import tpoRoutes from './routes/tpoRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { seedDatabase } from './seed/seed.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'default_fallback_placement_jwt_secret_2026';
}

export const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

export const setupApp = () => {
  if (app._routesReady) {
    return app;
  }

  app.use('/api/auth', authRoutes);
  app.use('/api/student', studentRoutes);
  app.use('/api/company', companyRoutes);
  app.use('/api/tpo', tpoRoutes);
  app.use('/api/admin', adminRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date() });
  });

  app.use(errorHandler);
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  app._routesReady = true;
  return app;
};

export const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    setupApp();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

setupApp();

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
