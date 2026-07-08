import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ResourceCard from "@/components/resources/ResourceCard";
import Pagination from "@/components/resources/Pagination";
import type { Resource } from "@/lib/api";

// Étend Vitest avec le matcher axe (toHaveNoViolations).
expect.extend(matchers);

// Audit d'accessibilité automatisé (axe-core / RGAA — sous-ensemble automatisable).
// Complète les tests manuels de navigation clavier / lecteur d'écran documentés
// dans le dossier technique (§1.5). Chaque composant clé rendu ne doit produire
// aucune violation détectable par axe.

function makeResource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 1,
    title: "Ressource de test",
    content: "Contenu de la ressource.",
    status: "published",
    is_public: true,
    user_id: 1,
    category_id: 1,
    relation_type_id: 1,
    resource_type_id: 1,
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    category: { id: 1, name: "Communication" },
    relation_type: { id: 1, name: "Professionnelle" },
    resource_type: { id: 1, name: "Article" },
    user: { id: 1, name: "Alice" },
    ...overrides,
  };
}

describe("Accessibilité (axe-core)", () => {
  it("Button n'a aucune violation", async () => {
    const { container } = render(<Button>Envoyer</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Input avec label n'a aucune violation", async () => {
    const { container } = render(
      <Input id="email" label="Adresse email" type="email" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Input en erreur n'a aucune violation", async () => {
    const { container } = render(
      <Input id="pwd" label="Mot de passe" type="password" error="Champ requis" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("ResourceCard n'a aucune violation", async () => {
    const { container } = render(<ResourceCard resource={makeResource()} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Pagination n'a aucune violation", async () => {
    const { container } = render(
      <Pagination page={2} pageCount={5} onPageChange={() => {}} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
