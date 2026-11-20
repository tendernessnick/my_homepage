/* ==========================================================================
   Single Maintainable Service Configuration
   Mirrors materials/service-config.json.
   When TAXI_TABLEAU_URL is populated with a valid http(s):// URL,
   all CN/EN NYC Taxi showcase entries automatically upgrade to live links.
   ========================================================================== */

export const SERVICE_CONFIG = Object.freeze({
  DEHAZE_DEMO_URL: "https://dehaze-demo2-312215-10-1477032709.sh.run.tcloudbase.com",
  WEATHER_APP_URL: "https://weather-helper-312215-10-1477032709.sh.run.tcloudbase.com/",
  DATAHELPER_DEMO_URL: "https://data-helper1-312215-10-1477032709.sh.run.tcloudbase.com/",
  TAXI_TABLEAU_URL: "",
  DEHAZE_API_BASE: "http://localhost:8000",
  SAMPLE_IMAGE: "assets/sample_hazy.jpg"
});

/**
 * Returns a normalized http(s) URL string or empty string if blank/invalid.
 */
export function resolveServiceUrl(key) {
  const raw = SERVICE_CONFIG[key];
  if (typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
  } catch {
    return "";
  }
  return "";
}
