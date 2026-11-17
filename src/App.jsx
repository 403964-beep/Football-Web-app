import {
  ClerkProvider,
  Show,
  SignIn,
  SignUp,
  useClerk,
  useUser,
} from "@clerk/react";
import { dark } from "@clerk/themes";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { createPortal } from "react-dom";
import { Link, Redirect, Route, Router as WouterRouter, Switch, useLocation } from "wouter";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path) {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const appearance = {
  theme: dark,
  options: {
    logoPlacement: "inside",
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#C49B1A",
    colorForeground: "#F8FAFC",
    colorMutedForeground: "#B9B5C9",
    colorDanger: "#FB7185",
    colorBackground: "#171045",
    colorInput: "#0C0A19",
    colorInputForeground: "#F8FAFC",
    colorNeutral: "#F8FAFC",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    borderRadius: "12px",
  },
  elements: {
    rootBox: { width: "100%", display: "flex", justifyContent: "center" },
    cardBox: {
      width: "min(440px, 100%)",
      overflow: "hidden",
      borderRadius: "18px",
      border: "1px solid rgba(196, 155, 26, .42)",
      background: "#171045",
      boxShadow: "0 24px 80px rgba(0, 0, 0, .48)",
    },
    card: { background: "transparent", boxShadow: "none", border: "none" },
    footer: { background: "transparent", boxShadow: "none", border: "none" },
    headerTitle: { color: "#F8FAFC", fontWeight: 800 },
    headerSubtitle: { color: "#C8C5D3" },
    socialButtonsBlockButtonText: { color: "#F8FAFC", fontWeight: 600 },
    formFieldLabel: { color: "#F8FAFC", fontWeight: 600 },
    footerActionLink: { color: "#E3BF52", fontWeight: 700 },
    footerActionText: { color: "#C8C5D3" },
    dividerText: { color: "#C8C5D3" },
    identityPreviewEditButton: { color: "#E3BF52" },
    formFieldSuccessText: { color: "#86EFAC" },
    alertText: { color: "#F8FAFC" },
    logoBox: { borderRadius: "10px" },
    logoImage: { width: "36px", height: "36px" },
    socialButtonsBlockButton: {
      border: "1px solid rgba(255, 255, 255, .18)",
      borderRadius: "10px",
      background: "#211B43",
    },
    formButtonPrimary: {
      borderRadius: "10px",
      background: "#C49B1A",
      color: "#171045",
      fontWeight: 800,
    },
    formFieldInput: {
      border: "1px solid rgba(255, 255, 255, .18)",
      borderRadius: "10px",
      background: "#0C0A19",
      color: "#F8FAFC",
    },
    footerAction: { color: "#C8C5D3" },
    dividerLine: { background: "rgba(255, 255, 255, .16)" },
    alert: { borderRadius: "10px" },
    otpCodeFieldInput: {
      border: "1px solid rgba(255, 255, 255, .18)",
      borderRadius: "10px",
      background: "#0C0A19",
      color: "#F8FAFC",
    },
    formFieldRow: { marginBottom: "16px" },
    main: { color: "#F8FAFC" },
  },
};

const clerkLocalization = {
  signIn: {
    start: {
      title: "Welcome back",
      subtitle: "Sign in to return to The Flock Forecast",
    },
  },
  signUp: {
    start: {
      title: "Join the Flock",
      subtitle: "Create an account to continue",
    },
  },
};

function LogoutButton() {
  const { signOut } = useClerk();
  return (
    <button
      className="auth-control auth-control-muted"
      type="button"
      onClick={() => signOut({ redirectUrl: basePath || "/" })}
    >
      Sign out
    </button>
  );
}

function AuthControls() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <span className="auth-loading" aria-label="Loading account" />;

  if (user) {
    const displayName =
      user.firstName || user.primaryEmailAddress?.emailAddress || "Signed in";
    return (
      <div className="auth-actions">
        <span className="auth-greeting" title={user.primaryEmailAddress?.emailAddress}>
          {displayName}
        </span>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="auth-actions">
      <Link className="auth-control auth-control-muted" href="/sign-in">
        Sign in
      </Link>
      <Link className="auth-control auth-control-primary" href="/sign-up">
        Create account
      </Link>
    </div>
  );
}

function AuthScreen({ children, eyebrow, title }) {
  return createPortal(
    <main className="auth-screen">
      <div className="auth-screen-glow" aria-hidden="true" />
      <div className="auth-screen-content">
        <header className="auth-screen-header">
          <a className="auth-brand" href={basePath || "/"}>
            <img src={`${basePath}/logo.svg`} alt="" />
            <span>
              <strong>The Flock Forecast</strong>
              <small>Expert analysis · Baltimore Ravens</small>
            </span>
          </a>
          <Link className="auth-control auth-control-muted" href="/">
            Back to the site
          </Link>
        </header>
        <section className="auth-panel">
          <p className="auth-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {children}
        </section>
        <p className="auth-legal">Secure account access powered by Clerk.</p>
      </div>
    </main>,
    document.body,
  );
}

function SignInPage() {
  return (
    <AuthScreen eyebrow="Welcome back" title="Sign in to your account">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        forceRedirectUrl={`${basePath}/`}
        appearance={appearance}
      />
    </AuthScreen>
  );
}

function SignUpPage() {
  return (
    <AuthScreen eyebrow="Join the flock" title="Create your account">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
        forceRedirectUrl={`${basePath}/`}
        appearance={appearance}
      />
    </AuthScreen>
  );
}

function UserPortalCard() {
  const { user } = useUser();
  return createPortal(
    <main className="auth-screen">
      <div className="auth-screen-glow" aria-hidden="true" />
      <section className="account-card">
        <img className="account-logo" src={`${basePath}/logo.svg`} alt="" />
        <p className="auth-eyebrow">Your Flock Forecast account</p>
        <h1>You’re signed in</h1>
        <p className="account-email">
          {user?.primaryEmailAddress?.emailAddress || user?.fullName}
        </p>
        <Link className="auth-control auth-control-primary account-continue" href="/dashboard">
          Continue to the site
        </Link>
        <LogoutButton />
      </section>
    </main>,
    document.body,
  );
}

function UserPortal() {
  return (
    <>
      <Show when="signed-in">
        <UserPortalCard />
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/user-portal" />
      </Show>
      <Show when="signed-out">
        <AuthControls />
      </Show>
    </>
  );
}

function DashboardRoute() {
  return (
    <>
      <Show when="signed-in">
        <AuthControls />
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function ClerkApp() {
  const [, setLocation] = useLocation();

  if (!clerkPubKey) {
    throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY for sign-in.");
  }

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={appearance}
      localization={clerkLocalization}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <Switch>
        <Route path="/" component={HomeRedirect} />
        <Route path="/dashboard" component={DashboardRoute} />
        <Route path="/user-portal" component={UserPortal} />
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkApp />
    </WouterRouter>
  );
}
