import { client } from '@/lib/api';

const getConversationsDummy = async () => {
  const res = await client.api.chat.conversations.get();
  if (res.error) throw new Error();
  return res.data.data;
};
export type Conversation = Awaited<ReturnType<typeof getConversationsDummy>>[0];
export type ConversationParticipant = Conversation['participants'][0];

const getMessagesDummy = async () => {
  const res = await client.api.chat.conversation({ id: 'any' }).messages.get();
  if (res.error) throw new Error();
  return res.data.data.messages;
};
export type Message = Awaited<ReturnType<typeof getMessagesDummy>>[0];

// Alias User to Participant for backward compatibility in components
export type User = ConversationParticipant;
