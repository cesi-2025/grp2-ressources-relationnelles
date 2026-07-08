import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
  integrations: [
    Sentry.feedbackIntegration({
      colorScheme: "system",
      triggerLabel: "Signaler un problème",
      formTitle: "Signaler un problème",
      submitButtonLabel: "Envoyer",
      cancelButtonLabel: "Annuler",
      messageLabel: "Description",
      messagePlaceholder: "Décrivez le problème rencontré",
      nameLabel: "Nom",
      emailLabel: "Email",
      successMessageText: "Merci pour votre signalement",
    }),
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
