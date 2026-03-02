export type Track = {
  id: string; // your real track ID (e.g. T10036)
  title: string;
  bpm: number;
  key: string;
  genre: string;
  mood: string;
  audioUrl: string;
};

export type Product = {
  id: string;
  title: string;
  category: "Sound Kit" | "Merch";
  priceRwf: number;
  description: string;
  imageUrl?: string;
};

export const tracks: Track[] = [
  {
    id: "T10036",
    title: "Beat One (Demo)",
    bpm: 98,
    key: "F#m",
    genre: "Afroswing",
    mood: "Vibey",
    audioUrl: "/audio/demo-1.mp3",
  },
  {
    id: "T20037",
    title: "Beat Two (Demo)",
    bpm: 124,
    key: "Am",
    genre: "Afrobeat",
    mood: "Happy",
    audioUrl: "/audio/demo-2.mp3",
  },
];

export const soundKits: Product[] = [
  {
    id: "SK1001",
    title: "Afro Drums Vol. 1",
    category: "Sound Kit",
    priceRwf: 10000,
    description: "Punchy afro drum loops + one-shots. Royalty-free.",
    imageUrl: "/products/kit-1.jpg",
  },
];

export const merch: Product[] = [
  {
    id: "M1001",
    title: "YeweBeatz Hoodie (Black)",
    category: "Merch",
    priceRwf: 25000,
    description: "Premium cotton hoodie. Unisex.",
    imageUrl: "/products/merch-1.jpg",
  },
];

export const collections = [
  { id: "c1", title: "Afro Vibes", count: 12 },
  { id: "c2", title: "Drill Energy", count: 8 },
  { id: "c3", title: "Love & RnB", count: 10 },
];

export const membershipPlans = [
  { id: "p1", name: "Starter", priceMonthlyRwf: 5000, perks: ["5 downloads / month", "Priority support"] },
  { id: "p2", name: "Pro", priceMonthlyRwf: 15000, perks: ["15 downloads / month", "Member-only drops"] },
  { id: "p3", name: "Unlimited", priceMonthlyRwf: 30000, perks: ["Unlimited downloads", "Early access + discounts"] },
];
