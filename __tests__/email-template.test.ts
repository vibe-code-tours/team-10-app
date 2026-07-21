import { getVerificationEmailHtml } from "@/lib/email/templates/verification";
import fs from "fs";
import path from "path";

describe("Registration Email Templates", () => {
  it("should generate valid verification HTML with custom name and URL", () => {
    const confirmUrl = "https://yoeyarzay.com/auth/callback?code=test-123";
    const html = getVerificationEmailHtml(confirmUrl, "Aung Aung");

    expect(html).toContain("Yoe Yar Zay");
    expect(html).toContain("Welcome to Yoe Yar Zay, Aung Aung!");
    expect(html).toContain(confirmUrl);
    expect(html).toContain("Verify Email Address");
    expect(html).not.toContain("powered by Supabase");
    expect(html).not.toContain("Opt out");
  });

  it("should generate valid verification HTML without full name", () => {
    const confirmUrl = "https://yoeyarzay.com/auth/callback?code=test-456";
    const html = getVerificationEmailHtml(confirmUrl);

    expect(html).toContain("Welcome to Yoe Yar Zay!");
    expect(html).toContain(confirmUrl);
  });

  it("should verify Supabase confirm_signup.html template contains required tags", () => {
    const templatePath = path.join(
      process.cwd(),
      "supabase",
      "templates",
      "confirm_signup.html",
    );
    const content = fs.readFileSync(templatePath, "utf-8");

    expect(content).toContain("{{ .ConfirmationURL }}");
    expect(content).toContain("Yoe Yar Zay");
    expect(content).toContain("Verify Email Address");
    expect(content).not.toContain("powered by Supabase");
    expect(content).not.toContain("Opt out");
  });
});
