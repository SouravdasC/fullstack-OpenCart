import nodeMailer from "nodemailer"

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport(
    {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT, //true for port 465, false for 587
      secure:true,
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL, // SMPT - simple mail transfer protocol
        pass: process.env.SMTP_PASSWORD
      }
    }
  )

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message
  }

  await transporter.sendMail(mailOptions);
}

export default sendEmail