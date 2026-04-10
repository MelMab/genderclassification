const genderizeService = require("../services/genderiseService");


async function classify(req, res) {
  const { name } = req.query;

  // Missing or empty string
  if (name === undefined || name === "") {
    return res.status(400).json({
      status: "error",
      message: "Missing required query parameter: name",
    });
  }
  // Express parses ?name[]=foo as an array — catch that here
  if (typeof name !== "string") {
    return res.status(422).json({
      status: "error",
      message: "Query parameter 'name' must be a string",
    });
  }
  // ── 2. Call service layer ──────────────────────────────────────────────────
  const result = await genderizeService.classify(name);

  // ── 3. Map service result to HTTP response ─────────────────────────────────
  if (!result.success) {
    return res.status(result.statusCode).json({
      status: "error",
      message: result.message,
    });
  }

  return res.status(200).json({
    status: "success",
    data: result.data,
  });
}

module.exports = { classify };