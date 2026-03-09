import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-light text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              (RE)Sources Relationnelles
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
              Plateforme de ressources pour l&apos;amélioration des relations entre citoyens
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg">
                Découvrir les ressources
              </Button>
              <Button variant="outline" size="lg" className="bg-white text-primary border-white hover:bg-gray-100">
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section - Charte graphique */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Démonstration de la charte graphique
          </h2>

          {/* Badges */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Badges</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary">Primaire</Badge>
              <Badge variant="secondary">Secondaire</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="gray">Neutre</Badge>
              <Badge variant="success">Succès</Badge>
              <Badge variant="warning">Attention</Badge>
              <Badge variant="error">Erreur</Badge>
            </div>
          </div>

          {/* Buttons */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Boutons</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primaire</Button>
              <Button variant="secondary">Secondaire</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="outline">Contour</Button>
              <Button variant="primary" size="sm">Petit</Button>
              <Button variant="primary" size="lg">Grand</Button>
            </div>
          </div>

          {/* Cards */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Cartes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <h4 className="text-lg font-semibold text-primary mb-2">
                  Communication
                </h4>
                <p className="text-gray-600 mb-4">
                  Apprenez à mieux communiquer avec votre entourage
                </p>
                <Badge variant="primary" size="sm">12 ressources</Badge>
              </Card>
              <Card hover>
                <h4 className="text-lg font-semibold text-secondary mb-2">
                  Écoute active
                </h4>
                <p className="text-gray-600 mb-4">
                  Développez vos compétences d&apos;écoute
                </p>
                <Badge variant="secondary" size="sm">8 ressources</Badge>
              </Card>
              <Card hover>
                <h4 className="text-lg font-semibold text-accent-dark mb-2">
                  Empathie
                </h4>
                <p className="text-gray-600 mb-4">
                  Renforcez votre capacité d&apos;empathie
                </p>
                <Badge variant="accent" size="sm">15 ressources</Badge>
              </Card>
            </div>
          </div>

          {/* Forms */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Formulaires</h3>
            <Card className="max-w-md">
              <h4 className="text-lg font-semibold text-primary mb-4">
                Exemple de formulaire
              </h4>
              <div className="space-y-4">
                <Input
                  label="Nom complet"
                  placeholder="Votre nom"
                  type="text"
                />
                <Input
                  label="Email"
                  placeholder="votre@email.com"
                  type="email"
                />
                <Input
                  label="Message"
                  placeholder="Votre message"
                  error="Ce champ est requis"
                />
                <Button variant="primary" className="w-full">
                  Envoyer
                </Button>
              </div>
            </Card>
          </div>

          {/* Color palette */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Palette de couleurs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="bg-primary h-24 rounded-lg shadow-md mb-2"></div>
                <p className="text-sm font-medium text-gray-700">Primaire</p>
                <p className="text-xs text-gray-500">#1D3A6D</p>
              </div>
              <div>
                <div className="bg-secondary h-24 rounded-lg shadow-md mb-2"></div>
                <p className="text-sm font-medium text-gray-700">Secondaire</p>
                <p className="text-xs text-gray-500">#4CAF50</p>
              </div>
              <div>
                <div className="bg-accent h-24 rounded-lg shadow-md mb-2"></div>
                <p className="text-sm font-medium text-gray-700">Accent</p>
                <p className="text-xs text-gray-500">#FFC107</p>
              </div>
              <div>
                <div className="bg-gray-300 h-24 rounded-lg shadow-md mb-2"></div>
                <p className="text-sm font-medium text-gray-700">Gris</p>
                <p className="text-xs text-gray-500">#D1D5DB</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
