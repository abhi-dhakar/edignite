import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Heading,
  Hr,
} from "@react-email/components";
import * as React from "react";

const OTPVerificationEmail = ({ name = "User", otp = "123456" }) => {
  return (
    <Html>
      <Head />
      <Preview>Your Edignite OTP Code</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Verify your identity</Heading>

          <Text style={styles.text}>
            Hi {name},<br />
            Use the following OTP to complete your verification:
          </Text>

          <Text style={styles.otp}>{otp}</Text>

          <Text style={styles.text}>
            This code will expire in 10 minutes. Please do not share it with anyone.
          </Text>

          <Hr style={styles.hr} />

          <Text style={styles.footer}>
            Didn’t request this code? You can safely ignore this email.
            <br />— Edignite Security Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OTPVerificationEmail;

const styles = {
  body: {
    backgroundColor: "#f9fafb",
    fontFamily: "Inter, sans-serif",
    padding: "20px",
  },
  container: {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "0.75rem",
    maxWidth: "480px",
    margin: "0 auto",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "16px",
  },
  text: {
    fontSize: "16px",
    color: "#374151",
    marginBottom: "20px",
    lineHeight: "1.6",
  },
  otp: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#2563eb",
    letterSpacing: "4px",
    textAlign: "center",
    margin: "20px 0",
  },
  hr: {
    margin: "32px 0",
    borderColor: "#e5e7eb",
  },
  footer: {
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: "1.5",
  },
};
