import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";

const VolunteerApprovedEmail = ({ name = "Volunteer" }) => {
  return (
    <Html>
      <Head />
      <Preview>Your Volunteer Application has been Approved!</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Congratulations, {name}!</Heading>

          <Text style={styles.text}>
            We’re excited to let you know that your volunteer application has been <strong>approved</strong> 🎉
          </Text>

          <Text style={styles.text}>
            Your skills and enthusiasm will make a real impact, and we can't wait to work with you. You’ll soon receive more information about your role and upcoming activities.
          </Text>

          <Text style={styles.text}>
            Welcome to the Edignite family!
          </Text>

          <Hr style={styles.hr} />

          <Text style={styles.footer}>
            — Edignite Team <br />
            <a href="mailto:help@edignite.org">help@edignite.org</a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default VolunteerApprovedEmail;

const styles = {
  body: {
    backgroundColor: "#f9fafb",
    fontFamily: "Inter, sans-serif",
    padding: "20px",
  },
  container: {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "12px",
    maxWidth: "520px",
    margin: "0 auto",
    boxShadow: "0 0 12px rgba(0, 0, 0, 0.05)",
  },
  heading: {
    fontSize: "22px",
    color: "#111827",
    marginBottom: "16px",
  },
  text: {
    fontSize: "16px",
    color: "#374151",
    marginBottom: "20px",
    lineHeight: "1.6",
  },
  hr: {
    margin: "30px 0",
    borderColor: "#e5e7eb",
  },
  footer: {
    fontSize: "13px",
    color: "#6b7280",
  },
};
