import { useNotificationStream } from "@/hooks/use-notification-stream";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";

class FakeEventSource {
  static last: FakeEventSource;
  listeners: Record<string, (() => void)[]> = {};
  closed = false;
  constructor(public url: string) {
    FakeEventSource.last = this;
  }
  addEventListener(type: string, listener: () => void) {
    (this.listeners[type] ??= []).push(listener);
  }
  emit(type: string) {
    this.listeners[type]?.forEach((listener) => listener());
  }
  close() {
    this.closed = true;
  }
}

beforeAll(() => {
  (globalThis as unknown as { EventSource: unknown }).EventSource = FakeEventSource;
});

it("relit les notifications à chaque événement et après une reconnexion", () => {
  const queryClient = new QueryClient();
  const invalidate = jest.spyOn(queryClient, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const { unmount } = renderHook(() => useNotificationStream(), { wrapper });
  const source = FakeEventSource.last;
  expect(source.url).toBe("/api/notifications/stream");

  source.emit("ready"); // première connexion : la liste vient d'être chargée
  expect(invalidate).not.toHaveBeenCalled();

  source.emit("notification");
  expect(invalidate).toHaveBeenCalledWith({ queryKey: ["notifications"] });

  source.emit("ready"); // reconnexion après coupure : rattrapage
  expect(invalidate).toHaveBeenCalledTimes(2);

  unmount();
  expect(source.closed).toBe(true);
});
