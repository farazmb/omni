/**
 * OmniConvert - Global Configuration & Monetization Settings
 */
const APP_CONFIG = {
  appName: "OmniConvert",
  tagline: "Free Online File Format Converters & Developer Tools",
  domain: "omniconvert.com",
  siteUrl: window.location.origin,
  author: "OmniConvert Team",
  description: "Convert Images, Documents, Videos, Audio, and Data files online for free. 100% private, instant client-side processing with zero server uploads.",
  keywords: "file converter, image converter, HEIC to JPG, PDF to Word, MP4 to MP3, CSV to Excel, JSON to XML, video compressor, free online tools",
  
  // Monetization / Ad Configuration
  ads: {
    enabled: true, // Toggle ad banners
    adsenseClientId: "ca-pub-XXXXXXXXXXXXXXXX", // Set your Google AdSense Publisher ID here
    slots: {
      headerLeaderboard: "1234567890",
      inContent: "2345678901",
      sidebar: "3456789012",
      footerSticky: "4567890123"
    }
  },

  // Social & SEO
  social: {
    twitter: "@omniconvert",
    github: "https://github.com/omniconvert",
  }
};

window.APP_CONFIG = APP_CONFIG;
