export type DemoMessage = {
  id: string;
  body: string;
  created_at: string;
  sender_id?: string;
  conversation_id?: string;
  status?: "sent" | "delivered" | "seen";
  reactions?: Array<{ id: string; reaction: string; profile_id: string }>;
};

export type DemoConversation = {
  id: string;
  title?: string;
  last_message?: { body?: string; sender_avatar?: string };
  last_activity?: string;
  unread_count?: number;
  avatar_url?: string;
  participant_name?: string;
  is_online?: boolean;
  is_typing?: boolean;
  category?: "all" | "unread" | "club" | "mentors" | "circles";
  messages?: DemoMessage[];
};

const STORAGE_KEY = "big-demo-messaging-state-v1";
export const DEFAULT_CONVERSATION_ID = "demo-conversation-1";

const createSeedMessages = (): DemoMessage[] => [
  {
    id: "demo-msg-1",
    body: "Hey! I was just thinking about your new idea. It feels so strong.",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    sender_id: "demo-peer",
    conversation_id: DEFAULT_CONVERSATION_ID,
    status: "seen",
    reactions: [
      { id: "demo-reaction-1", reaction: "❤️", profile_id: "demo-peer" },
    ],
  },
  {
    id: "demo-msg-2",
    body: "I would love to swap notes and help shape the launch plan with you.",
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    sender_id: "demo-user",
    conversation_id: DEFAULT_CONVERSATION_ID,
    status: "seen",
    reactions: [
      { id: "demo-reaction-2", reaction: "👏", profile_id: "demo-user" },
    ],
  },
];

const createSeedConversation = (): DemoConversation => ({
  id: DEFAULT_CONVERSATION_ID,
  title: "Amina",
  participant_name: "Amina",
  avatar_url: "/images/member-placeholder.svg",
  last_message: {
    body: "I would love to swap notes and help shape the launch plan with you.",
    sender_avatar: "/images/member-placeholder.svg",
  },
  last_activity: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  unread_count: 1,
  is_online: true,
  is_typing: false,
  category: "mentors",
  messages: createSeedMessages(),
});

function readStoredState(): { conversations: DemoConversation[] } {
  if (typeof window === "undefined") {
    return { conversations: [createSeedConversation()] };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = { conversations: [createSeedConversation()] };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }

    const parsed = JSON.parse(raw) as { conversations?: DemoConversation[] };
    if (!parsed.conversations?.length) {
      const seeded = { conversations: [createSeedConversation()] };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }

    return { conversations: parsed.conversations };
  } catch {
    return { conversations: [createSeedConversation()] };
  }
}

function writeStoredState(state: { conversations: DemoConversation[] }) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getDemoConversationList(): DemoConversation[] {
  return readStoredState().conversations;
}

export function getDemoConversationMessages(
  conversationId: string,
): DemoMessage[] {
  const state = readStoredState();
  const conversation = state.conversations.find(
    (item) => item.id === conversationId,
  );
  return conversation?.messages ?? [];
}

export function saveDemoConversationMessages(
  conversationId: string,
  messages: DemoMessage[],
) {
  const state = readStoredState();
  const conversations = state.conversations.map((conversation) => {
    if (conversation.id !== conversationId) return conversation;
    const latest = messages[messages.length - 1];
    return {
      ...conversation,
      messages,
      last_message: latest
        ? {
            body: latest.body,
            sender_avatar:
              latest.sender_id === "demo-user"
                ? "/images/member-placeholder.svg"
                : "/images/member-placeholder.svg",
          }
        : conversation.last_message,
      last_activity: latest?.created_at ?? conversation.last_activity,
      unread_count:
        latest?.sender_id === "demo-user"
          ? 0
          : Math.max(conversation.unread_count || 0, 1),
      is_typing: false,
    };
  });

  writeStoredState({ conversations });
}

export function appendDemoMessage(
  conversationId: string,
  message: DemoMessage,
) {
  const state = readStoredState();
  const conversations = state.conversations.map((conversation) => {
    if (conversation.id !== conversationId) return conversation;
    const nextMessages = [...(conversation.messages ?? []), message];
    return {
      ...conversation,
      messages: nextMessages,
      last_message: {
        body: message.body,
        sender_avatar: "/images/member-placeholder.svg",
      },
      last_activity: message.created_at,
      unread_count:
        message.sender_id === "demo-user"
          ? 0
          : Math.max(conversation.unread_count || 0, 1),
      is_typing: false,
    };
  });

  writeStoredState({ conversations });
}

export function createDemoReply(
  text: string,
  conversationId: string,
): DemoMessage {
  const replyTemplates = [
    "That sounds exciting — I’m already picturing the next step.",
    "Love this energy. I’d be happy to help you refine it.",
    "This feels so aligned. Let’s keep the momentum going.",
  ];

  const body = `${replyTemplates[Math.floor(Math.random() * replyTemplates.length)]} (${text})`;

  return {
    id: `demo-reply-${Date.now()}`,
    body,
    created_at: new Date().toISOString(),
    sender_id: "demo-peer",
    conversation_id: conversationId,
    status: "delivered",
    reactions: [],
  };
}
