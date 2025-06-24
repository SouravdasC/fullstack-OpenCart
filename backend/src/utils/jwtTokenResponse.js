// create response and generate token

export const jwtTokenResponse = (statusCode, user, res) => {
  
  //token
  const token = user.getJWTtoken();

   const isProduction = process.env.NODE_ENV === 'production';

  const options = {
    httpOnly: true,
    secure: isProduction, // 🔁 true on prod (HTTPS), false on localhost
    sameSite: isProduction ? 'None' : 'Lax', // 🔁 Required for cross-site in prod
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, user, token });
}

