import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../lib/api.js';
import { getSocket } from '../lib/socket.js';

// Central data hook: loads conversations over REST, then keeps them in sync
// through Socket.IO events (new messages, typing indicators, presence).
export function useChat(currentUserId) {
  const [conversations, setConversations] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [typing, setTyping] = useState({});
  const [onlineIds, setOnlineIds] = useState([]);
  const [unread, setUnread] = useState({});
  const [activeId, setActiveId] = useState(null);

  const activeIdRef = useRef(null);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    if (!currentUserId) return;
    let active = true;
    setStatus('loading');
    api
      .getConversations()
      .then((data) => {
        if (!active) return;
        // Only surface conversations the signed-in user participates in.
        setConversations(data.filter((convo) => convo.participantIds.includes(currentUserId)));
        setStatus('ready');
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message);
        setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;
    const socket = getSocket();
    socket.connect();
    socket.emit('user:join', currentUserId);

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onNewMessage = ({ conversationId, message }) => {
      setConversations((prev) =>
        prev.map((convo) => {
          if (convo.id !== conversationId) return convo;
          if (convo.messages.some((m) => m.id === message.id)) return convo;
          return { ...convo, messages: [...convo.messages, message] };
        })
      );

      const isMine = message.senderId === currentUserId;
      if (!isMine && activeIdRef.current !== conversationId) {
        setUnread((prev) => ({ ...prev, [conversationId]: (prev[conversationId] || 0) + 1 }));
      } else if (!isMine) {
        api.markRead(conversationId).catch(() => {});
      }
    };

    const onTypingStart = ({ conversationId, userId }) => {
      if (userId === currentUserId) return;
      setTyping((prev) => {
        const set = new Set(prev[conversationId] || []);
        set.add(userId);
        return { ...prev, [conversationId]: [...set] };
      });
    };

    const onTypingStop = ({ conversationId, userId }) => {
      setTyping((prev) => {
        const set = new Set(prev[conversationId] || []);
        set.delete(userId);
        return { ...prev, [conversationId]: [...set] };
      });
    };

    const onPresence = (ids) => setOnlineIds(ids);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message:new', onNewMessage);
    socket.on('typing:start', onTypingStart);
    socket.on('typing:stop', onTypingStop);
    socket.on('presence:update', onPresence);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message:new', onNewMessage);
      socket.off('typing:start', onTypingStart);
      socket.off('typing:stop', onTypingStop);
      socket.off('presence:update', onPresence);
      socket.disconnect();
      setConnected(false);
    };
  }, [currentUserId]);

  const openConversation = useCallback((conversationId) => {
    setActiveId(conversationId);
    activeIdRef.current = conversationId;
    setUnread((prev) => {
      if (!prev[conversationId]) return prev;
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
    api.markRead(conversationId).catch(() => {});
  }, []);

  const closeConversation = useCallback(() => {
    setActiveId(null);
    activeIdRef.current = null;
  }, []);

  const sendMessage = useCallback(
    async (conversationId, text) => {
      const trimmed = text.trim();
      if (!trimmed || !currentUserId) return;
      const socket = getSocket();
      if (socket.connected) {
        socket.emit('message:send', { conversationId, senderId: currentUserId, text: trimmed });
        return;
      }
      const message = await api.sendMessage(conversationId, {
        senderId: currentUserId,
        text: trimmed
      });
      setConversations((prev) =>
        prev.map((convo) =>
          convo.id === conversationId ? { ...convo, messages: [...convo.messages, message] } : convo
        )
      );
    },
    [currentUserId]
  );

  const notifyTyping = useCallback(
    (conversationId, isTyping) => {
      const socket = getSocket();
      if (!socket.connected || !currentUserId) return;
      socket.emit(isTyping ? 'typing:start' : 'typing:stop', {
        conversationId,
        userId: currentUserId
      });
    },
    [currentUserId]
  );

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId]
  );

  return {
    conversations,
    activeConversation,
    activeId,
    status,
    error,
    connected,
    typing,
    onlineIds,
    unread,
    openConversation,
    closeConversation,
    sendMessage,
    notifyTyping
  };
}
