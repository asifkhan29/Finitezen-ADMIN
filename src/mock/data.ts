export type HRRole = "Normal HR" | "Pro HR" | "Elite HR";
// The exact codes your Spring Boot backend sends and expects
export type Country = "US" | "CA" | "IN" | "AE" | "SA" | "GB";

export const COUNTRY_FLAG: Record<Country, string> = {
  US: "🇺🇸",
  CA: "🇨🇦",
  IN: "🇮🇳",
  AE: "🇦🇪",
  SA: "🇸🇦",
  GB: "🇬🇧",
};

export const COUNTRY_NAME: Record<Country, string> = {
  US: "USA",
  CA: "Canada",
  IN: "India",
  AE: "UAE",
  SA: "Saudi Arabia",
  GB: "UK",
};

