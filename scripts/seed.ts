import { seedProfiles } from "../src/lib/seed";

const result = seedProfiles();

if (result.status === "seeded") {
  console.log(
    `Seeded ${result.profileCount} profiles: ${result.likedCount} have liked the demo user and ${result.dislikedCount} have passed.`,
  );
} else {
  console.log(
    `Seed skipped: the database already contains ${result.userCount} user(s).`,
  );
}
