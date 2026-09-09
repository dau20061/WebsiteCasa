export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'CASA TEA Backend API Server (Vercel Serverless)',
    time: new Date().toISOString()
  });
}

