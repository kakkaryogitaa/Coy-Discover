
"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef
} from "react";

import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  PanInfo
} from "framer-motion";

import { Heart, X, MapPin } from "lucide-react";

export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  city: string;
  interests: string[] | string;
}

export interface ProfileCardHandle {
  swipe: (action: "LIKE" | "PASS") => Promise<void>;
}

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (action: "LIKE" | "PASS") => void | Promise<void>;
}

const ProfileCard = forwardRef<ProfileCardHandle, ProfileCardProps>(
  function ProfileCard({ profile, onSwipe }, ref) {

    const x = useMotionValue(0);
    const controls = useAnimation();
    const isAnimating = useRef(false);

    const rotate = useTransform(x, [-250, 250], [-20, 20]);

    const likeOpacity = useTransform(
      x,
      [0, 100],
      [0, 1]
    );

    const passOpacity = useTransform(
      x,
      [-100, 0],
      [1, 0]
    );

    // Handle interests safely
    const interests = Array.isArray(profile.interests)
      ? profile.interests
      : typeof profile.interests === "string"
        ? profile.interests
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

    // Main swipe animation
    const performSwipe = async (
      action: "LIKE" | "PASS"
    ) => {
      if (isAnimating.current) return;

      isAnimating.current = true;

      const direction = action === "LIKE" ? 1 : -1;

      await controls.start({
        x: direction * 700,
        opacity: 0,
        rotate: direction * 25,
        transition: {
          duration: 0.35,
          ease: "easeOut"
        }
      });

      await onSwipe(action);
    };

    // Expose swipe function to Discover buttons
    useImperativeHandle(ref, () => ({
      swipe: performSwipe
    }));

    // Handle touch and mouse dragging
    const handleDragEnd = async (
      _: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo
    ) => {
      if (isAnimating.current) return;

      if (
        info.offset.x > 110 ||
        info.velocity.x > 650
      ) {
        await performSwipe("LIKE");
      } else if (
        info.offset.x < -110 ||
        info.velocity.x < -650
      ) {
        await performSwipe("PASS");
      } else {
        await controls.start({
          x: 0,
          rotate: 0,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 25
          }
        });
      }
    };

    return (
      <motion.div
        animate={controls}
        className="absolute inset-0 cursor-grab overflow-hidden rounded-3xl bg-white shadow-2xl active:cursor-grabbing"
        style={{
          x,
          rotate,
          touchAction: "pan-y"
        }}
        drag="x"
        dragConstraints={{
          left: 0,
          right: 0
        }}
        dragElastic={0.75}
        onDragEnd={handleDragEnd}
        whileTap={{
          scale: 1.015
        }}
      >
        <div className="relative h-full w-full">

          {/* Profile Photo */}
          <img
            src={profile.photo}
            alt={profile.name}
            draggable={false}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src =
                "/placeholder-profile.png";
            }}
          />

          {/* Gradient Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

          {/* LIKE Indicator */}
          <motion.div
            style={{
              opacity: likeOpacity
            }}
            className="absolute left-6 top-10 rotate-[-15deg] rounded-xl border-4 border-green-400 px-5 py-2 text-3xl font-black text-green-400"
          >
            LIKE
            <Heart
              className="ml-2 inline"
              size={25}
            />
          </motion.div>

          {/* PASS Indicator */}
          <motion.div
            style={{
              opacity: passOpacity
            }}
            className="absolute right-6 top-10 rotate-[15deg] rounded-xl border-4 border-red-400 px-5 py-2 text-3xl font-black text-red-400"
          >
            NOPE
            <X
              className="ml-2 inline"
              size={25}
            />
          </motion.div>

          {/* Profile Details */}
          <div className="pointer-events-none absolute bottom-0 w-full space-y-4 p-6 text-white">

            <div>
              <h2 className="text-4xl font-bold">
                {profile.name}, {profile.age}
              </h2>

              <p className="mt-2 flex items-center gap-2 text-sm text-white/90">
                <MapPin size={16} />
                {profile.city}
              </p>
            </div>

            <p className="text-sm leading-relaxed text-white/90">
              {profile.bio}
            </p>

            {/* Interests */}
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span
                  key={`${interest}-${index}`}
                  className="rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs backdrop-blur-md"
                >
                  {interest}
                </span>
              ))}
            </div>

          </div>
        </div>
      </motion.div>
    );
  }
);

ProfileCard.displayName = "ProfileCard";

export default ProfileCard;
