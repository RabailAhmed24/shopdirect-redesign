import { useMemo, useState } from "react";
import {
  Eye,
  Flag,
  MessageCircle,
  MessagesSquare,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import "../../../styles/super-admin-chat-monitoring.css";

const monitoringUsers = [];

function SuperAdminChatMonitoring() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return monitoringUsers;
    }

    return monitoringUsers.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    });
  }, [searchTerm]);

  const selectedUser =
    monitoringUsers.find((user) => user.id === selectedUserId) || null;

  const conversations = selectedUser?.conversations || [];

  const selectedConversation =
    conversations.find(
      (conversation) => conversation.id === selectedConversationId
    ) || null;

  const totalConversations = monitoringUsers.reduce(
    (total, user) => total + (user.conversations?.length || 0),
    0
  );

  const unreadFlaggedCount = monitoringUsers.reduce((total, user) => {
    const count =
      user.conversations?.filter(
        (conversation) =>
          conversation.flagged || Number(conversation.unread) > 0
      ).length || 0;

    return total + count;
  }, 0);

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    setSelectedConversationId(null);
  };

  const handleConversationSelect = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedUserId(null);
    setSelectedConversationId(null);
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getRoleClass = (role = "") => {
    return `sa-chat-role sa-chat-role--${role.toLowerCase()}`;
  };

  return (
    <section className="sa-chat-page">
      {/* ================================
          PAGE HEADER
      ================================= */}
      <header className="sa-chat-page-header">
        <div className="sa-chat-heading-group">
          <span className="sa-chat-eyebrow">SUPER ADMIN</span>

          <h1>Chat Monitoring</h1>

          <p>Monitor conversations across ShopDirect.</p>
        </div>

        <button
          type="button"
          className="sa-chat-refresh-btn"
          onClick={handleRefresh}
        >
          <RefreshCw size={17} />
          <span>Refresh</span>
        </button>
      </header>

      {/* ================================
          SUMMARY
      ================================= */}
      <div className="sa-chat-summary-grid">
        <article className="sa-chat-summary-card">
          <div className="sa-chat-summary-icon">
            <Users size={20} />
          </div>

          <div className="sa-chat-summary-content">
            <span>Active Users</span>
            <strong>{monitoringUsers.length}</strong>
          </div>
        </article>

        <article className="sa-chat-summary-card">
          <div className="sa-chat-summary-icon">
            <MessagesSquare size={20} />
          </div>

          <div className="sa-chat-summary-content">
            <span>Conversations</span>
            <strong>{totalConversations}</strong>
          </div>
        </article>

        <article className="sa-chat-summary-card">
          <div className="sa-chat-summary-icon">
            <Flag size={20} />
          </div>

          <div className="sa-chat-summary-content">
            <span>Unread / Flagged</span>
            <strong>{unreadFlaggedCount}</strong>
          </div>
        </article>
      </div>

      {/* ================================
          MONITORING WORKSPACE
      ================================= */}
      <div className="sa-chat-workspace">
        {/* ================================
            USERS
        ================================= */}
        <aside className="sa-chat-panel sa-chat-users-panel">
          <div className="sa-chat-panel-header">
            <div>
              <h2>Users</h2>
              <p>Select a user to inspect activity</p>
            </div>

            <span className="sa-chat-count-badge">
              {monitoringUsers.length}
            </span>
          </div>

          <div className="sa-chat-search-wrapper">
            <Search size={17} />

            <input
              id="chat-user-search"
              name="chatUserSearch"
              type="search"
              autoComplete="off"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="sa-chat-scroll-area">
            {filteredUsers.length === 0 ? (
              <div className="sa-chat-list-empty">
                <Users size={28} />

                <strong>No users found</strong>

                <span>
                  Users will appear here when monitoring data is available.
                </span>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedUserId === user.id;

                return (
                  <button
                    type="button"
                    key={user.id}
                    className={`sa-chat-user-row ${
                      isSelected ? "sa-chat-row-selected" : ""
                    }`}
                    onClick={() => handleUserSelect(user.id)}
                  >
                    <div className="sa-chat-avatar">
                      {getInitials(user.name)}
                    </div>

                    <div className="sa-chat-user-info">
                      <div className="sa-chat-user-name-row">
                        <strong>{user.name}</strong>

                        <span className={getRoleClass(user.role)}>
                          {user.role}
                        </span>
                      </div>

                      <span className="sa-chat-user-email">
                        {user.email}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ================================
            CONVERSATIONS
        ================================= */}
        <section className="sa-chat-panel sa-chat-conversations-panel">
          <div className="sa-chat-panel-header">
            <div>
              <h2>Conversations</h2>

              <p>
                {selectedUser
                  ? `Chats involving ${selectedUser.name}`
                  : "Conversation activity"}
              </p>
            </div>

            <span className="sa-chat-count-badge">
              {conversations.length}
            </span>
          </div>

          <div className="sa-chat-scroll-area">
            {!selectedUser ? (
              <div className="sa-chat-empty-state">
                <div className="sa-chat-empty-icon">
                  <MessageCircle size={28} />
                </div>

                <strong>Select a user</strong>

                <p>Select a user to view their conversations.</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="sa-chat-empty-state">
                <div className="sa-chat-empty-icon">
                  <MessageCircle size={28} />
                </div>

                <strong>No conversations</strong>

                <p>This user does not have any conversations yet.</p>
              </div>
            ) : (
              conversations.map((conversation) => {
                const isSelected =
                  selectedConversationId === conversation.id;

                return (
                  <button
                    type="button"
                    key={conversation.id}
                    className={`sa-chat-conversation-row ${
                      isSelected ? "sa-chat-row-selected" : ""
                    }`}
                    onClick={() =>
                      handleConversationSelect(conversation.id)
                    }
                  >
                    <div className="sa-chat-conversation-top">
                      <strong>{conversation.participant}</strong>

                      <span>{conversation.time}</span>
                    </div>

                    <p>{conversation.lastMessage}</p>

                    <div className="sa-chat-conversation-bottom">
                      <span
                        className={getRoleClass(conversation.role)}
                      >
                        {conversation.role}
                      </span>

                      {Number(conversation.unread) > 0 && (
                        <span className="sa-chat-unread-badge">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* ================================
            MESSAGES
        ================================= */}
        <section className="sa-chat-panel sa-chat-messages-panel">
          {!selectedConversation ? (
            <div className="sa-chat-message-empty">
              <div className="sa-chat-empty-icon">
                <Eye size={30} />
              </div>

              <strong>Select a conversation</strong>

              <p>Select a conversation to view messages.</p>
            </div>
          ) : (
            <>
              <div className="sa-chat-message-header">
                <div>
                  <h2>{selectedConversation.participant}</h2>

                  <div className="sa-chat-message-meta">
                    <span
                      className={getRoleClass(
                        selectedConversation.role
                      )}
                    >
                      {selectedConversation.role}
                    </span>

                    <span>
                      Conversation with {selectedUser?.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="sa-chat-message-thread">
                {selectedConversation.messages?.length ? (
                  selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`sa-chat-message-row ${
                        message.direction === "outgoing"
                          ? "sa-chat-message-row--outgoing"
                          : "sa-chat-message-row--incoming"
                      }`}
                    >
                      <div className="sa-chat-message-bubble">
                        <p>{message.text}</p>
                        <span>{message.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="sa-chat-empty-state">
                    <div className="sa-chat-empty-icon">
                      <MessagesSquare size={26} />
                    </div>

                    <strong>No messages</strong>

                    <p>No messages are available in this conversation.</p>
                  </div>
                )}
              </div>

              <div className="sa-chat-readonly-notice">
                <Eye size={16} />

                <span>Read-only Super Admin monitoring view</span>
              </div>
            </>
          )}
        </section>
      </div>
    </section>
  );
}

export default SuperAdminChatMonitoring;