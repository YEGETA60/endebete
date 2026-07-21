import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, ArrowLeft, ShieldCheck, Phone } from "lucide-react";

const DEFAULT_MESSAGES = [
  {
    id: "msg-1",
    sender: "guest_me",
    receiver: "host_yohannes",
    text: "Hello Yohannes! I am planning a stay soon. Can you confirm if the backup generator handles the AC and boiler?",
    timestamp: "10:30 AM"
  },
  {
    id: "msg-2",
    sender: "host_yohannes",
    receiver: "guest_me",
    text: "ሰላም! Yes, our generator is a 50kVA silent unit that powers everything in the building, including the hot water boiler and ACs. You won't notice any power cuts.",
    timestamp: "10:32 AM"
  }
];

const HOST_BOT_ANSWERS = [
  {
    en: "Great! Let me know if you need any assistance with booking. CBE and Telebirr payouts are supported.",
    am: "በጣም ጥሩ! ቦታ ለመያዝ ምንም እገዛ ካስፈለገዎት ያሳውቁኝ። በንግድ ባንክ ወይም በቴሌብር ክፍያዎችን እንቀበላለን።"
  },
  {
    en: "Yes, the fiber internet is active (around 50Mbps) and has a backup UPS router. Perfect for remote work.",
    am: "አዎ! የፋይበር ኢንተርኔቱ ፈጣን ነው (50Mbps አካባቢ)፤ በተጨማሪም ለዋይፋዩ የባትሪ ዩፒኤስ (UPS) ስላለው መቆራረጥ የለበትም።"
  },
  {
    en: "You are welcome to check in anytime after 2 PM. Just give me a call when you are near Bole Medhanialem.",
    am: "ከቀኑ 8 ሰዓት በኋላ በማንኛውም ሰዓት መግባት ይችላሉ። ቦሌ መድኃኒዓለም አካባቢ ሲደርሱ በስልክ ይደውሉልኝ።"
  }
];

export default function Inbox({ language, user }) {
  const [messages, setMessages] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null); // null (list) or 'host_yohannes'
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // 1. Load messages on mount
  useEffect(() => {
    const saved = localStorage.getItem("eb_chat_messages");
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      localStorage.setItem("eb_chat_messages", JSON.stringify(DEFAULT_MESSAGES));
      setMessages(DEFAULT_MESSAGES);
    }
  }, []);

  // 2. Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedThread, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg = {
      id: "msg-" + Date.now(),
      sender: "guest_me",
      receiver: "host_yohannes",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem("eb_chat_messages", JSON.stringify(updated));
    setInputValue("");

    // Simulate Host Auto-Reply after 1.5 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      // Pick a response based on keywords or random
      const userText = inputValue.toLowerCase();
      let replyText = "";
      
      if (userText.includes("wifi") || userText.includes("internet") || userText.includes("ዋይፋይ") || userText.includes("ኢንተርኔት")) {
        replyText = HOST_BOT_ANSWERS[1][language];
      } else if (userText.includes("check") || userText.includes("time") || userText.includes("መቼ") || userText.includes("መግቢያ")) {
        replyText = HOST_BOT_ANSWERS[2][language];
      } else {
        replyText = HOST_BOT_ANSWERS[0][language];
      }

      const hostReply = {
        id: "msg-" + (Date.now() + 1),
        sender: "host_yohannes",
        receiver: "guest_me",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedWithReply = [...updated, hostReply];
      setMessages(updatedWithReply);
      localStorage.setItem("eb_chat_messages", JSON.stringify(updatedWithReply));
    }, 1500);
  };

  const filteredMessages = messages.filter(
    (m) => (m.sender === "guest_me" && m.receiver === "host_yohannes") || 
           (m.sender === "host_yohannes" && m.receiver === "guest_me")
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", fontFamily: "Outfit, sans-serif" }}>
      {!selectedThread ? (
        /* THREADS LIST VIEW */
        <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "16px", color: "var(--text-dark)" }}>
            {language === "am" ? "የመልዕክት ሳጥን" : "Messages"}
          </h2>

          <div
            onClick={() => setSelectedThread("host_yohannes")}
            className="card-premium"
            style={{
              backgroundColor: "var(--bg-white)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              padding: "14px",
              border: "1px solid var(--border-color)",
              transition: "transform 0.2s"
            }}
          >
            {/* Host Profile Initial Bubble */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "var(--terracotta)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "1.2rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}
            >
              ዮ
            </div>
            
            {/* Content Preview */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                  Yohannes (Bole Host)
                  <span
                    style={{
                      backgroundColor: "rgba(30, 130, 76, 0.1)",
                      color: "var(--ethiopian-green)",
                      padding: "1px 4px",
                      borderRadius: "4px",
                      fontSize: "0.55rem",
                      fontWeight: "700"
                    }}
                  >
                    Fayda ✓
                  </span>
                </span>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                  {filteredMessages.length > 0 ? filteredMessages[filteredMessages.length - 1].timestamp : ""}
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "240px"
                }}
              >
                {filteredMessages.length > 0 
                  ? filteredMessages[filteredMessages.length - 1].text 
                  : (language === "am" ? "ውይይት ጀምር..." : "Start chatting...")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* CHAT DIALOGUE VIEW */
        <div style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "var(--bg-cream)" }}>
          {/* Header */}
          <div
            style={{
              padding: "10px 16px",
              backgroundColor: "var(--bg-white)",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              zIndex: 10
            }}
          >
            <button
              onClick={() => setSelectedThread(null)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center"
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <strong style={{ fontSize: "0.9rem", color: "var(--text-dark)" }}>Yohannes</strong>
                <span
                  style={{
                    backgroundColor: "rgba(30, 130, 76, 0.1)",
                    color: "var(--ethiopian-green)",
                    padding: "1px 5px",
                    borderRadius: "4px",
                    fontSize: "0.55rem",
                    fontWeight: "700"
                  }}
                >
                  Verified Host
                </span>
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                {language === "am" ? "በአውቶማቲክ ጄነሬተር እና ውሃ ታንከር የታገዘ ቤት" : "Offers listing with full backup generators"}
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredMessages.map((msg) => {
              const isMe = msg.sender === "guest_me";
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isMe ? "flex-end" : "flex-start",
                    maxWidth: "75%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMe ? "flex-end" : "flex-start"
                  }}
                >
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: isMe ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                      backgroundColor: isMe ? "var(--terracotta)" : "var(--bg-white)",
                      color: isMe ? "#fff" : "var(--text-dark)",
                      fontSize: "0.82rem",
                      lineHeight: "1.4",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.04)",
                      border: isMe ? "none" : "1px solid var(--border-color)"
                    }}
                  >
                    {msg.text}
                  </div>
                  <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div style={{ alignSelf: "flex-start", display: "flex", gap: "4px", padding: "10px 14px", borderRadius: "14px", backgroundColor: "#fff", border: "1px solid var(--border-color)" }}>
                <span className="dot-typing" style={{ width: "6px", height: "6px", backgroundColor: "var(--text-muted)", borderRadius: "50%", display: "inline-block", animation: "ping 1s infinite" }}></span>
                <span className="dot-typing" style={{ width: "6px", height: "6px", backgroundColor: "var(--text-muted)", borderRadius: "50%", display: "inline-block", animation: "ping 1s infinite 0.2s" }}></span>
                <span className="dot-typing" style={{ width: "6px", height: "6px", backgroundColor: "var(--text-muted)", borderRadius: "50%", display: "inline-block", animation: "ping 1s infinite 0.4s" }}></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions suggestion */}
          <div style={{ padding: "8px 16px", backgroundColor: "rgba(0,0,0,0.02)", display: "flex", gap: "6px", overflowX: "auto", borderTop: "1px solid var(--border-color)" }}>
            <button
              onClick={() => setInputValue(language === "am" ? "ዋይፋይ ኢንተርኔት አለው?" : "Is the wifi internet working?")}
              style={{ padding: "6px 12px", border: "1px solid var(--border-color)", backgroundColor: "#fff", borderRadius: "20px", fontSize: "0.7rem", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              🌐 Wifi?
            </button>
            <button
              onClick={() => setInputValue(language === "am" ? "የመግቢያ ሰዓት መቼ ነው?" : "What is the check-in policy?")}
              style={{ padding: "6px 12px", border: "1px solid var(--border-color)", backgroundColor: "#fff", borderRadius: "20px", fontSize: "0.7rem", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              🔑 Check-in Time?
            </button>
            <button
              onClick={() => setInputValue(language === "am" ? "ክፍያውን CBE ማስተላለፍ እችላለሁ?" : "Can I pay using CBE bank transfer?")}
              style={{ padding: "6px 12px", border: "1px solid var(--border-color)", backgroundColor: "#fff", borderRadius: "20px", fontSize: "0.7rem", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              💳 CBE Transfer?
            </button>
          </div>

          {/* Form input */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: "10px 16px",
              backgroundColor: "var(--bg-white)",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              gap: "8px",
              alignItems: "center"
            }}
          >
            <input
              id="input-chat-message"
              type="text"
              className="form-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={language === "am" ? "መልዕክት ይጻፉ..." : "Type your message..."}
              style={{ margin: 0, borderRadius: "20px", height: "40px", fontSize: "0.82rem" }}
            />
            <button
              id="btn-chat-send"
              type="submit"
              className="btn-primary"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--terracotta)"
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
