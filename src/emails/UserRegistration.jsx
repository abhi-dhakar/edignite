import { Html, Head, Preview, Body, Container, Text, Heading, Hr, Link } from "@react-email/components";
import * as React from "react";

const UserRegistrationEmail = ({ name = "User", loginUrl = "" }) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Edignite! Your account has been created.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Welcome, {name}! 🎉</Heading>

          <Text style={styles.text}>
            Thank you for registering on <strong>Edignite</strong>. Your account has been successfully created.
          </Text>

          <Text style={styles.text}>
            Click the button below to log in to your dashboard.
          </Text>

          <Link href={loginUrl} style={styles.button}>Login Now</Link>

          <Hr style={styles.hr} />

          <Text style={styles.footer}>
            If you did not create this account, you can safely ignore this email.
            <br />— Edignite Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default UserRegistrationEmail;

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
    fontSize: "24px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "16px",
  },
  text: {
    fontSize: "16px",
    color: "#374151",
    marginBottom: "20px",
  },
  button: {
    display: "inline-block",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "0.5rem",
    textDecoration: "none",
    fontWeight: "600",
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
