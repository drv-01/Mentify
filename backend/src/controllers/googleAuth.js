const axios = require('axios');
const prisma = require('../db/prisma');
const { generateToken } = require('../Utils/token');

const getBackendUrl = () => {
  return process.env.NODE_ENV === 'production' 
    ? process.env.BACKEND_URL || 'https://mentify.onrender.com'
    : 'http://localhost:8000';
};

const getFrontendUrl = () => {
  return process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'https://mentifyapp.vercel.app'
    : 'http://localhost:5173';
};

const googleAuth = (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error('GOOGLE_CLIENT_ID not configured');
    }

    const backendUrl = getBackendUrl();
    const redirectUri = `${backendUrl}/api/auth/google/callback`;
    
    const googleAuthURL = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'profile email',
        access_type: 'offline',
        prompt: 'consent'
      }).toString();
    
    res.redirect(googleAuthURL);
  } catch (error) {
    console.error('❌ Google Auth initiation error:', error.message);
    res.redirect(`${getFrontendUrl()}/login?error=oauth_config_error`);
  }
};

const googleCallback = async (req, res) => {
  const { code, error } = req.query;
  const frontendUrl = getFrontendUrl();
  
  if (error) {
    console.error('❌ OAuth error from Google:', error);
    return res.redirect(`${frontendUrl}/login?error=oauth_denied`);
  }
  
  if (!code) {
    console.error('❌ No authorization code received');
    return res.redirect(`${frontendUrl}/login?error=oauth_no_code`);
  }

  try {
    const backendUrl = getBackendUrl();
    const redirectUri = `${backendUrl}/api/auth/google/callback`;
    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    });

    const { access_token } = tokenResponse.data;

    // Get user info from Google
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    
    const { name, email, picture } = userResponse.data;

    // Find or create user
    let user = await prisma.users.findFirst({ where: { email } });
    let isNewUser = false;
    
    if (!user) {
      user = await prisma.users.create({
        data: { name, email, password: 'google_oauth' }
      });
      isNewUser = true;
    }

    // Generate JWT token
    const tokens = generateToken(user.id);
    
    // Create success response
    const authData = {
      token: tokens.accessTokens,
      user: { id: user.id, name, email, picture },
      isNewUser
    };
    
    // Redirect to frontend with auth data
    const params = new URLSearchParams({
      auth: btoa(JSON.stringify(authData))
    });
    
    res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);

  } catch (error) {
    console.error('❌ Google OAuth error:', error.message);
    res.redirect(`${frontendUrl}/login?error=oauth_server_error`);
  }
};

module.exports = { googleAuth, googleCallback };