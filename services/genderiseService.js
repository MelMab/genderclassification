const genderizeAPI = require("../services/genderiseApi");


async function classify(name) {
  // ── 1. Fetch raw data from external API ──────────────────────────────────
  let raw;

  try {
    raw = await genderizeAPI.fetch(name);
  } catch (err) {
    // Translate API-layer errors into service result objects
    if (err.type === "upstream") {
      return { success: false, statusCode: 502, message: err.message };
    }
    if (err.type === "timeout") {
      return { success: false, statusCode: 504, message: err.message };
    }
    return {
      success: false,
      statusCode: 500,
      message: err.message || "Failed to fetch gender prediction",
    };
  }

  // ── 2. Handle Genderize edge cases ───────────────────────────────────────
  if (raw.gender === null || raw.count === 0) {
    return {
      success: false,
      statusCode: 422,
      message: "No prediction available for the provided name",
    };
  }

  // ── 3. Process and shape the data ────────────────────────────────────────
  const sample_size = raw.count; // rename: count → sample_size
  const is_confident = raw.probability >= 0.7 && sample_size >= 100; // both conditions required
  const processed_at = new Date().toISOString(); // fresh UTC timestamp per request

  return {
    success: true,
    data: {
      name: raw.name,
      gender: raw.gender,
      probability: raw.probability,
      sample_size,
      is_confident,
      processed_at,
    },
  };
}

module.exports = { classify };