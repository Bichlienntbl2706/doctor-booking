import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config';

async function connectDB() {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process with failure
    }
}

async function bootstrap() {
    await connectDB(); // Connect to MongoDB before starting the server

    const server: Server = app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });

    const exitHandler = () => {
        if (server) {
            server.close(() => {
                console.log('Server Closed');
            });
        }
    };

    const unexpectedHandler = (error: any) => {
        console.log('Handler Error', error);
        exitHandler();
    };

    process.on('uncaughtException', unexpectedHandler);
    process.on('unhandledRejection', unexpectedHandler);

    process.on('SIGTERM', () => {
        console.log('SIGTERM Received');
        if (server) {
            server.close();
        }
    });
}

bootstrap();
