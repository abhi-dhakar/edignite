import { 
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text
} from '@react-email/components';

 const PasswordResetEmail = ({ name, otp }) => (
  <Html>
    <Head />
    <Preview>Your password reset code: {otp}</Preview>
    <Body style={{ fontFamily: 'Arial, sans-serif' }}>
      <Container>
        <Section>
          <Heading>Password Reset Code</Heading>
          <Text>Hello {name},</Text>
          <Text>We received a request to reset your password for your NGO account. Use the verification code below to complete your password reset:</Text>
          
          <Text style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            backgroundColor: '#f4f4f4',
            padding: '12px',
            textAlign: 'center',
            letterSpacing: '8px',
            margin: '20px 0'
          }}>
            {otp}
          </Text>
          
          <Text>This code will expire in 10 minutes for security reasons.</Text>
          <Text>If you didn't request this password reset, you can safely ignore this email.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;