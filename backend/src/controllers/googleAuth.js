const axios = require('axios');
const prisma = require('../db/prisma');
const { generateToken } = require('../Utils/token');

const getBackendUrl = () => {
  // Check if we're on Render (production)
  if (process.env.RENDER || process.env.NODE_ENV === 'production') {
    return 'https://mentify.onrender.com';
  }
  // Local development
  return 'http://localhost:8000';
};

const getFrontendUrl = () => {
  // Check if we're on Render (production)
  if (process.env.RENDER || process.env.NODE_ENV === 'production') {
    return 'https://mentifyapp.vercel.app';
  }
  // Local development
  return 'http://localhost:5173';
};

const googleAuth = (req, res) => {
  try {
    console.log('Environment check:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('RENDER:', process.env.RENDER);
    console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
    console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);
    
    if (process.env.GOOGLE_CLIENT_ID) {
      console.log('CLIENT_ID starts with:', process.env.GOOGLE_CLIENT_ID.substring(0, 20));
    }
    
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('GOOGLE_CLIENT_ID not configured');
      console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('GOOGLE')));
      return res.redirect(`${getFrontendUrl()}/login?error=oauth_config_error`);
    }

    const backendUrl = getBackendUrl();
    const redirectUri = `${backendUrl}/api/auth/google/callback`;
    
    console.log('Google Auth - Backend URL:', backendUrl);
    console.log('Google Auth - Redirect URI:', redirectUri);
    console.log('Google Auth - Frontend URL:', getFrontendUrl());
    
    const googleAuthURL = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'profile email',
        access_type: 'offline',
        prompt: 'consent'
      }).toString();
    
    console.log('Redirecting to Google Auth URL:', googleAuthURL);
    res.redirect(googleAuthURL);
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.redirect(`${getFrontendUrl()}/login?error=oauth_config_error`);
  }
};

const googleCallback = async (req, res) => {
  const { code, error } = req.query;
  const frontendUrl = getFrontendUrl();
  
  console.log('Google Callback - Query params:', { code: !!code, error });
  console.log('Google Callback - Frontend URL:', frontendUrl);
  
  if (error) {
    console.error('Google OAuth Error:', error);
    return res.redirect(`${frontendUrl}/login?error=oauth_denied`);
  }
  
  if (!code) {
    console.error('No authorization code received');
    return res.redirect(`${frontendUrl}/login?error=oauth_no_code`);
  }

  try {
    if (!process.env.GOOGLE_CLIENT_SECRET) {
      console.error('GOOGLE_CLIENT_SECRET not configured');
      return res.redirect(`${frontendUrl}/login?error=oauth_config_error`);
    }

    const backendUrl = getBackendUrl();
    const redirectUri = `${backendUrl}/api/auth/google/callback`;
    
    console.log('Token exchange - Redirect URI:', redirectUri);
    console.log('Using CLIENT_ID:', process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...');
    
    // Exchange code for access token
    const tokenParams = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    });
    
    console.log('Token exchange request params:', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: '[HIDDEN]',
      code: code?.substring(0, 20) + '...',
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    });
    
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', tokenParams, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token } = tokenResponse.data;
    console.log('Access token received:', !!access_token);
    
    if (!access_token) {
      console.error('No access token in response:', tokenResponse.data);
      return res.redirect(`${frontendUrl}/login?error=oauth_server_error`);
    }

    // Get user info from Google
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    
    const { name, email, picture } = userResponse.data;
    console.log('User info received:', { name, email, picture: !!picture });

    // Find or create user
    let user = await prisma.Users.findFirst({ where: { email } });
    let isNewUser = false;
    
    if (!user) {
      user = await prisma.Users.create({
        data: { name, email, password: null }
      });
      isNewUser = true;
      console.log('New user created:', user.id);
    } else {
      console.log('Existing user found:', user.id);
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
    
    const redirectUrl = `${frontendUrl}/auth/callback?${params.toString()}`;
    console.log('Redirecting to frontend:', redirectUrl);
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Google Callback Error:', error.message);
    console.error('Error stack:', error.stack);
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
      console.error('Error response headers:', error.response.headers);
    }
    if (error.request) {
      console.error('Error request:', error.request);
    }
    res.redirect(`${frontendUrl}/login?error=oauth_server_error`);
  }
};

module.exports = { googleAuth, googleCallback };