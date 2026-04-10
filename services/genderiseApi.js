const https = require("https");


function fetch(name) {
  return new Promise((resolve, reject) => {
    const url = `https://api.genderize.io/?name=${encodeURIComponent(name)}`;

    const req = https.get(url, (res) => {
      let raw = "";

      res.on("data", (chunk) => (raw += chunk));

      res.on("end", () => {
        // Non-2xx response from upstream
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject({
            type: "upstream",
            message: `Genderize API returned status ${res.statusCode}`,
          });
        }

        try {
          resolve(JSON.parse(raw));
        } catch {
          reject({
            type: "parse",
            message: "Failed to parse Genderize API response",
          });
        }
      });
    });

    // Network-level failure (DNS, connection refused, etc.)
    req.on("error", (err) => {
      reject({
        type: "network",
        message: `Failed to reach Genderize API: ${err.message}`,
      });
    });

    // Timeout guard — don't hang the server waiting on upstream
    req.setTimeout(5000, () => {
      req.destroy();
      reject({ type: "timeout", message: "Genderize API request timed out" });
    });
  });
}

module.exports = { fetch };