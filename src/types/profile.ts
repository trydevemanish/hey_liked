export type Profile = {
  id: number;
  name: string;
  age: number;
  photo: string;
  shortBio: string;
  city: string;
  interests: string[];
};

export type MatchProfile = Profile & {
  matchedAt: string;
};

export type SwipeAction = "like" | "pass";
