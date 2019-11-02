/**
 * 该文件仅供 knex-cli 使用
 * model 中的数据库配置信息是直接从 .env 中获取
 */
require('dotenv').config({ path: '../../.env' });

const {
  KNEX_CLIENT = 'mysql',
  MYSQL_HOST = 'localhost',
  MYSQL_USER = 'root',
  MYSQL_PASSWORD = '',
  MYSQL_DATABASE = 'qrmaps',
  MYSQL_PORT = '3306'
} = process.env;

module.exports = {
  client: KNEX_CLIENT,
  connection: {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: MYSQL_PORT
  },
  migrations: {
    tableName: 'migrations',
    directory: '../../migrations'
  },
  seeds: {
    directory: '../../seeds'
  }
};
