import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Hr,
    Button,
    Img,
} from "@react-email/components";

export interface NewIntentResponseEmailProps {
    projectName: string;
    ownerName: string;
    optionLabel?: string | null;
    text?: string | null;
    country?: string | null;
    plan?: string | null;
    pageUrl?: string | null;
    dashboardUrl: string;
}

export default function NewIntentResponseEmail({
    projectName,
    ownerName,
    optionLabel,
    text,
    country,
    plan,
    pageUrl,
    dashboardUrl,
}: NewIntentResponseEmailProps) {
    const previewText = `New reason: ${optionLabel || "response"} on ${projectName}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Img src="https://feedinbox.com/feedinbox.png" alt="Feedinbox" width="16" height="16" style={logo} />
                    </Section>

                    <Section style={content}>
                        <Text style={eyebrow}>WHY-NOT-BUY</Text>
                        <Heading style={heading}>Someone told you why they didn't buy</Heading>

                        <Text style={paragraph}>
                            Hi {ownerName?.split(" ")[0] || "there"}, a visitor on{" "}
                            <strong>{projectName}</strong> just answered the Why-Not-Buy question.
                        </Text>

                        {optionLabel && (
                            <Section style={answerBox}>
                                <Text style={answerText}>"{optionLabel}"</Text>
                            </Section>
                        )}

                        {text && (
                            <Section style={quoteBox}>
                                <Text style={quoteText}>{text}</Text>
                            </Section>
                        )}

                        <Section style={metaSection}>
                            {plan && <Text style={metaText}><strong>Plan viewed:</strong> {plan}</Text>}
                            {country && <Text style={metaText}><strong>Country:</strong> {country}</Text>}
                            {pageUrl && <Text style={metaText}><strong>Page:</strong> {pageUrl}</Text>}
                        </Section>

                        <Hr style={hr} />

                        <Section style={buttonSection}>
                            <Button style={button} href={dashboardUrl}>
                                View in dashboard →
                            </Button>
                        </Section>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "20px 0 48px", marginBottom: "64px", maxWidth: "600px" };
const header = { padding: "20px 40px", backgroundColor: "#171717" };
const logo = { margin: "0", width: "16px", height: "16px", borderRadius: "50%" };
const content = { padding: "32px 40px" };
const eyebrow = { color: "#9ca3af", fontSize: "12px", fontWeight: "600" as const, letterSpacing: "0.06em", margin: "0 0 6px" };
const heading = { color: "#171717", fontSize: "22px", fontWeight: "bold" as const, margin: "0 0 16px" };
const paragraph = { color: "#374151", fontSize: "16px", lineHeight: "24px", margin: "0 0 20px" };
const answerBox = { backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px 20px", marginBottom: "12px" };
const answerText = { color: "#171717", fontSize: "18px", fontWeight: "600" as const, margin: "0" };
const quoteBox = { borderLeft: "3px solid #e5e7eb", padding: "2px 0 2px 14px", margin: "0 0 16px" };
const quoteText = { color: "#374151", fontSize: "14px", lineHeight: "22px", fontStyle: "italic" as const, margin: "0" };
const metaSection = { marginBottom: "16px" };
const metaText = { color: "#6b7280", fontSize: "14px", lineHeight: "20px", margin: "0 0 6px" };
const hr = { borderColor: "#e5e7eb", margin: "24px 0" };
const buttonSection = { textAlign: "center" as const };
const button = { backgroundColor: "#171717", borderRadius: "8px", color: "#ffffff", display: "inline-block", fontSize: "14px", fontWeight: "600" as const, padding: "12px 24px", textDecoration: "none" };
