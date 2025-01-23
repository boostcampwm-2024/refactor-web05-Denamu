const globalAny: any = global;

export default async () => {
  console.log('Stopping NestJS application...');
  if (globalAny.testApp) {
    await globalAny.testApp.close();
    delete globalAny.testApp;
  }

  console.log('Stopping MySQL container...');
  if (globalAny.__MYSQL_CONTAINER__) {
    await globalAny.__MYSQL_CONTAINER__.stop();
    delete globalAny.__MYSQL_CONTAINER__;
  }

  console.log('Global teardown completed.');
};
