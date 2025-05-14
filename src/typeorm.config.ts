import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();
const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.getOrThrow('MYSQL_HOST'),
  port: configService.getOrThrow('MYSQL_PORT'),
  database: configService.getOrThrow('MYSQL_DATABASE'),
  username: configService.getOrThrow('MYSQL_USER'),
  password: configService.getOrThrow('MYSQL_PASSWORD'),
  logging: ['query', 'error'],
  migrations: ['dist/migrations/*.js'],
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
});
