import WorkspaceClient from "@/components/workspace/WorkspaceClient";

export default async function TickerPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  return <WorkspaceClient initialTicker={ticker.toUpperCase()} />;
}
