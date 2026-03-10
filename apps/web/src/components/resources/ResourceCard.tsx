import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import type { ResourceItem } from "@/data/resources";

interface ResourceCardProps {
  resource: ResourceItem;
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
  const categoryVariant = getCategoryVariant(resource.category);

  return (
    <Card hover className="h-full flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 leading-snug">{resource.title}</h3>
        <Badge variant={categoryVariant} size="sm">
          {resource.category}
        </Badge>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-grow">{resource.excerpt}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="gray" size="sm">
          {resource.relationType}
        </Badge>
        <Badge variant="warning" size="sm">
          {resource.resourceType}
        </Badge>
      </div>

      <div className="text-xs text-gray-500 mb-3">
        Publié le {new Date(resource.createdAt).toLocaleDateString("fr-FR")}
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
