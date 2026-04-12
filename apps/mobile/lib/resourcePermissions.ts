export function canEditResource(args: {
  isLoggedIn: boolean;
  userId?: number;
  ownerId?: number;
}): boolean {
  const { isLoggedIn, userId, ownerId } = args;
  if (!isLoggedIn || typeof userId !== "number") return false;
  return typeof ownerId === "number" && userId === ownerId;
}

export function canComment(args: {
  isLoggedIn: boolean;
  token: string | null;
}): boolean {
  return args.isLoggedIn && Boolean(args.token);
}

export function canCreateResource(args: {
  isLoggedIn: boolean;
  token: string | null;
}): boolean {
  return args.isLoggedIn && Boolean(args.token);
}

export function canManageFavorites(args: {
  isLoggedIn: boolean;
  token: string | null;
}): boolean {
  return args.isLoggedIn && Boolean(args.token);
}
