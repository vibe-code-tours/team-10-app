import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "2.5rem",
            marginBottom: "var(--space-md)",
            opacity: 0.6,
          }}
        >
          ✉
        </div>
        <h1 className="auth-title">အီးမေးလ်အတည်ပြုပါ</h1>
        <p
          className="auth-subtitle"
          style={{ marginBottom: "var(--space-xl)" }}
        >
          သင့်အီးမေးလ်ထံ အတည်ပြုလင့်ခ်ပို့ပြီးပါပြီ။ အီးမေးလ်ကိုဖွင့်ပြီး
          လင့်ခ်ကိုနှိပ်ပါ။
        </p>
        <p
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-tertiary)",
            marginBottom: "var(--space-lg)",
          }}
        >
          အီးမေးလ်မရောက်လျှင် Spam ဖိုလ်ဒါကိုစစ်ဆေးပါ။
        </p>
        <Link href="/login" className="btn btn-primary" id="btn-back-login">
          အကောင့်ဝင်ရောက်ရန်
        </Link>
      </div>
    </div>
  );
}
