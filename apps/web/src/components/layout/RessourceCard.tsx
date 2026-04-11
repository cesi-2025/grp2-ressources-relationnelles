import { Resource } from "@/lib/api";

export default function ResourceCard({
  resource,
  actionLabel,
  actionStyle,
  onAction,
}: {
  resource: Resource;
  actionLabel: string;
  actionStyle: React.CSSProperties;
  onAction: (id: number) => void;
}) {
  return (
    <div style={s.resourceCard}>
      <div>
        <p style={s.resourceTitle}>{resource.title}</p>
        <p style={s.resourceMeta}>
          {new Date(resource.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
      </div>
      <div style={s.resourceActions}>
        <button style={actionStyle} onClick={() => onAction(resource.id)}>
          {actionLabel}
        </button>
      </div>
    </div>
  );
}