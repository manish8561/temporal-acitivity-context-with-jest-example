import { defineSignal, defineQuery, setHandler, proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const { greetActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

const greetSignal = defineSignal<[string]>('greet');
const getGreetingQuery = defineQuery<string>('getGreeting');

let greeting = 'Hello';

const greetSignalCall = (name: string) => {
  greeting = `Hello, ${name}!`;
};

export const exampleWorkflow = async (): Promise<string> => {
  setHandler(greetSignal, greetSignalCall);

  setHandler(getGreetingQuery, () => {
    return greeting;
  });
  return await greetActivity(greeting);
};
