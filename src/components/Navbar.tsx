
"use client";

import { Heart, Home, Compass } from "lucide-react";

type Tab = "home" | "discover" | "matches";

interface NavbarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
}: NavbarProps) {
  const tabs = [
    { id: "home" as Tab, label: "Home", icon: Home },
    { id: "discover" as Tab, label: "Discover", icon: Compass },
    { id: "matches" as Tab, label: "Matches", icon: Heart }
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-pink-100 bg-white/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-w-20 flex-col items-center gap-1 transition ${
                active
                  ? "text-pink-600"
                  : "text-gray-400 hover:text-pink-400"
              }`}
            >
              <Icon
                size={23}
                fill={active && tab.id === "matches" ? "currentColor" : "none"}
              />
              <span className="text-xs font-semibold">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
