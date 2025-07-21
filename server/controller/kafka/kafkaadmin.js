// admin.js
import kafka from "./kafka";
const admin = kafka.admin();

async function createTopic() {
  await admin.connect();

  const result = await admin.createTopics({
    topics: [{ topic: 'my-topic', numPartitions: 3, },{ topic: 'my-topic-2', numPartitions: 3 }],
    waitForLeaders: true,
  });

  console.log('Topics created:', result);
  await admin.disconnect();
}

createTopic().catch(console.error);
