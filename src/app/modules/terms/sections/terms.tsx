export function TermsSection() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 mt-20">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground">
          By accessing and using TodoBoard, you accept and agree to be bound by
          these Terms of Service. If you do not agree to these terms, please do
          not use our application.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Use of the Application</h2>
        <p className="text-muted-foreground">
          TodoBoard is provided for personal and non-commercial use. You may not
          use the application for any illegal or unauthorized purpose.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Open Source License</h2>
        <p className="text-muted-foreground">
          TodoBoard is an open-source project, and you are free to use, modify,
          and distribute the code under the terms of the applicable open-source
          license.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Limitation of Liability</h2>
        <p className="text-muted-foreground">
          TodoBoard is provided &ldquo;as is&rdquo; without any warranties of
          any kind. We are not liable for any damages arising from the use of
          the application.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">5. Changes to Terms</h2>
        <p className="text-muted-foreground">
          We reserve the right to modify these Terms of Service at any time.
          Your continued use of the application after any changes constitutes
          your acceptance of the new terms.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">6. Contact Information</h2>
        <p className="text-muted-foreground">
          If you have any questions about these Terms of Service, please contact
          us at{" "}
          <a
            href="mailto:support@todoboard.net"
            className="text-primary hover:underline"
          >
            support@todoboard.net
          </a>
          .
        </p>
      </div>
    </div>
  );
}
