
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Sparkles,
  X,
  MessageCircle,
  Star
} from "lucide-react";

import { Profile } from "./ProfileCard";

interface MatchModalProps {
  profile: Profile;
  onClose: () => void;
  onChat?: (profile: Profile) => void;
}

export default function MatchModal({
  profile,
  onClose,
  onChat
}: MatchModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/75 p-5 backdrop-blur-md"
        onClick={onClose}
      >
        {/* Floating hearts */}
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <motion.div
            key={item}
            initial={{
              y: 100,
              opacity: 0,
              scale: 0.5
            }}
            animate={{
              y: -300,
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.7],
              x: item % 2 === 0 ? 70 : -70
            }}
            transition={{
              duration: 3,
              delay: item * 0.3,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="pointer-events-none absolute bottom-0 left-1/2 text-pink-400"
          >
            <Heart
              size={item % 2 === 0 ? 30 : 20}
              fill="currentColor"
            />
          </motion.div>
        ))}

        {/* Modal */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.6,
            y: 50
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.8,
            y: 30
          }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 18
          }}
          onClick={(event) => event.stopPropagation()}
          className="relative w-full max-w-sm overflow-hidden rounded-[32px] bg-white text-center shadow-2xl"
        >
          {/* Pink gradient background */}
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close match"
            className="absolute right-4 top-4 z-20 rounded-full bg-white/70 p-2 text-gray-500 transition hover:bg-white hover:text-gray-900"
          >
            <X size={20} />
          </button>

          <div className="relative z-10 px-6 pb-7 pt-9">

            {/* Sparkles */}
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              className="mb-3 flex justify-center"
            >
              <Sparkles
                size={38}
                className="text-pink-500"
                fill="#fbcfe8"
              />
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring"
              }}
              className="text-4xl font-black tracking-tight text-pink-600"
            >
              It's a Match!
            </motion.h2>

            <p className="mt-3 text-sm text-gray-600">
              You and <span className="font-bold text-pink-600">{profile.name}</span> liked each other.
            </p>

            {/* Profile image */}
            <div className="relative mx-auto my-7 flex h-44 w-64 items-center justify-center">

              {/* Decorative glow */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
                className="absolute h-36 w-36 rounded-full bg-pink-300/40 blur-2xl"
              />

              {/* Current user's placeholder */}
              <div className="absolute left-3 z-10 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-gradient-to-br from-pink-400 to-purple-400 shadow-xl">
                <Heart
                  size={45}
                  fill="white"
                  className="text-white"
                />
              </div>

              {/* Matched profile */}
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute right-3 z-10 h-32 w-32 overflow-hidden rounded-full border-[5px] border-white shadow-xl"
              >
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src =
                      "/placeholder-profile.png";
                  }}
                />
              </motion.div>

              {/* Heart in center */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
                className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg"
              >
                <Heart
                  size={23}
                  fill="#ec4899"
                  className="text-pink-500"
                />
              </motion.div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <p className="font-semibold text-gray-800">
                Something beautiful starts here! 💗
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Don't keep them waiting. Say hello!
              </p>
            </div>

            {/* Let's Chat */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChat?.(profile)}
              disabled={!onChat}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 py-4 font-bold text-white shadow-lg shadow-pink-200 transition hover:from-pink-700 hover:to-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MessageCircle size={20} />
              Let's Chat
              <Heart size={17} fill="white" />
            </motion.button>

            {/* Continue discovering */}
            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full rounded-full py-3 text-sm font-semibold text-gray-500 transition hover:bg-pink-50 hover:text-pink-600"
            >
              Continue Discovering
            </button>

            <div className="mt-4 flex items-center justify-center gap-1 text-xs text-pink-400">
              <Star size={12} fill="currentColor" />
              Made with love on Coy
              <Heart size={12} fill="currentColor" />
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
