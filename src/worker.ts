import { Worker } from '@temporalio/worker';

async function run() {
  // Create a new worker and register our workflow
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    taskQueue: 'example',
  });

  // Run the worker
  await worker.run();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});