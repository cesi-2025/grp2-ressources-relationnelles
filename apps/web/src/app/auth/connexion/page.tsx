import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function ConnexionPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Connexion</h1>
          <p className="text-gray-600">
            Connectez-vous pour accéder à votre compte
          </p>
        </div>

        <Card>
          <form className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="jean.dupont@example.com"
              autoComplete="email"
              required
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="mr-2 rounded border-gray-300 text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                <label htmlFor="remember" className="text-gray-600">
                  Se souvenir de moi
                </label>
              </div>
              <Link href="/auth/mot-de-passe-oublie" className="text-primary hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button variant="primary" className="w-full" type="submit">
              Se connecter
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Vous n&apos;avez pas de compte ?{" "}
            <Link href="/auth/inscription" className="text-primary font-medium hover:underline">
              S&apos;inscrire
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
