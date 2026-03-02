export type LicenseType = "BASIC" | "PREMIUM" | "UNLIMITED";

export function deliverablesForLicense(licenseType: LicenseType) {
  if (licenseType === "BASIC") return ["MP3"] as const;
  if (licenseType === "PREMIUM") return ["MP3", "WAV"] as const;
  return ["MP3", "WAV", "STEMS"] as const;
}

export function beatFileKey(trackId: string, d: "MP3" | "WAV" | "STEMS") {
  if (d === "MP3") return `beats/${trackId}/mp3.mp3`;
  if (d === "WAV") return `beats/${trackId}/wav.wav`;
  return `beats/${trackId}/stems.zip`;
}

export function kitFileKey(kitId: string) {
  return `kits/${kitId}/download.zip`;
}
