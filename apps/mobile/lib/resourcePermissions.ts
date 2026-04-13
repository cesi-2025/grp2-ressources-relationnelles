// Edition autorisée uniquement pour le propriétaire (aligné sur ResourcePolicy côté API).
export function canEditResource(args: {
  isLoggedIn: boolean;
  userId?: number;
  ownerId?: number;
}): boolean {
  if (!args.isLoggedIn) return false;
  const uid =
    args.userId === null || args.userId === undefined
      ? NaN
      : Number(args.userId);
  const oid =
    args.ownerId === null || args.ownerId === undefined
      ? NaN
      : Number(args.ownerId);
  if (!Number.isFinite(uid) || !Number.isFinite(oid)) {
    return false;
  }
  return uid === oid;
}

// Commentaires et réponses nécessitent une session active et un token.
export function canComment(args: {
  isLoggedIn: boolean;
  token: string | null;
}): boolean {
  return args.isLoggedIn && Boolean(args.token);
}
// Création de ressource nécessite une session active et un token.
export function canCreateResource(
  args: {
    isLoggedIn: boolean;
    token: string | null;
  },
): args is { isLoggedIn: true; token: string } {
  return (
    args.isLoggedIn === true &&
    typeof args.token === "string" &&
    args.token.length > 0
  );
}
// Gestion des favoris nécessite une session active et un token.
export function canManageFavorites(args: {
  isLoggedIn: boolean;
  token: string | null;
}): boolean {
  return args.isLoggedIn && Boolean(args.token);
}
