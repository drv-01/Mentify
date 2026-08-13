const axios = require('axios');
const crypto = require('crypto');
const prisma = require('../db/prisma');
const { generateToken } = require('../Utils/token');
const { getBackendUrl, getFrontendUrl, isProduction } = require('../config/runtime');

const OAUTH_STATE_COOKIE = 'google_oauth_state';
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

const redirectToLoginError = (res, error) => {
  res.redirect(`${getFrontendUrl()}/login?error=${encodeURIComponent(error)}`);
};

const googleAuth = (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('Google OAuth is not configured');
      return redirectToLoginError(res, 'oauth_config_error');
    }

    const backendUrl = getBackendUrl();
    const redirectUri = `${backendUrl}/api/auth/google/callback`;
    const state = crypto.randomBytes(32).toString('base64url');
    res.cookie(OAUTH_STATE_COOKIE, state, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/api/auth/google/callback',
      maxAge: OAUTH_STATE_TTL_MS,
    });

    const googleAuthURL = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'profile email',
        access_type: 'offline',
        prompt: 'consent',
        state,
      }).toString();

    return res.redirect(googleAuthURL);
  } catch (error) {
    console.error('Google Auth Error:', error);
    return redirectToLoginError(res, 'oauth_config_error');
  }
};

const googleCallback = async (req, res) => {
  try {
    const { code, error, state } = req.query;
    const frontendUrl = getFrontendUrl();
    const expectedState = req.cookies[OAUTH_STATE_COOKIE];
    res.clearCookie(OAUTH_STATE_COOKIE, { path: '/api/auth/google/callback' });

    if (error) return redirectToLoginError(res, 'oauth_denied');
    if (!code) return redirectToLoginError(res, 'oauth_no_code');
    const receivedState = state && Buffer.from(state);
    const savedState = expectedState && Buffer.from(expectedState);
    if (!receivedState || !savedState || receivedState.length !== savedState.length || !crypto.timingSafeEqual(receivedState, savedState)) {
      console.warn('Rejected Google OAuth callback with an invalid state');
      return redirectToLoginError(res, 'oauth_invalid_state');
    }
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('Google OAuth is not configured');
      return redirectToLoginError(res, 'oauth_config_error');
    }

    const backendUrl = getBackendUrl();
    const redirectUri = `${backendUrl}/api/auth/google/callback`;
    const tokenParams = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    });
    
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', tokenParams, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token } = tokenResponse.data;
    if (!access_token) {
      return redirectToLoginError(res, 'oauth_server_error');
    }

    // Get user info from Google
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    
    const { name, email, picture, verified_email: verifiedEmail } = userResponse.data;
    if (!email || verifiedEmail === false) {
      return redirectToLoginError(res, 'oauth_email_unverified');
    }
    const normalizedEmail = email.trim().toLowerCase();

    // Find or create user
    let user = await prisma.Users.findUnique({ where: { email: normalizedEmail } });
    let isNewUser = false;
    
    if (!user) {
      user = await prisma.Users.create({
        data: { name: name || normalizedEmail, email: normalizedEmail, password: null }
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
    
    // A URL fragment is never sent to servers or included in Referer headers.
    const auth = Buffer.from(JSON.stringify(authData)).toString('base64url');
    return res.redirect(`${frontendUrl}/auth/callback#auth=${encodeURIComponent(auth)}`);

  } catch (error) {
    console.error('Google Callback Error:', error.message);
    return redirectToLoginError(res, 'oauth_server_error');
  }
};

module.exports = { googleAuth, googleCallback };
