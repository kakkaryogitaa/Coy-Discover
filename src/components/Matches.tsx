"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2, MessageCircle } from "lucide-react";
import { Profile } from "./ProfileCard";

interface MatchesProps {
  onOpenChat: (profile: Profile) => void;
}

export default function Matches({ onOpenChat }: MatchesProps) {
  const [matches, setMatches] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMatches() {
      try {
        const response = await fetch("/api/matches", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load matches");
        }

        const data = await response.json();

        setMatches(Array.isArray(data) ? data : data.matches || []);
      } catch (err) {
        console.error("Matches error:", err);
        setError("Couldn't load your matches. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold tracking-[0.3em] text-pink-500">
          YOUR CONNECTIONS
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Your Matches
        </h1>
        <p className="mt-2 text-gray-500">
          People who caught your attention ❤️
        </p>
      </div>

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : matches.length === 0 ? (
        <div className="py-16 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-pink-300" />
          <h2 className="text-xl font-semibold text-gray-800">
            No matches yet
          </h2>
          <p className="mt-2 text-gray-500">
            Keep discovering people!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((profile) => {
            const interests = Array.isArray(profile.interests)
              ? profile.interests
              : typeof profile.interests === "string"
                ? profile.interests.split(",").map((item) => item.trim())
                : [];

            return (
              <div
                key={profile.id}
                className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm"
              >
                <div className="relative h-64">
                  <img
                    src={profile.photo || "/placeholder-profile.png"}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-900">
                    {profile.name}, {profile.age}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {profile.city}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {interests.slice(0, 3).map((interest, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-pink-50 px-3 py-1 text-xs text-pink-600"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onOpenChat(profile)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 py-3 font-semibold text-white transition hover:bg-pink-600"
                  >
                    <MessageCircle size={18} />
                    Let's Chat
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}