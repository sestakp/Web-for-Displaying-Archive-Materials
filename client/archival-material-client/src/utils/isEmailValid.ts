

export default function isEmailValid(email: string) {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Test the email against the regex
    return emailRegex.test(email);
}