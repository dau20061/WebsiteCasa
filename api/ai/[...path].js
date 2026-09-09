// ============================================================================
// CASA TEA - VERCEL SERVERLESS CATCH-ALL ROUTER FOR /api/ai/*
// ============================================================================

export default async function handler(req, res) {
  res.status(404).json({
    error: `AI endpoint '${req.url}' not found in /api/ai/`
  });
}

