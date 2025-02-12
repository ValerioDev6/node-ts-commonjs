import express from 'express';
import fileUpload from 'express-fileupload';

import { Router } from 'express';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../config';

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  private app = express();
  private readonly port: number;
  private readonly routes: Router;
  private dbConnection?: DataSource;

  constructor(options: Options) {
    const { port, routes } = options;
    this.port = port;
    this.routes = routes;
  }

  async start() {
    // middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
      }),
    );

    // Public

    // databse
    await this.connectDB();
    // Routes
    this.app.use(this.routes);

    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
    });
  }

  private async connectDB(): Promise<void> {
    try {
      this.dbConnection = await AppDataSource.initialize();
      console.log('✅ Database connected successfully!');
    } catch (error) {
      console.error('❌ Database connection error:', error);
      throw new Error('Error initializing database');
    }
  }
}
