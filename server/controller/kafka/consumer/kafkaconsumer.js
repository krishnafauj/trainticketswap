import kafka from "../kafka";
const producer = kafka.producer();
async function produceMessage()
{
    await producer.connect();

    await producer.send({
        topic: 'my-topic',
        messages: [
          { key: 'user1', value: 'Hello from user1' },
          { key: 'user2', value: 'Hello from user2' },
        ],
      }); 
    
      console.log('Messages sent');
      await producer.disconnect();
}
produceMessage().catch(console.error);
