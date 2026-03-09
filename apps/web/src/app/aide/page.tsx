import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AidePage() {
  const faqItems = [
    {
      question: "Comment créer un compte ?",
      answer: "Cliquez sur le bouton 'Inscription' en haut à droite, puis remplissez le formulaire avec vos informations. Vous recevrez un email de confirmation.",
    },
    {
      question: "Les ressources sont-elles gratuites ?",
      answer: "Oui, toutes les ressources de base sont gratuites et accessibles à tous les utilisateurs inscrits.",
    },
    {
      question: "Comment rechercher une ressource spécifique ?",
      answer: "Utilisez la barre de recherche sur la page Ressources, ou naviguez par catégorie pour trouver ce que vous cherchez.",
    },
    {
      question: "Puis-je contribuer des ressources ?",
      answer: "Oui ! Les citoyens peuvent proposer des ressources qui seront modérées avant publication. Connectez-vous pour accéder à cette fonctionnalité.",
    },
    {
      question: "La plateforme est-elle accessible aux personnes en situation de handicap ?",
      answer: "Oui, notre plateforme respecte les normes RGAA (Référentiel Général d'Amélioration de l'Accessibilité) pour garantir l'accessibilité à tous.",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Centre d&apos;aide
          </h1>
          <p className="text-xl text-gray-600">
            Trouvez des réponses à vos questions ou contactez-nous
          </p>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index}>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600">{item.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Besoin d&apos;aide supplémentaire ?
          </h2>
          <Card>
            <p className="text-gray-600 mb-6">
              Si vous ne trouvez pas de réponse à votre question, n&apos;hésitez pas
              à nous contacter. Notre équipe vous répondra dans les plus brefs délais.
            </p>
            <form className="space-y-4">
              <Input
                label="Nom complet"
                type="text"
                placeholder="Votre nom"
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="votre@email.com"
                required
              />
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm">
                  <option>Question technique</option>
                  <option>Problème de compte</option>
                  <option>Suggestion</option>
                  <option>Autre</option>
                </select>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Décrivez votre problème ou votre question..."
                  required
                ></textarea>
              </div>
              <Button variant="primary" className="w-full" type="submit">
                Envoyer le message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
