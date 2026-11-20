
"use client";

import { useState } from "react";
import { ArrowLeft, Send, Heart, MoreVertical } from "lucide-react";
import { Profile } from "./ProfileCard";

interface ChatProps {
  profile: Profile;
  onBack: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: "me" | "them";
  time: string;
}

export default function Chat({ profile, onBack }: ChatProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = () => {
    const trimmed = message.trim();

    if (!trimmed) return;

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        text: trimmed,
        sender: "me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      }
    ]);

    setMessage("");
  };

  return (
    <section className="fixed inset-0 z-[110] flex flex-col bg-[#fff9fc]">

      {/* Header */}
      <header className="flex items-center gap-3 border-b border-pink-100 bg-white px-4 py-4 shadow-sm">

        <button
          onClick={onBack}
          aria-label="Go back"
          className="rounded-full p-2 text-gray-700 hover:bg-pink-50"
        >
          <ArrowLeft size={23} />
        </button>

        <img
          src={profile.photo}
          alt={profile.name}
          className="h-11 w-11 rounded-full object-cover"
        />

        <div className="flex-1">
          <h2 className="font-bold text-gray-900">
            {profile.name}, {profile.age}
          </h2>
          <p className="text-xs text-green-500">
            Your new connection 💗
          </p>
        </div>

        <button
          aria-label="Chat options"
          className="rounded-full p-2 text-gray-500 hover:bg-pink-50"
        >
          <MoreVertical size={21} />
        </button>

      </header>

      {/* Conversation */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-6">

        <div className="my-4 text-center">
          <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full border-4 border-pink-100">
            <img
              src={profile.photo}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          </div>

          <h3 className="text-xl font-bold text-gray-900">
            You matched with {profile.name}! 💕
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Start a conversation and get to know each other.
          </p>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.sender === "me"
                  ? "rounded-br-sm bg-pink-600 text-white"
                  : "rounded-bl-sm border border-pink-100 bg-white text-gray-800"
              }`}
            >
              <p className="text-sm break-words">{msg.text}</p>
              <p className={`mt-1 text-right text-[10px] ${
                msg.sender === "me"
                  ? "text-pink-100"
                  : "text-gray-400"
              }`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="mt-5 text-center">
            <Heart
              size={22}
              className="mx-auto text-pink-400"
              fill="#f9a8d4"
            />
            <p className="mt-2 text-xs text-gray-400">
              Say hello to {profile.name}!
            </p>
          </div>
        )}

      </div>

      {/* Message Input */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
        className="flex items-center gap-3 border-t border-pink-100 bg-white px-4 py-4"
      >
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write a message..."
          className="min-w-0 flex-1 rounded-full bg-pink-50 px-5 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-pink-200"
        />

        <button
          type="submit"
          disabled={!message.trim()}
          aria-label="Send message"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-600 text-white shadow-lg transition hover:bg-pink-700 active:scale-95 disabled:opacity-40"
        >
          <Send size={19} />
        </button>
      </form>

    </section>
  );
}
