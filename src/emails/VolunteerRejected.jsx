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

const VolunteerRejectedEmail = ({ name = "Volunteer" }) => {
  return (
    <Html>
      <Head />
      <Preview>Volunteer Application Update</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Update on Your Application</Heading>

          <Text style={styles.text}>
            Dear {name},
          </Text>

          <Text style={styles.text}>
            We truly appreciate your interest in volunteering with Edignite. After reviewing your application, we regret to inform you that we are unable to move forward with your application at this time.
          </Text>

          <Text style={styles.text}>
            This decision was not easy and does not reflect negatively on your abilities or enthusiasm. We encourage you to apply again in the future or stay connected with our initiatives.
          </Text>

          <Text style={styles.text}>
            Thank you once again for your willingness to make a difference.
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

export default VolunteerRejectedEmail;

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
