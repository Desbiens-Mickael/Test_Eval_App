/**
 * @jest-environment node
 */
import { GET } from "@/app/api/upload/[kind]/[image]/route";

jest.mock("server-only", () => ({}));
jest.mock("@/lib/auth", () => ({ currentUser: jest.fn() }));
jest.mock("@/data/lesson/lesson-images.data", () => ({ getUsedLessonImagesData: jest.fn() }));
jest.mock("@/data/student-data", () => ({ getStudentByIdData: jest.fn() }));
jest.mock("@/data/user-data", () => ({ getUserByIdData: jest.fn() }));

const IMAGE = "11111111-2222-4333-8444-555555555555.webp";
const AUDIO = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee.wav";
const fetchMock = jest.fn();

const get = (kind: string, image: string, headers?: HeadersInit) =>
  GET(new Request(`http://app.test/api/upload/${kind}/${image}`, { headers }), {
    params: { kind, image },
  });

beforeEach(() => {
  process.env.UPLOAD_API_URL = "http://upload-service:8000/";
  process.env.UPLOAD_API_KEY = "cle";
  fetchMock.mockReset();
  global.fetch = fetchMock;
});

describe("GET /api/upload/[kind]/[image]", () => {
  it("relaie le fichier du service avec le bon type et un cache long", async () => {
    fetchMock.mockResolvedValue(
      new Response("webp", {
        status: 200,
        headers: { "content-type": "text/plain; charset=utf-8", "content-length": "4" },
      })
    );

    const response = await get("lesson", IMAGE);

    expect(fetchMock).toHaveBeenCalledWith(
      `http://upload-service:8000/lesson/${IMAGE}`,
      expect.objectContaining({ headers: undefined })
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/webp");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("cache-control")).toContain("immutable");
    expect(await response.text()).toBe("webp");
  });

  it("transmet la plage demandée pour l'audio des dictées", async () => {
    fetchMock.mockResolvedValue(
      new Response("RIFF", {
        status: 206,
        headers: { "content-range": "bytes 0-3/2000", "accept-ranges": "bytes" },
      })
    );

    const response = await get("dictation", AUDIO, { range: "bytes=0-3" });

    expect(fetchMock).toHaveBeenCalledWith(
      `http://upload-service:8000/dictation/${AUDIO}`,
      expect.objectContaining({ headers: { range: "bytes=0-3" } })
    );
    expect(response.status).toBe(206);
    expect(response.headers.get("content-range")).toBe("bytes 0-3/2000");
    expect(response.headers.get("content-type")).toBe("audio/wav");
  });

  it.each([
    ["type inconnu", "secret", IMAGE],
    ["nom invalide", "lesson", "..%2F..%2Fetc%2Fpasswd"],
  ])("refuse un %s sans appeler le service", async (_label, kind, image) => {
    const response = await get(kind, image);
    expect(response.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("renvoie 404 si le fichier est absent ou le service injoignable", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 404 }));
    expect((await get("avatar", IMAGE)).status).toBe(404);

    fetchMock.mockRejectedValueOnce(new Error("ECONNREFUSED"));
    expect((await get("avatar", IMAGE)).status).toBe(404);
  });
});
