export default withApiAuthRequired(async function exp(req, res) {
    try {
      const { accessToken } = await getAccessToken(req, res, {
        scopes: ['read:export']
      });
      const apiPort = process.env.API_PORT || 3001;
      const response = await fetch(`http://localhost:${apiPort}/api/exp`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const exp = await response.json();
  
      res.status(200).json(exp);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  });