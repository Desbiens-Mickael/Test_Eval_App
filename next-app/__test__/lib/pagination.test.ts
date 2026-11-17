/**
 * @jest-environment node
 */
import { facetCounts, orderByFrom, paginate, parsePageQuery } from "@/lib/pagination";

describe("parsePageQuery", () => {
  it("applique les valeurs par défaut", () => {
    expect(parsePageQuery()).toEqual({ page: 1, pageSize: 10 });
  });

  it("nettoie la recherche", () => {
    expect(parsePageQuery({ search: "  Léa " }).search).toBe("Léa");
    expect(parsePageQuery({ search: "   " }).search).toBeUndefined();
  });

  it("refuse une page ou une taille invalide", () => {
    expect(() => parsePageQuery({ page: 0 })).toThrow();
    expect(() => parsePageQuery({ pageSize: 500 })).toThrow();
    expect(() => parsePageQuery({ page: 1.5 })).toThrow();
  });
});

describe("paginate", () => {
  const find = jest.fn(async ({ skip, take }: { skip: number; take: number }) =>
    Array.from({ length: take }, (_, i) => skip + i)
  );
  beforeEach(() => find.mockClear());

  it("charge uniquement la page demandée", async () => {
    const page = await paginate({ page: 2, pageSize: 10 }, async () => 25, find);
    expect(find).toHaveBeenCalledWith({ skip: 10, take: 10 });
    expect(page).toMatchObject({ total: 25, page: 2, pageSize: 10, pageCount: 3 });
  });

  it("ramène une page trop loin à la dernière", async () => {
    const page = await paginate({ page: 9, pageSize: 10 }, async () => 25, find);
    expect(find).toHaveBeenCalledWith({ skip: 20, take: 10 });
    expect(page.page).toBe(3);
  });

  it("ne lance pas de requête quand il n'y a rien", async () => {
    const page = await paginate({ page: 1, pageSize: 10 }, async () => 0, find);
    expect(find).not.toHaveBeenCalled();
    expect(page).toEqual({ items: [], total: 0, page: 1, pageSize: 10, pageCount: 1 });
  });
});

describe("orderByFrom", () => {
  type OrderBy = { name?: "asc" | "desc"; createdAt?: "asc" | "desc" };
  const columns = { Nom: (d: "asc" | "desc"): OrderBy => ({ name: d }) };

  it("trie sur une colonne prévue, puis par identifiant", () => {
    expect(orderByFrom<OrderBy>({ id: "Nom", desc: true }, columns, { createdAt: "desc" })).toEqual([
      { name: "desc" },
      { id: "asc" },
    ]);
  });

  it("ignore une colonne inconnue", () => {
    expect(orderByFrom<OrderBy>({ id: "password", desc: false }, columns, { createdAt: "desc" })).toEqual([
      { createdAt: "desc" },
      { id: "asc" },
    ]);
  });
});

it("facetCounts compte chaque valeur", async () => {
  const counts = await facetCounts(["Facile", "Difficile"], async (v) => v.length);
  expect(counts).toEqual({ Facile: 6, Difficile: 9 });
});
