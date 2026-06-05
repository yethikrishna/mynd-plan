export type Role = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

export default function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className={`animate-rise flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={
          isUser
            ? 'max-w-[78%] rounded-3xl rounded-br-lg bg-accent px-4 py-2.5 text-[15px] leading-relaxed text-white shadow-lift'
            : 'max-w-[88%] rounded-3xl rounded-bl-lg glass px-4 py-2.5 text-[15px] leading-relaxed text-ink shadow-glass'
        }
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
