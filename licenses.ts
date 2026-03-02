export type LicenseType = "BASIC" | "PREMIUM" | "UNLIMITED";

export const licensePresets: Record<
  LicenseType,
  { name: string; deliverables: string[]; usageLimits: Record<string, string | number> }
> = {
  BASIC: {
    name: "Basic License",
    deliverables: ["MP3"],
    usageLimits: { streams: 50000, musicVideos: 1, radioStations: 0, livePerformances: 5 },
  },
  PREMIUM: {
    name: "Premium License",
    deliverables: ["MP3", "WAV"],
    usageLimits: { streams: 250000, musicVideos: 1, radioStations: 2, livePerformances: 20 },
  },
  UNLIMITED: {
    name: "Unlimited License",
    deliverables: ["MP3", "WAV", "STEMS"],
    usageLimits: {
      streams: "Unlimited",
      musicVideos: "Unlimited",
      radioStations: "Unlimited",
      livePerformances: "Unlimited",
    },
  },
};
