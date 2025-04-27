// Redirect handler for non-API paths
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  // Redirect to the root
  res.writeHead(302, { Location: '/' });
  res.end();
}