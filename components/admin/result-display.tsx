"use client";

interface ResultDisplayProps {
  metadata: {
    title: string;
    description: string;
    favicon: string;
    ogImage: string;
    url: string;
  } | null;
  error: string | null;
}

export function ResultDisplay({ metadata, error }: ResultDisplayProps) {
  if (error) {
    return (
      <div className="rounded-lg border border-destructive p-4">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (!metadata) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        {metadata.favicon && (
          <img
            src={metadata.favicon}
            alt="Site favicon"
            width={16}
            height={16}
            className="h-4 w-4"
          />
        )}
        <h3 className="font-medium">{metadata.title}</h3>
      </div>

      {metadata.description && (
        <p className="text-sm text-muted-foreground">{metadata.description}</p>
      )}

      {metadata.ogImage && (
        <img
          src={metadata.ogImage}
          alt="Open Graph preview"
          width={300}
          height={200}
          className="rounded-lg"
        />
      )}

      <p className="text-xs text-muted-foreground">{metadata.url}</p>
    </div>
  );
}
