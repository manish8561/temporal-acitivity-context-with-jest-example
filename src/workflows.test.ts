import * as temporalworkflow from '@temporalio/workflow';
import { exampleWorkflow } from './workflows';
import * as activities from './activities';

jest.mock('@temporalio/workflow', () => ({
  defineSignal: jest.fn(),
  defineQuery: jest.fn(),
  setHandler: jest.fn(),
  proxyActivities: jest.fn().mockReturnValue({
    greetActivity: jest.fn(),
  }),
}));

jest.mock('./activities');

describe('Example Workflow', () => {
  let greetSignal: jest.Mock;
  let getGreetingQuery: jest.Mock;
  let setHandler: jest.Mock;
  let greetActivity: jest.Mock;

  beforeAll(() => {
    greetSignal = temporalworkflow.defineSignal as jest.Mock;
    getGreetingQuery = temporalworkflow.defineQuery as jest.Mock;
    setHandler = temporalworkflow.setHandler as jest.Mock;
    greetActivity = activities.greetActivity as jest.Mock;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle greet signal and query', async () => {
    const signalHandler = jest.fn();
    const queryHandler = jest.fn(() => 'Hello2');

    greetSignal.mockReturnValue('greet');
    getGreetingQuery.mockReturnValue('getGreeting');
    setHandler.mockImplementation((handlerType, handler) => {
      if (handler.name === 'greetSignalCall') {
        signalHandler.mockImplementation(handler);
      }
      if (handler.name !== 'greetSignalCall') {
        queryHandler.mockImplementation(handler);
      }
    });

    // activity
    greetActivity.mockResolvedValue('Hello, World!');

    await exampleWorkflow();

    // Simulate sending a signal
    await signalHandler('World');

    expect(queryHandler()).toBe('Hello, World!');
  });
});
