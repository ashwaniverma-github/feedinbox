import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Hr,
    Button,
    Img,
    Row,
    Column,
} from "@react-email/components";

export interface DigestOption {
    label: string;
    count: number;
    percent: number; // 0-100
}

export interface DigestCountry {
    country: string;
    count: number;
}

export interface IntentWeeklyDigestProps {
    ownerName: string;
    weekRange: string; // e.g. "Jul 14 – Jul 20"
    total: number;
    previousTotal: number;
    options: DigestOption[];
    countries: DigestCountry[];
    quotes: string[];
    dashboardUrl: string;
}

function deltaLabel(total: number, previous: number): string {
    if (previous === 0) return total > 0 ? "New this week" : "No responses last week";
    const diff = total - previous;
    const pct = Math.round((diff / previous) * 100);
    if (diff === 0) return "Same as last week";
    return `${diff > 0 ? "▲" : "▼"} ${Math.abs(pct)}% vs last week`;
}

export default function IntentWeeklyDigest({
    ownerName,
    weekRange,
    total,
    previousTotal,
    options,
    countries,
    quotes,
    dashboardUrl,
}: IntentWeeklyDigestProps) {
    const previewText = `${total} Why-Not-Buy ${total === 1 ? "response" : "responses"} this week`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Img
                            src="https://feedinbox.com/feedinbox.png"
                            alt="Feedinbox"
                            width="16"
                            height="16"
                            style={logo}
                        />
                    </Section>

                    <Section style={content}>
                        <Text style={eyebrow}>WHY-NOT-BUY · {weekRange}</Text>
                        <Heading style={heading}>Why people didn't buy</Heading>

                        <Text style={greeting}>Hi {ownerName?.split(" ")[0] || "there"},</Text>
                        <Text style={paragraph}>
                            Here's what visitors told you when they left a high-intent surface
                            without buying this week.
                        </Text>

                        {/* Headline stat */}
                        <Section style={statBox}>
                            <Text style={statNumber}>{total}</Text>
                            <Text style={statLabel}>
                                {total === 1 ? "response" : "responses"} · {deltaLabel(total, previousTotal)}
                            </Text>
                        </Section>

                        {/* Option breakdown */}
                        <Heading as="h2" style={sectionTitle}>
                            What stopped them
                        </Heading>
                        {options.length === 0 ? (
                            <Text style={mutedText}>No answers recorded.</Text>
                        ) : (
                            options.map((opt, i) => (
                                <Section key={i} style={barRowWrap}>
                                    <Row>
                                        <Column>
                                            <Text style={barLabel}>{opt.label}</Text>
                                        </Column>
                                        <Column style={barCountCol}>
                                            <Text style={barCount}>
                                                {opt.count} · {opt.percent}%
                                            </Text>
                                        </Column>
                                    </Row>
                                    <Section style={barTrack}>
                                        <Section
                                            style={{ ...barFill, width: `${Math.max(3, opt.percent)}%` }}
                                        >
                                            &nbsp;
                                        </Section>
                                    </Section>
                                </Section>
                            ))
                        )}

                        {/* Countries */}
                        {countries.length > 0 && (
                            <>
                                <Heading as="h2" style={sectionTitle}>
                                    Where they were
                                </Heading>
                                <Text style={countryLine}>
                                    {countries
                                        .slice(0, 6)
                                        .map((c) => `${c.country} (${c.count})`)
                                        .join("   ·   ")}
                                </Text>
                            </>
                        )}

                        {/* Quotes */}
                        {quotes.length > 0 && (
                            <>
                                <Heading as="h2" style={sectionTitle}>
                                    In their words
                                </Heading>
                                {quotes.slice(0, 4).map((q, i) => (
                                    <Section key={i} style={quoteBox}>
                                        <Text style={quoteText}>"{q}"</Text>
                                    </Section>
                                ))}
                            </>
                        )}

                        <Hr style={hr} />

                        <Section style={buttonSection}>
                            <Button style={button} href={dashboardUrl}>
                                View full breakdown →
                            </Button>
                        </Section>
                    </Section>

                    <Section style={footer}>
                        <Text style={footerText}>
                            Weekly digest from{" "}
                            <Link href="https://feedinbox.com" style={footerLink}>
                                Feedinbox
                            </Link>
                            . You receive this only in weeks with new responses.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
    maxWidth: "600px",
};

const header = {
    padding: "20px 40px",
    backgroundColor: "#171717",
};

const logo = {
    margin: "0",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
};

const content = {
    padding: "32px 40px",
};

const eyebrow = {
    color: "#9ca3af",
    fontSize: "12px",
    fontWeight: "600" as const,
    letterSpacing: "0.06em",
    margin: "0 0 6px",
};

const heading = {
    color: "#171717",
    fontSize: "24px",
    fontWeight: "bold" as const,
    margin: "0 0 20px",
};

const greeting = {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0 0 8px",
};

const paragraph = {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0 0 24px",
};

const statBox = {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "20px 24px",
    marginBottom: "28px",
    textAlign: "center" as const,
};

const statNumber = {
    color: "#171717",
    fontSize: "40px",
    fontWeight: "bold" as const,
    lineHeight: "44px",
    margin: "0",
};

const statLabel = {
    color: "#6b7280",
    fontSize: "13px",
    margin: "4px 0 0",
};

const sectionTitle = {
    color: "#171717",
    fontSize: "15px",
    fontWeight: "600" as const,
    margin: "24px 0 12px",
};

const barRowWrap = {
    marginBottom: "14px",
};

const barLabel = {
    color: "#374151",
    fontSize: "14px",
    margin: "0",
};

const barCountCol = {
    textAlign: "right" as const,
};

const barCount = {
    color: "#6b7280",
    fontSize: "13px",
    margin: "0",
};

const barTrack = {
    backgroundColor: "#eef2f7",
    borderRadius: "6px",
    height: "8px",
    marginTop: "6px",
    overflow: "hidden" as const,
};

const barFill = {
    backgroundColor: "#171717",
    borderRadius: "6px",
    height: "8px",
    fontSize: "1px",
    lineHeight: "8px",
};

const countryLine = {
    color: "#374151",
    fontSize: "14px",
    lineHeight: "22px",
    margin: "0",
};

const quoteBox = {
    borderLeft: "3px solid #e5e7eb",
    padding: "2px 0 2px 14px",
    margin: "0 0 12px",
};

const quoteText = {
    color: "#374151",
    fontSize: "14px",
    lineHeight: "22px",
    fontStyle: "italic" as const,
    margin: "0",
};

const mutedText = {
    color: "#9ca3af",
    fontSize: "14px",
    margin: "0",
};

const hr = {
    borderColor: "#e5e7eb",
    margin: "24px 0",
};

const buttonSection = {
    textAlign: "center" as const,
};

const button = {
    backgroundColor: "#171717",
    borderRadius: "8px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "14px",
    fontWeight: "600" as const,
    padding: "12px 24px",
    textDecoration: "none",
};

const footer = {
    padding: "0 40px",
};

const footerText = {
    color: "#9ca3af",
    fontSize: "12px",
    lineHeight: "20px",
    margin: "0",
    textAlign: "center" as const,
};

const footerLink = {
    color: "#6b7280",
    textDecoration: "underline",
};
