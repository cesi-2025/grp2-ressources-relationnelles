import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-primary-light text-white py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <Badge variant="accent" className="mb-6 text-base py-2 px-6">
              Plateforme citoyenne
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              (RE)Sources<br />Relationnelles
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Développez vos compétences relationnelles pour améliorer
              vos interactions avec les autres
            </p>
            <p className="text-lg mb-8 text-gray-200 max-w-2xl mx-auto">
              Une bibliothèque de ressources accessibles à tous pour construire
              des relations plus harmonieuses au quotidien
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/ressources">
                <Button variant="accent" size="lg" className="min-w-[200px]">
                  📚 Découvrir les ressources
                </Button>
              </Link>
              <Link href="/presentation">
                <Button variant="outline" size="lg" className="bg-white text-primary border-white hover:bg-gray-100 min-w-[200px]">
                  En savoir plus
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12 pt-8 border-t border-white/20">
              <div>
                <div className="text-4xl font-bold text-accent mb-1">60+</div>
                <div className="text-sm text-gray-200">Ressources</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-1">6</div>
                <div className="text-sm text-gray-200">Catégories</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-1">100%</div>
                <div className="text-sm text-gray-200">Gratuit</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Catégories populaires
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explorez nos ressources classées par thématiques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/ressources?category=communication">
              <Card hover className="h-full">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Communication
                </h3>
                <p className="text-gray-600 mb-4">
                  Apprenez à mieux communiquer et à vous exprimer clairement
                </p>
                <Badge variant="primary" size="sm">12 ressources</Badge>
              </Card>
            </Link>
            
            <Link href="/ressources?category=ecoute">
              <Card hover className="h-full">
                <div className="text-4xl mb-4">👂</div>
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  Écoute active
                </h3>
                <p className="text-gray-600 mb-4">
                  Développez vos compétences d&apos;écoute et de compréhension
                </p>
                <Badge variant="secondary" size="sm">8 ressources</Badge>
              </Card>
            </Link>
            
            <Link href="/ressources?category=empathie">
              <Card hover className="h-full">
                <div className="text-4xl mb-4">❤️</div>
                <h3 className="text-xl font-semibold text-accent-dark mb-2">
                  Empathie
                </h3>
                <p className="text-gray-600 mb-4">
                  Renforcez votre capacité à comprendre les autres
                </p>
                <Badge variant="accent" size="sm">15 ressources</Badge>
              </Card>
            </Link>
            
            <Link href="/ressources?category=conflits">
              <Card hover className="h-full">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Gestion des conflits
                </h3>
                <p className="text-gray-600 mb-4">
                  Apprenez à gérer et résoudre les désaccords
                </p>
                <Badge variant="primary" size="sm">10 ressources</Badge>
              </Card>
            </Link>
            
            <Link href="/ressources?category=intelligence-emotionnelle">
              <Card hover className="h-full">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  Intelligence émotionnelle
                </h3>
                <p className="text-gray-600 mb-4">
                  Maîtrisez vos émotions et celles des autres
                </p>
                <Badge variant="secondary" size="sm">7 ressources</Badge>
              </Card>
            </Link>
            
            <Link href="/ressources?category=collaboration">
              <Card hover className="h-full">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-xl font-semibold text-accent-dark mb-2">
                  Collaboration
                </h3>
                <p className="text-gray-600 mb-4">
                  Travaillez efficacement en équipe et en groupe
                </p>
                <Badge variant="accent" size="sm">9 ressources</Badge>
              </Card>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link href="/ressources">
              <Button variant="primary" size="lg">
                Voir toutes les catégories →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Commencez votre parcours en 3 étapes simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Créez votre compte
              </h3>
              <p className="text-gray-600">
                Inscrivez-vous gratuitement en quelques secondes pour accéder à toutes les ressources
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary text-white rounded-full text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Explorez les ressources
              </h3>
              <p className="text-gray-600">
                Parcourez notre bibliothèque et trouvez les contenus adaptés à vos besoins
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent text-gray-900 rounded-full text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Progressez à votre rythme
              </h3>
              <p className="text-gray-600">
                Suivez votre progression et développez vos compétences relationnelles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à améliorer vos relations ?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Rejoignez notre communauté et accédez gratuitement à plus de 60 ressources
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/inscription">
              <Button variant="accent" size="lg" className="min-w-[200px]">
                Créer un compte gratuit
              </Button>
            </Link>
            <Link href="/presentation">
              <Button variant="outline" size="lg" className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary min-w-[200px]">
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
