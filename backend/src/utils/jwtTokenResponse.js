// create response and generate token

export const jwtTokenResponse = (statusCode, user, res) => {
  
  //token
  const token = user.getJWTtoken();
  console.log(token)

 const isProduction = process.env.NODE_ENV === 'production';

  const options = {
    httpOnly: true,
    secure: isProduction,           // ✅ true for https only
    sameSite: isProduction ? 'None' : 'Lax', // ✅ required for cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
// console.log("✅ Setting cookie:", token);
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, user, token });
}

