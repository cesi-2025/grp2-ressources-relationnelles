import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import type { Resource } from "@/lib/api";

interface ResourceCardProps {
  resource: Resource;
}

function getCategoryVariant(category: string): "primary" | "secondary" | "accent" {
  if (category === "Communication" || category === "Gestion des conflits") {
    return "primary";
  }
  if (category === "Écoute active" || category === "Intelligence émotionnelle") {
    return "secondary";
  }
  return "accent";
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const categoryName = resource.category?.name ?? "Sans catégorie";
  const categoryVariant = getCategoryVariant(categoryName);

  return (
    <Card hover className="h-full flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 leading-snug">{resource.title}</h3>
        <Badge variant={categoryVariant} size="sm">
          {categoryName}
        </Badge>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-grow">{resource.content}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {resource.relation_type && (
          <Badge variant="gray" size="sm">
            {resource.relation_type.name}
          </Badge>
        )}
        {resource.resource_type && (
          <Badge variant="warning" size="sm">
            {resource.resource_type.name}
          </Badge>
        )}
      </div>

      <div className="text-xs text-gray-500 mb-3">
        Publié le {new Date(resource.created_at).toLocaleDateString("fr-FR")}
      </div>

      <Link
        href={`/ressources/${resource.id}`}
        className="text-sm font-medium text-primary hover:underline"
      >
        Voir le détail →
      </Link>
    </Card>
  );
}
