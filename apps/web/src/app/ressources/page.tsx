import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function RessourcesPage() {
  const categories = [
    { id: 1, name: "Communication", count: 12, color: "primary" },
    { id: 2, name: "Écoute active", count: 8, color: "secondary" },
    { id: 3, name: "Empathie", count: 15, color: "accent" },
    { id: 4, name: "Gestion des conflits", count: 10, color: "primary" },
    { id: 5, name: "Intelligence émotionnelle", count: 7, color: "secondary" },
    { id: 6, name: "Collaboration", count: 9, color: "accent" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Ressources Relationnelles
          </h1>
          <p className="text-xl text-gray-600">
            Découvrez nos ressources pour améliorer vos relations avec les autres
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} hover className="cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {category.name}
                </h3>
                <Badge variant={category.color as any} size="sm">
                  {category.count}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">
                Explorez les ressources pour développer vos compétences en {category.name.toLowerCase()}
              </p>
              <button className="text-primary font-medium hover:underline">
                Voir les ressources →
              </button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
