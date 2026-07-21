import React from "react";
import { Search, CalendarDays, ShieldCheck, UserCheck, MessageSquare } from "lucide-react";

export default function BottomNav({ activeTab, setActiveTab, language }) {
  const tabs = [
    {
      id: "explore",
      icon: Search,
      label: {
        am: "ተከራይ",
        en: "Renter"
      }
    },
    {
      id: "bookings",
      icon: CalendarDays,
      label: {
        am: "ትዕዛዞች",
        en: "Bookings"
      }
    },
    {
      id: "inbox",
      icon: MessageSquare,
      label: {
        am: "መልዕክት",
        en: "Inbox"
      }
    },
    {
      id: "host",
      icon: UserCheck,
      label: {
        am: "አስተናጋጅ",
        en: "Host"
      }
    }
  ];

  return (
    <nav
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "var(--nav-height)",
        backgroundColor: "var(--bg-white)",
        borderTop: "1px solid var(--border-color)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 100,
        boxShadow: "0 -2px 10px rgba(44, 37, 32, 0.05)",
        paddingBottom: "env(safe-area-inset-bottom)"
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`btn-nav-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              flex: 1,
              height: "100%",
              cursor: "pointer",
              color: isActive ? "var(--terracotta)" : "var(--text-muted)",
              transition: "color 0.2s ease"
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px 16px",
                borderRadius: "16px",
                backgroundColor: isActive ? "rgba(211, 84, 0, 0.08)" : "transparent",
                transition: "background-color 0.2s ease"
              }}
            >
              <Icon size={20} style={{ strokeWidth: isActive ? 2.5 : 2 }} />
            </div>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: isActive ? "700" : "500"
              }}
            >
              {language === "am" ? tab.label.am : tab.label.en}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
