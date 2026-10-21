import { LoginForm } from "@/components/login-form";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
  return (
    <main className="login-page">
      <section className="login-aside" aria-label="School portal introduction">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span className="brand-copy">School Portal<small>Learning community</small></span>
        </div>
        <div className="aside-message">
          <div className="aside-eyebrow">Your school, connected</div>
          <h1>Everything you need for a better school day.</h1>
          <p>Access learning, attendance, announcements, and school services in one secure place.</p>
        </div>
        <div className="aside-foot">A simpler way to stay connected to school.</div>
      </section>

      <section className="login-main" aria-labelledby="login-title">
        <div className="login-card">
          <h2 id="login-title">Sign in to your account</h2>
          <p className="login-intro">Enter the credentials provided by your school administrator.</p>
          {clerkConfigured ? (
            <SignIn
              forceRedirectUrl="/setup"
              appearance={{
                elements: {
                  rootBox: { width: "100%" },
                  cardBox: { width: "100%", boxShadow: "none" },
                  card: { width: "100%", padding: 0, boxShadow: "none" },
                },
              }}
            />
          ) : <LoginForm />}
        </div>
      </section>
    </main>
  );
}
