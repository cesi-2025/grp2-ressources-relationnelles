"use client";

export default function SentryExamplePage() {
  return (
    <main style={{ padding: "4rem", textAlign: "center" }}>
      <h1>Page de test Sentry</h1>
      <button
        type="button"
        onClick={() => {
          throw new Error("Sentry Example Frontend Error");
        }}
      >
        Déclencher une erreur de test
      </button>
    </main>
  );
}
