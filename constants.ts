
export const APP_NAME = "Did You Eat?";
export const APP_VERSION = "1.1.0";
export const SUPPORT_EMAIL = "boosad.96.abhi@gmail.com"; 
export const STORAGE_KEY = "did_you_eat_app_data";
export const MISSING_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 Hours
export const SMS_TEXT = "No meal confirmation today. Please check on them.";

/**
 * Embedded SVG Logo - Matches user's provided branding (Bowl + Heart + Check)
 * Using a Data URI to ensure it never fails to fetch.
 */
export const APP_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%23a7c49e"/><stop offset="100%" style="stop-color:%2386a87d"/></linearGradient></defs><path d="M20 35c0 20 15 35 30 35s30-15 30-35H20z" fill="url(%23b)"/><path d="M38 52c0-8 12-8 12 0 0-8 12-8 12 0 0 6-12 14-12 14s-12-8-12-14z" fill="%23d8e6d4"/><path d="M43 55l5 5 10-10" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const DEFAULT_SETTINGS = {
  isSetupComplete: false,
  breakfastTime: "08:00",
  lunchTime: "12:30",
  dinnerTime: "19:00",
  contactName: "",
  contactPhone: ""
};
