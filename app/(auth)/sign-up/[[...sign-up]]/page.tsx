import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-display-medium font-normal text-foreground mb-2">
            Join LessonBloqs
          </h1>
          <p className="text-body-large text-muted-foreground">
            Create your account to get started
          </p>
        </div>

        {/* Sign-up card */}
        <div className="google-card p-8 elevation-2 hover:elevation-3 transition-all duration-200">
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            redirectUrl="/onboarding"
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
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-primary hover:text-primary-hover font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
