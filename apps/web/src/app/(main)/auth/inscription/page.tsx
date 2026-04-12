"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ApiRequestError } from "@/lib/api";

import { FormEvent, useState } from 'react';
import { ApiError } from '@/lib/api';
import { useAuth } from "@/context/AuthContext";

export default function InscriptionPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (password !== passwordConfirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password, passwordConfirmation);
      router.push("/ressources");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
        if (err.errors) setFieldErrors(err.errors);
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Inscription</h1>
          <p className="text-gray-600">
            Créez votre compte pour accéder aux ressources
          </p>
        </div>

        <Card>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
                {error}
              </div>
            )}

            <Input
              name="name"
              label="Nom complet"
              type="text"
              placeholder="Jean Dupont"
              autoComplete="name"
              value={form.name}
              onChange={set('name')}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={fieldErrors.name?.[0]}
            />
            <Input
              name="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="jean.dupont@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email?.[0]}
            />
            <Input
              name="password"
              label="Mot de passe"
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password?.[0]}
            />
            <Input
              name="password_confirme"
              label="Confirmer le mot de passe"
              type="password"
              value={form.passwordConfirmation}
              onChange={set('passwordConfirmation')}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 mr-2 rounded border-gray-300 text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                J&apos;accepte les{" "}
                <Link href="/cgu" className="text-primary hover:underline">
                  conditions générales d&apos;utilisation
                </Link>
              </label>
            </div>

            <Button variant="primary" className="w-full" type="submit" disabled={loading}>
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link href="/auth/connexion" className="text-primary font-medium hover:underline">
              Se connecter
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
