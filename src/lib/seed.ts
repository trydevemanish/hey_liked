import database from "@/lib/db";

type ProfileSeed = {
  name: string;
  age: number;
  shortBio: string;
  city: string;
  interests: string[];
};

const demoUserId = 1;

const profiles: ProfileSeed[] = [
  { name: "Aanya", age: 24, shortBio: "Always looking for a new coffee spot.", city: "Mumbai", interests: ["coffee", "design", "travel"] },
  { name: "Kabir", age: 27, shortBio: "Weekend hikes, weekday playlists.", city: "Pune", interests: ["hiking", "music", "food"] },
  { name: "Meera", age: 25, shortBio: "I take my book recommendations seriously.", city: "Bengaluru", interests: ["books", "art", "coffee"] },
  { name: "Arjun", age: 28, shortBio: "Trying to find the best biryani in town.", city: "Hyderabad", interests: ["food", "cricket", "movies"] },
  { name: "Ishita", age: 23, shortBio: "Usually planning my next little getaway.", city: "Delhi", interests: ["travel", "photography", "music"] },
  { name: "Rohan", age: 26, shortBio: "Runner, amateur cook, good listener.", city: "Jaipur", interests: ["running", "cooking", "movies"] },
  { name: "Tara", age: 24, shortBio: "Collecting plants and passport stamps.", city: "Chennai", interests: ["plants", "travel", "yoga"] },
  { name: "Vivaan", age: 29, shortBio: "Here for good conversation and better tacos.", city: "Mumbai", interests: ["food", "cycling", "films"] },
  { name: "Nisha", age: 26, shortBio: "Museum afternoons are my kind of plans.", city: "Kolkata", interests: ["art", "history", "books"] },
  { name: "Aditya", age: 25, shortBio: "Learning guitar one chord at a time.", city: "Bengaluru", interests: ["music", "technology", "coffee"] },
  { name: "Sana", age: 27, shortBio: "Big fan of slow mornings and long walks.", city: "Pune", interests: ["walking", "baking", "podcasts"] },
  { name: "Dev", age: 24, shortBio: "Can make a playlist for any occasion.", city: "Delhi", interests: ["music", "football", "travel"] },
  { name: "Kiara", age: 28, shortBio: "Dancing badly is still dancing.", city: "Goa", interests: ["dance", "beaches", "food"] },
  { name: "Neil", age: 26, shortBio: "A dog person who loves the outdoors.", city: "Chandigarh", interests: ["dogs", "hiking", "photography"] },
  { name: "Diya", age: 23, shortBio: "Trying every dessert on the menu.", city: "Ahmedabad", interests: ["desserts", "fashion", "movies"] },
  { name: "Aarav", age: 30, shortBio: "Architect by day, terrible comedian by night.", city: "Mumbai", interests: ["architecture", "comedy", "design"] },
  { name: "Mira", age: 25, shortBio: "I will absolutely stop to pet your dog.", city: "Hyderabad", interests: ["dogs", "books", "coffee"] },
  { name: "Yash", age: 27, shortBio: "Football, street food, repeat.", city: "Kolkata", interests: ["football", "food", "fitness"] },
  { name: "Anika", age: 24, shortBio: "Sunsets and spontaneous road trips.", city: "Jaipur", interests: ["travel", "photography", "music"] },
  { name: "Reyansh", age: 29, shortBio: "Building things and learning new recipes.", city: "Chennai", interests: ["technology", "cooking", "cycling"] },
  { name: "Myra", age: 26, shortBio: "Thrift stores are my happy place.", city: "Pune", interests: ["fashion", "art", "sustainability"] },
  { name: "Karan", age: 28, shortBio: "Early morning swims, late-night noodles.", city: "Goa", interests: ["swimming", "food", "travel"] },
  { name: "Riya", age: 25, shortBio: "Making time for more live music.", city: "Bengaluru", interests: ["music", "dance", "books"] },
  { name: "Samar", age: 24, shortBio: "I know a quiet place for chai.", city: "Delhi", interests: ["tea", "poetry", "cricket"] },
  { name: "Zoya", age: 27, shortBio: "Weekend pottery and weekday spreadsheets.", city: "Ahmedabad", interests: ["pottery", "design", "plants"] },
  { name: "Dhruv", age: 26, shortBio: "Happiest near the mountains.", city: "Chandigarh", interests: ["hiking", "camping", "photography"] },
  { name: "Pari", age: 23, shortBio: "Movie night is always a good idea.", city: "Mumbai", interests: ["movies", "cooking", "books"] },
  { name: "Veer", age: 30, shortBio: "Cycling around town and finding new cafes.", city: "Hyderabad", interests: ["cycling", "coffee", "technology"] },
  { name: "Avni", age: 25, shortBio: "A little bit of yoga, a lot of snacks.", city: "Kolkata", interests: ["yoga", "food", "travel"] },
  { name: "Ibrahim", age: 28, shortBio: "Always up for a quiz night.", city: "Jaipur", interests: ["trivia", "history", "football"] },
];

export type SeedResult =
  | {
      status: "seeded";
      profileCount: number;
      likedCount: number;
      dislikedCount: number;
    }
  | {
      status: "skipped";
      userCount: number;
    };

export function seedProfiles(): SeedResult {
  const seed = database.transaction((): SeedResult => {
    const { count } = database
      .prepare("SELECT COUNT(*) AS count FROM users")
      .get() as { count: number };

    if (count > 0) {
      return { status: "skipped", userCount: count };
    }

    const insertUser = database.prepare(`
      INSERT INTO users (id, name, age, photo, short_bio, city, interests)
      VALUES (@id, @name, @age, @photo, @shortBio, @city, @interests)
    `);

    insertUser.run({
      id: demoUserId,
      name: "Demo User",
      age: 28,
      photo: "/assets/demo-user.jpg",
      shortBio: "Your demo profile.",
      city: "Mumbai",
      interests: JSON.stringify(["coffee", "travel", "music"]),
    });

    const insertProfile = database.prepare(`
      INSERT INTO users (name, age, photo, short_bio, city, interests)
      VALUES (@name, @age, @photo, @shortBio, @city, @interests)
    `);

    const profileIds = profiles.map((profile, index) => {
      const photoNumber = String(index + 1).padStart(2, "0");
      const result = insertProfile.run({
        ...profile,
        photo: `/assets/profile-${photoNumber}.jpg`,
        interests: JSON.stringify(profile.interests),
      });

      return Number(result.lastInsertRowid);
    });

    const insertLike = database.prepare(
      "INSERT INTO liked (liked_by, liked_to) VALUES (?, ?)",
    );
    const insertDislike = database.prepare(
      "INSERT INTO disliked (disliked_by, disliked_to) VALUES (?, ?)",
    );

    for (const profileId of profileIds.slice(0, 4)) {
      insertLike.run(profileId, demoUserId);
    }

    for (const profileId of profileIds.slice(4, 6)) {
      insertDislike.run(profileId, demoUserId);
    }

    return {
      status: "seeded",
      profileCount: profiles.length,
      likedCount: 4,
      dislikedCount: 2,
    };
  });

  return seed();
}
