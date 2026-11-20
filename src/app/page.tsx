"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import Discover from "@/components/Discover";
import Matches from "@/components/Matches";
import Chat from "@/components/Chat";

import type { Profile } from "@/components/ProfileCard";

type Tab = "home" | "discover" | "matches";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [chatProfile, setChatProfile] = useState<Profile | null>(null);

  const openChat = (profile: Profile) => {
    setChatProfile(profile);
  };

  const closeChat = () => {
    setChatProfile(null);
  };

  return (
    <main className="min-h-screen bg-[#fff9fc]">

      {!chatProfile && (
        <header className="border-b border-pink-100 bg-white px-5 py-4">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight text-pink-600">
              coy<span className="text-gray-900">.</span>
            </h1>

            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
              Discover connections
            </span>
          </div>
        </header>
      )}

      {activeTab === "home" && !chatProfile && (
        <section className="mx-auto max-w-2xl px-5 pb-28 pt-10">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-400 p-8 text-white shadow-xl shadow-pink-100">
            <p className="text-sm font-semibold tracking-widest text-pink-100">
              WELCOME TO COY
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight">
              Find your
              <br />
              kind of connection.
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-pink-50">
              Discover people, share interests, and find meaningful connections beyond just a swipe.
            </p>

            <button
              onClick={() => setActiveTab("discover")}
              className="mt-7 rounded-full bg-white px-6 py-3 font-bold text-pink-600 shadow-md transition hover:scale-105"
            >
              Start Discovering →
            </button>
          </div>

          <div className="mt-9">
            <p className="text-sm font-semibold text-pink-500">
              YOUR JOURNEY
            </p>

            <h3 className="mt-1 text-2xl font-black text-gray-900">
              A little more than a swipe.
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Explore profiles, discover shared interests, and meet someone who makes your day a little more interesting.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => setActiveTab("discover")}
              className="rounded-2xl border border-pink-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-2xl">
                💗
              </div>
              <h4 className="mt-4 font-bold text-gray-900">Discover</h4>
              <p className="mt-1 text-xs text-gray-500">
                Meet new people and explore profiles.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-pink-600">
                Explore →
              </span>
            </button>

            <button
              onClick={() => setActiveTab("matches")}
              className="rounded-2xl border border-pink-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-2xl">
                ✨
              </div>
              <h4 className="mt-4 font-bold text-gray-900">Matches</h4>
              <p className="mt-1 text-xs text-gray-500">
                See the people you&apos;ve connected with.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-pink-600">
                View matches →
              </span>
            </button>
          </div>

          <div className="mt-8 rounded-3xl border border-pink-100 bg-white p-6">
            <h3 className="text-lg font-bold text-gray-900">
              How Coy works
            </h3>

            <div className="mt-5 space-y-5">
              {[
                ["👀", "Discover people", "Browse profiles and find people who share your interests."],
                ["💌", "Express interest", "Like someone you would love to get to know."],
                ["💕", "Make a connection", "When the interest is mutual, it's a match!"],
              ].map(([emoji, title, description]) => (
                <div key={title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-50 text-lg">
                    {emoji}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{title}</h4>
                    <p className="mt-1 text-sm text-gray-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Your next connection could be one swipe away.
            </p>
            <button
              onClick={() => setActiveTab("discover")}
              className="mt-4 rounded-full bg-pink-600 px-8 py-3 font-bold text-white shadow-lg shadow-pink-200"
            >
              Explore profiles
            </button>
          </div>
        </section>
      )}

      {activeTab === "discover" && !chatProfile && (
        <Discover onOpenChat={openChat} />
      )}

      {activeTab === "matches" && !chatProfile && (
        <Matches onOpenChat={openChat} />
      )}

      {chatProfile && (
        <Chat profile={chatProfile} onBack={closeChat} />
      )}

      {!chatProfile && (
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

    </main>
  );
}
