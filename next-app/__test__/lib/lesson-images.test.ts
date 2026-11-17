/**
 * @jest-environment node
 */
import { lessonImageNames, orphanImages, removedImages } from "@/lib/lesson-images";

const A = "11111111-2222-4333-8444-555555555555.webp";
const B = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee.png";
const C = "99999999-8888-4777-8666-555555555555.webp";

const doc = (...nodes: unknown[]) => ({ type: "doc", content: nodes });
const image = (name: string, domain = "http://localhost:8000") => ({
  type: "image",
  attrs: { src: `${domain}/lesson/${name}` },
});

describe("lessonImageNames", () => {
  it("trouve la bannière et les images du contenu, même imbriquées", () => {
    const content = doc(image(A), {
      type: "table",
      content: [{ type: "tableRow", content: [{ type: "tableCell", content: [image(B)] }] }],
    });
    const names = lessonImageNames({ imageBanner: `http://upload-service:8000/lesson/${C}`, content });
    expect(names).toEqual(new Set([A, B, C]));
  });

  it("accepte un contenu déjà sérialisé", () => {
    expect(lessonImageNames({ content: JSON.stringify(doc(image(A))) })).toEqual(new Set([A]));
  });

  it("ignore les avatars et les images externes", () => {
    const content = doc(
      { type: "image", attrs: { src: `http://localhost:8000/avatar/${A}` } },
      { type: "image", attrs: { src: "https://exemple.com/photo.png" } }
    );
    expect(lessonImageNames({ imageBanner: null, content })).toEqual(new Set());
  });
});

it("removedImages renvoie les images retirées", () => {
  expect(removedImages(new Set([A, B]), new Set([B, C]))).toEqual(new Set([A]));
});

describe("orphanImages", () => {
  const now = new Date("2026-11-17T12:00:00Z");
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600_000);

  it("ne supprime que les images inutilisées et plus anciennes que le délai de grâce", () => {
    const stored = [
      { name: A, modifiedAt: hoursAgo(48) }, // utilisée : gardée
      { name: B, modifiedAt: hoursAgo(48) }, // orpheline ancienne : supprimée
      { name: C, modifiedAt: hoursAgo(1) }, // orpheline récente (leçon en cours) : gardée
    ];
    expect(orphanImages(stored, new Set([A]), { now, graceMs: 24 * 3600_000 })).toEqual([B]);
  });
});
