"use client"
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

import { FormEvent, useState } from 'react';
import { ApiError } from '@/lib/api';
import { useAuth } from "@/context/AuthContext";

export default function InscriptionPage() {
  
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
 
  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }
 
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setGlobalError('');
 
    if (form.password !== form.passwordConfirmation) {
      setErrors({ passwordConfirmation: 'Les mots de passe ne correspondent pas.' });
      return;
    }
 
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.passwordConfirmation);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          const flat: Record<string, string> = {};
          Object.entries(err.errors).forEach(([k, v]) => (flat[k] = v[0]));
          setErrors(flat);
        } else {
          setGlobalError(err.message);
        }
      } else {
        setGlobalError('Une erreur inattendue est survenue.');
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
            <Input
              name="name"
              label="Nom complet"
              type="text"
              placeholder="Jean Dupont"
              autoComplete="name"
              value={form.name}
              onChange={set('name')}
              required
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
              S&apos;inscrire
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
