import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  constructor(private app: INestApplication) {
    super(app);
  }

  async createIOServer(port: number, options?: ServerOptions): Promise<any> {
    const server = await super.createIOServer(port, options);

    const pubClient = createClient({ url: 'redis://localhost:6379' });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    server.adapter(createAdapter(pubClient, subClient));

    return server;
  }
}
