import { useMemo } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { useChat } from './hooks/useChat.js';
import { buildUserIndex, lastMessage } from './lib/conversations.js';
import LoginScreen from './components/LoginScreen.jsx';
import Sidebar from './components/Sidebar.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import NoConversationSelected from './components/NoConversationSelected.jsx';

export default function App() {
  const { currentUser, users, status, logout } = useAuth();

  if (status === 'loading' && !currentUser) return <BootScreen />;
  if (!currentUser) return <LoginScreen />;

  return <ChatApp currentUser={currentUser} users={users} onLogout={logout} />;
}

function ChatApp({ currentUser, users, onLogout }) {
  const {
    conversations,
    activeConversation,
    activeId,
    status,
    connected,
    typing,
    onlineIds,
    unread,
    openConversation,
    closeConversation,
    sendMessage,
    notifyTyping
  } = useChat(currentUser.id);

  const usersById = useMemo(() => buildUserIndex(users), [users]);

  const mostRecentId = useMemo(() => {
    const sorted = [...conversations].sort((a, b) => {
      const at = lastMessage(a)?.createdAt ? new Date(lastMessage(a).createdAt).getTime() : 0;
      const bt = lastMessage(b)?.createdAt ? new Date(lastMessage(b).createdAt).getTime() : 0;
      return bt - at;
    });
    return sorted[0]?.id || null;
  }, [conversations]);

  const listLoading = status === 'loading' && conversations.length === 0;

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-app">
      <div
        className={`${activeId ? 'hidden' : 'flex'} w-full lg:flex lg:w-[340px] xl:w-[400px] lg:shrink-0`}
      >
        <Sidebar
          className="w-full"
          conversations={conversations}
          usersById={usersById}
          currentUser={currentUser}
          activeId={activeId}
          onSelect={openConversation}
          unread={unread}
          typing={typing}
          connected={connected}
          onLogout={onLogout}
        />
      </div>

      <div className={`${activeId ? 'flex' : 'hidden'} min-w-0 flex-1 lg:flex`}>
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            currentUserId={currentUser.id}
            usersById={usersById}
            typingUserIds={typing[activeId] || []}
            onlineIds={onlineIds}
            connected={connected}
            loading={listLoading}
            onBack={closeConversation}
            onSend={sendMessage}
            onTyping={notifyTyping}
          />
        ) : (
          <NoConversationSelected onOpenFirst={() => mostRecentId && openConversation(mostRecentId)} />
        )}
      </div>
    </div>
  );
}

function BootScreen() {
  return (
    <div className="grid h-dvh place-items-center bg-app">
      <div className="flex flex-col items-center gap-3">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        <p className="text-sm text-content-muted">Starting Chatly...</p>
      </div>
    </div>
  );
}
