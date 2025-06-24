// create response and generate token

export const jwtTokenResponse = (statusCode, user, res) => {
  
  //token
  const token = user.getJWTtoken();

   const isProduction = process.env.NODE_ENV === 'production';

  const options = {
    httpOnly: true,
    secure: isProduction, // ✅ only true on Render/production
    sameSite: isProduction ? 'None' : 'Lax', // ✅ Lax for local dev
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, user, token });
}

