import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-display-medium font-normal text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-body-large text-muted-foreground">
            Sign in to your LessonBloqs account
          </p>
        </div>

        {/* Sign-in card */}
        <div className="google-card p-8 elevation-2 hover:elevation-3 transition-all duration-200">
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            redirectUrl="/"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none p-0",
                headerTitle: "text-headline-large text-foreground",
                headerSubtitle: "text-body-medium text-muted-foreground",
                socialButtonsBlockButton:
                  "google-button-secondary !text-foreground hover:bg-muted",
                formButtonPrimary: "google-button-primary w-full",
                formFieldInput: "google-input",
                formFieldLabel: "text-label-large text-foreground",
                identityPreviewEditButton: "google-button-ghost",
                formResendCodeLink: "text-primary hover:text-primary-hover",
                footerActionLink: "text-primary hover:text-primary-hover",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground text-body-small",
                formFieldSuccessText: "text-success",
                formFieldErrorText: "text-destructive",
                alertClerkError:
                  "text-destructive bg-destructive/10 border-destructive/20",
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
              },
            }}
          />
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-body-small text-muted-foreground">
            New to LessonBloqs?{" "}
            <Link
              href="/sign-up"
              className="text-primary hover:text-primary-hover font-medium transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
