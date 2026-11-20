
import { PrismaClient } from "@prisma/client";
import { DEMO_USER_ID } from "../src/lib/demo-user";

const prisma = new PrismaClient();

const profiles = [
  ["Aarohi", 22, "Coffee lover, weekend explorer and playlist curator.", "Delhi", ["Travel", "Music", "Photography"]],
  ["Riya", 21, "Finding beauty in little everyday things.", "Noida", ["Art", "Books", "Dance"]],
  ["Ananya", 23, "Foodie with a serious travel addiction.", "Gurgaon", ["Food", "Travel", "Movies"]],
  ["Ishita", 22, "Bookstores, sunsets and meaningful conversations.", "Delhi", ["Reading", "Coffee", "Writing"]],
  ["Mehak", 21, "Always planning my next adventure.", "Jaipur", ["Travel", "Fitness", "Music"]],
  ["Kavya", 24, "Designer by day, dreamer by night.", "Delhi", ["Design", "Art", "Fashion"]],
  ["Sana", 22, "Here for good music and better company.", "Mumbai", ["Music", "Dance", "Food"]],
  ["Aditi", 23, "A little introverted, a lot curious.", "Pune", ["Books", "Nature", "Movies"]],
  ["Myra", 21, "Collecting memories, not things.", "Bangalore", ["Photography", "Travel", "Art"]],
  ["Naina", 24, "Gym, coffee, repeat.", "Delhi", ["Fitness", "Food", "Music"]],
  ["Kiara", 22, "Life is better with spontaneous plans.", "Chandigarh", ["Travel", "Movies", "Dance"]],
  ["Tanya", 23, "Professional overthinker and amateur chef.", "Noida", ["Cooking", "Books", "Coffee"]],
  ["Simran", 21, "Sunshine mixed with a little sarcasm.", "Delhi", ["Fashion", "Music", "Travel"]],
  ["Diya", 22, "Making ordinary days memorable.", "Mumbai", ["Art", "Photography", "Food"]],
  ["Pihu", 23, "Adventure is my favourite word.", "Jaipur", ["Nature", "Travel", "Fitness"]],
  ["Sakshi", 24, "A podcast and coffee enthusiast.", "Gurgaon", ["Podcasts", "Reading", "Music"]],
  ["Tara", 21, "Dancing through life.", "Delhi", ["Dance", "Movies", "Fashion"]],
  ["Mira", 22, "Quiet evenings and loud concerts.", "Pune", ["Music", "Books", "Travel"]],
  ["Avni", 23, "Trying new things every week.", "Bangalore", ["Food", "Fitness", "Art"]],
  ["Shreya", 22, "Your future favourite travel buddy.", "Delhi", ["Travel", "Photography", "Nature"]],
  ["Reyansh", 23, "Building things and chasing sunsets.", "Delhi", ["Technology", "Travel", "Cricket"]],
  ["Arjun", 24, "Football, fitness and good coffee.", "Noida", ["Football", "Fitness", "Music"]],
  ["Kabir", 22, "Music is basically my personality.", "Gurgaon", ["Music", "Movies", "Gaming"]],
  ["Vihaan", 23, "Always up for a road trip.", "Delhi", ["Travel", "Cars", "Photography"]],
  ["Aditya", 21, "Tech enthusiast and amateur chef.", "Pune", ["Technology", "Cooking", "Books"]],
  ["Rohan", 24, "Finding new cafés around the city.", "Mumbai", ["Coffee", "Food", "Photography"]],
  ["Ishaan", 22, "Cricket on weekends, coding on weekdays.", "Delhi", ["Cricket", "Technology", "Fitness"]],
  ["Dev", 23, "A fan of mountains and minimalism.", "Chandigarh", ["Nature", "Travel", "Reading"]],
  ["Aarav", 21, "Movies, memes and midnight conversations.", "Noida", ["Movies", "Gaming", "Music"]],
  ["Kunal", 24, "Exploring the world one city at a time.", "Jaipur", ["Travel", "Food", "Fitness"]],
  ["Dhruv", 22, "Photographer with a traveller's soul.", "Delhi", ["Photography", "Art", "Travel"]],
  ["Neil", 23, "Trying to make every day count.", "Bangalore", ["Fitness", "Music", "Books"]],
  ["Yash", 22, "Sports, street food and spontaneity.", "Mumbai", ["Sports", "Food", "Travel"]],
  ["Manav", 24, "Curious about everything.", "Delhi", ["Technology", "Reading", "Movies"]],
  ["Krish", 21, "Weekend explorer and aspiring musician.", "Gurgaon", ["Music", "Travel", "Gaming"]],
  ["Rudra", 23, "Less scrolling, more living.", "Pune", ["Nature", "Fitness", "Photography"]],
] as const;

// These profiles have already liked the demo user.
const profilesWhoLikedDemoUser = [
  "Aarohi",
  "Riya",
  "Reyansh",
  "Kabir",
  "Aarav",
];

async function main() {
  console.log("Starting Coy Discover seed...");

  let created = 0;
  let updated = 0;

  // Seed all 36 profiles.
  for (let i = 0; i < profiles.length; i++) {
    const [name, age, bio, city, interests] = profiles[i];

    const isFemale = i < 20;
    const gender = isFemale ? "women" : "men";
    const photoNumber = isFemale ? i + 1 : i - 19;

    const photo = `https://randomuser.me/api/portraits/${gender}/${photoNumber}.jpg`;

    const existingProfile = await prisma.profile.findFirst({
      where: { name },
    });

    if (existingProfile) {
      await prisma.profile.update({
        where: { id: existingProfile.id },
        data: {
          age,
          bio,
          city,
          interests: JSON.stringify(interests),
          photo,
        },
      });

      updated++;
      console.log(`Updated: ${name}`);
    } else {
      await prisma.profile.create({
        data: {
          name,
          age,
          bio,
          city,
          interests: JSON.stringify(interests),
          photo,
        },
      });

      created++;
      console.log(`Created: ${name}`);
    }
  }

  // Seed incoming likes for mutual-match demonstrations.
  console.log("\nSeeding incoming likes...");

  for (const name of profilesWhoLikedDemoUser) {
    const profile = await prisma.profile.findFirst({
      where: { name },
    });

    if (!profile) {
      console.warn(`Profile not found: ${name}`);
      continue;
    }

    await prisma.incomingLike.upsert({
      where: {
        userId_profileId: {
          userId: DEMO_USER_ID,
          profileId: profile.id,
        },
      },
      update: {},
      create: {
        userId: DEMO_USER_ID,
        profileId: profile.id,
      },
    });

    console.log(`${name} has liked the demo user.`);
  }

  const totalProfiles = await prisma.profile.count();
  const totalIncomingLikes = await prisma.incomingLike.count({
    where: { userId: DEMO_USER_ID },
  });

  console.log("\n================================");
  console.log("COY SEED COMPLETED SUCCESSFULLY");
  console.log("================================");
  console.log(`Created profiles: ${created}`);
  console.log(`Updated profiles: ${updated}`);
  console.log(`Total profiles in database: ${totalProfiles}`);
  console.log(`Incoming likes for demo user: ${totalIncomingLikes}`);
  console.log("Existing swipes preserved.");
  console.log("================================");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
