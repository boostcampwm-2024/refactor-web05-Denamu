import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
const globalAny: any = global;

export default async () => {
  console.log('Starting MySQL container...');
  const testContainer: StartedMySqlContainer = await new MySqlContainer(
    'mysql:8',
  )
    .withDatabase('denamu')
    .start();
  console.log('MySQL container started.');
  globalAny.__MYSQL_CONTAINER__ = testContainer;

  // 환경 변수 설정
  process.env.DB_TYPE = 'mysql';
  process.env.DB_HOST = testContainer.getHost();
  process.env.DB_PORT = testContainer.getPort().toString();
  process.env.DB_USERNAME = testContainer.getUsername();
  process.env.DB_PASSWORD = testContainer.getUserPassword();
  process.env.DB_DATABASE = testContainer.getDatabase();

  console.log('Global setup completed.');
};
