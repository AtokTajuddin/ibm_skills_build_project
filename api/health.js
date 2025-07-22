// Vercel API entry point for /api/health
// This is a serverless function that Vercel will deploy separately

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Respond to health check
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      message: 'Health check passed',
      environment: process.env.NODE_ENV || 'unknown',
      timestamp: new Date().toISOString(),
      serverInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage()
      }
    });
  }
  
  // Handle unsupported methods
  return res.status(405).json({ error: 'Method not allowed' });
};
