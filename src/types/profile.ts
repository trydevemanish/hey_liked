export type Profile = {
  id: number;
  name: string;
  age: number;
  photo: string;
  shortBio: string;
  city: string;
  interests: string[];
};

export type SwipeAction = "like" | "pass";
