import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, react }) => {
  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Edignite <no-reply@edignite.org>",
      to,
      subject,
      react,
    });

    return response;
  } catch (error) {
    console.error("Email Sending Error:", error);
    throw new Error("Failed to send email");
  }
};
