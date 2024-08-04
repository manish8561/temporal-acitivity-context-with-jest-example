// @@@SNIPSTART typescript-hello-client
import { Connection, Client } from '@temporalio/client';
import { nanoid } from 'nanoid';

async function run() {
  // Connect to the default Server location
  const connection = await Connection.connect({ address: 'localhost:7233' });
  // In production, pass options to configure TLS and other settings:
  // {
  //   address: 'foo.bar.tmprl.cloud',
  //   tls: {}
  // }

  const client = new Client({
    connection,
    // namespace: 'foo.bar', // connects to 'default' namespace if not specified
  });

  const handle = await client.workflow.start('exampleWorkflow', {
    taskQueue: 'example',
    // type inference works! args: [name: string]
    args: ['Temporal'],
    // in practice, use a meaningful business ID, like customerId or transactionId
    workflowId: 'workflow-' + nanoid(),
  });
  console.log(`Started workflow ${handle.workflowId}`);

  // Signal the workflow
  await handle.signal('greet', 'Alice');
  console.log('result :::::: ', await handle.result());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
