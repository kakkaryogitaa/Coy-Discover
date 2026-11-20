
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, X, Loader2, RefreshCw } from "lucide-react";

import ProfileCard, {
  type Profile,
  type ProfileCardHandle,
} from "@/components/ProfileCard";

import MatchModal from "@/components/MatchModal";

interface DiscoverProps {
  onOpenChat: (profile: Profile) => void;
}

export default function Discover({ onOpenChat }: DiscoverProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [error, setError] = useState("");
  const [match, setMatch] = useState<Profile | null>(null);

  const cardRef = useRef<ProfileCardHandle>(null);
  const swipeLock = useRef(false);

  // FETCH PROFILES
  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/feed", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profiles.");
      }

      const data = await response.json();

      const profileList = Array.isArray(data)
        ? data
        : data.profiles || data.users || [];

      const formattedProfiles: Profile[] = profileList.map(
        (item: any) => ({
          ...item,
          photo:
            item.photo ||
            item.image ||
            item.imageUrl ||
            "/placeholder-profile.png",
        })
      );

      setProfiles(formattedProfiles);
    } catch (err) {
      console.error("Feed error:", err);
      setError("Unable to load profiles. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // HANDLE SWIPE
  const handleSwipe = async (
    profile: Profile,
    action: "LIKE" | "PASS"
  ) => {
    if (swipeLock.current) return;

    swipeLock.current = true;
    setSwiping(true);
    setError("");

    try {
      const response = await fetch("/api/swipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId: profile.id,
          action,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save swipe.");
      }

      const result = await response.json();

      // Remove current profile
      setProfiles((previous) =>
        previous.filter((item) => item.id !== profile.id)
      );

      // Open match popup
      if (action === "LIKE" && result.matched) {
        setMatch(profile);
      }
    } catch (err) {
      console.error("Swipe error:", err);
      setError("Swipe failed. Please try again.");

      await fetchProfiles();
    } finally {
      swipeLock.current = false;
      setSwiping(false);
    }
  };

  // BUTTON SWIPE
  const handleButtonSwipe = (action: "LIKE" | "PASS") => {
    if (swipeLock.current || !profiles.length) return;

    cardRef.current?.swipe(action);
  };

  // LOADING
  if (loading) {
    return (
      <section className="flex min-h-[75vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
        <p className="text-sm text-gray-500">
          Finding your connections...
        </p>
      </section>
    );
  }

  // ERROR
  if (error && profiles.length === 0) {
    return (
      <section className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
        <Heart size={40} className="text-pink-500" />

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Something went wrong
        </h2>

        <p className="mt-2 text-sm text-gray-500">{error}</p>

        <button
          onClick={fetchProfiles}
          className="mt-6 flex items-center gap-2 rounded-full bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-700"
        >
          <RefreshCw size={17} />
          Try Again
        </button>
      </section>
    );
  }

  const currentProfile = profiles[0];

  return (
    <section className="mx-auto flex min-h-[75vh] w-full max-w-xl flex-col items-center px-4 pb-28 pt-6">

      {/* HEADING */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-black text-gray-900">
          Discover <span className="text-pink-600">people.</span>
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Find someone who matches your vibe 💗
        </p>
      </div>

      {currentProfile ? (
        <>
          {/* PROFILE CARD */}
          <div className="relative aspect-[3/4] min-h-[400px] max-h-[650px] w-full max-w-md">

            <ProfileCard
              key={currentProfile.id}
              ref={cardRef}
              profile={currentProfile}
              onSwipe={(action) =>
                handleSwipe(currentProfile, action)
              }
            />

          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-7 flex items-center justify-center gap-8">

            {/* LIKE - LEFT */}
            <button
              type="button"
              disabled={swiping}
              onClick={() => handleButtonSwipe("LIKE")}
              aria-label="Like profile"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-600 text-white shadow-lg shadow-pink-200 transition hover:scale-110 hover:bg-pink-700 active:scale-95 disabled:opacity-40"
            >
              <Heart size={29} fill="currentColor" />
            </button>

            {/* PASS - RIGHT */}
            <button
              type="button"
              disabled={swiping}
              onClick={() => handleButtonSwipe("PASS")}
              aria-label="Pass profile"
              className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white text-red-500 shadow-md transition hover:scale-110 hover:bg-red-50 active:scale-95 disabled:opacity-40"
            >
              <X size={32} strokeWidth={2.5} />
            </button>

          </div>

          {error && (
            <p className="mt-4 text-sm text-red-500">
              {error}
            </p>
          )}

          <p className="mt-5 text-xs text-gray-400">
            Swipe right to like · Swipe left to pass
          </p>

          <p className="mt-2 text-xs text-gray-400">
            {profiles.length} profiles remaining
          </p>
        </>
      ) : (
        /* EMPTY STATE */
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-3xl border border-pink-100 bg-white px-6 text-center shadow-sm">

          <Heart
            size={45}
            className="text-pink-500"
            fill="#fce7f3"
          />

          <h3 className="mt-5 text-2xl font-bold text-gray-900">
            You've seen everyone! 💕
          </h3>

          <p className="mt-3 text-sm text-gray-500">
            You've reached the end of your discover feed.
          </p>

          <button
            onClick={fetchProfiles}
            className="mt-7 flex items-center gap-2 rounded-full bg-pink-600 px-7 py-3 font-semibold text-white hover:bg-pink-700"
          >
            <RefreshCw size={17} />
            Refresh Profiles
          </button>

        </div>
      )}

      {/* MATCH MODAL */}
      {match && (
        <MatchModal
          profile={match}
          onClose={() => setMatch(null)}
          onChat={(profile) => {
            setMatch(null);
            onOpenChat(profile);
          }}
        />
      )}

    </section>
  );
}
