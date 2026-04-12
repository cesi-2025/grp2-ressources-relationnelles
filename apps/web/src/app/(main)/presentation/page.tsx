import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function PresentationPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary-light text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            À propos de (RE)Sources Relationnelles
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl">
            Une plateforme innovante dédiée à l&apos;amélioration des relations entre citoyens
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-primary mb-6">Notre mission</h2>
            <Card>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                (RE)Sources Relationnelles est une plateforme qui vise à fournir des outils et des ressources
                pour améliorer la qualité des relations interpersonnelles dans notre société.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Nous croyons que des relations saines et constructives sont essentielles au bien-être
                individuel et collectif. Notre plateforme met à disposition des contenus pédagogiques,
                des exercices pratiques et des outils pour développer des compétences relationnelles.
              </p>
            </Card>
          </div>

          {/* Valeurs */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-primary mb-6">Nos valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="flex items-center mb-3">
                  <Badge variant="primary">1</Badge>
                  <h3 className="text-xl font-semibold text-gray-800 ml-3">
                    Bienveillance
                  </h3>
                </div>
                <p className="text-gray-600">
                  Nous prônons l&apos;écoute active et le respect mutuel dans toutes les interactions.
                </p>
              </Card>
              <Card>
                <div className="flex items-center mb-3">
                  <Badge variant="secondary">2</Badge>
                  <h3 className="text-xl font-semibold text-gray-800 ml-3">
                    Inclusion
                  </h3>
                </div>
                <p className="text-gray-600">
                  Nos ressources sont accessibles à tous, sans discrimination.
                </p>
              </Card>
              <Card>
                <div className="flex items-center mb-3">
                  <Badge variant="accent">3</Badge>
                  <h3 className="text-xl font-semibold text-gray-800 ml-3">
                    Partage
                  </h3>
                </div>
                <p className="text-gray-600">
                  Nous encourageons le partage de connaissances et d&apos;expériences.
                </p>
              </Card>
            </div>
          </div>

          {/* Fonctionnalités */}
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">Fonctionnalités</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card hover>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  📚 Bibliothèque de ressources
                </h3>
                <p className="text-gray-600">
                  Accédez à une large collection d&apos;articles, vidéos et exercices pratiques
                  pour développer vos compétences relationnelles.
                </p>
              </Card>
              <Card hover>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  🎯 Parcours personnalisés
                </h3>
                <p className="text-gray-600">
                  Suivez votre progression et bénéficiez de recommandations adaptées
                  à vos besoins spécifiques.
                </p>
              </Card>
              <Card hover>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  💬 Espace communautaire
                </h3>
                <p className="text-gray-600">
                  Échangez avec d&apos;autres citoyens et partagez vos expériences
                  dans un environnement bienveillant.
                </p>
              </Card>
              <Card hover>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  ♿ Accessible à tous
                </h3>
                <p className="text-gray-600">
                  Notre plateforme respecte les normes RGAA pour garantir
                  l&apos;accessibilité au plus grand nombre.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
