export default function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
      {message}
    </div>
  );
}
