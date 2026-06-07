import React, { useState, useEffect, useRef } from 'react';

function ChatBox({ messages, onSendMessage, currentUserId }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="glass-panel flex flex-col h-64 md:h-80 w-full font-sans">
      <div className="bg-wood/20 border-b border-wood/30 px-4 py-2 font-serif text-wood-light flex justify-between items-center rounded-t-xl">
        <span>Trò Chuyện</span>
        <span className="material-symbols-outlined text-sm opacity-70">forum</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-wood/50">
        {messages.map((msg, idx) => {
          const isSystem = msg.senderId === 'system';
          const isMine = msg.senderId === currentUserId;

          if (isSystem) {
            return (
              <div key={idx} className="text-center">
                <span className="text-xs bg-wood/10 text-wood-light/70 px-2 py-1 rounded-full italic">{msg.message}</span>
              </div>
            );
          }

          return (
            <div key={idx} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-wood-light/50 mb-0.5 px-1">{msg.senderName}</span>
              <div className={`px-3 py-1.5 rounded-lg text-sm max-w-[85%] ${isMine ? 'bg-wood text-ink rounded-tr-none' : 'bg-ink-light border border-wood/30 text-wood-light rounded-tl-none'}`}>
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-wood/30 p-2 flex gap-2 bg-ink/30 rounded-b-xl">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..." 
          className="flex-1 bg-ink/50 border border-wood/20 rounded-md px-3 py-1.5 text-sm text-wood-light outline-none focus:border-wood/50 transition-colors"
        />
        <button type="submit" className="bg-wood/20 hover:bg-wood/40 text-wood p-1.5 rounded-md transition-colors" disabled={!input.trim()}>
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </form>
    </div>
  );
}

export default ChatBox;
