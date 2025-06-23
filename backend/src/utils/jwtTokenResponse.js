// create response and generate token

export const jwtTokenResponse = (statusCode, user, res) => {
  
  //token
  const token = user.getJWTtoken();

  //options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 *60 *1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  }

  res.status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, user, token })
}

