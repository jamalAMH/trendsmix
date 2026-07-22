import { getSetting } from "@/lib/settings";
import AdSlot from "./AdSlot";

interface ArticleAdProps {
  className?: string;
}

export default async function ArticleAd({ className }: ArticleAdProps) {
  const [clientId, slot] = await Promise.all([
    getSetting("adsense_client_id"),
    getSetting("adsense_slot_id"),
  ]);

  if (!clientId || !slot) return null;

  const normalizedClientId = clientId.startsWith("ca-")
    ? clientId
    : `ca-${clientId}`;

  return (
    <div className={className}>
      <span className="mb-1 block text-center text-[10px] font-medium uppercase tracking-wider text-zinc-600">
        Advertisement
      </span>
      <AdSlot clientId={normalizedClientId} slot={slot} />
    </div>
  );
}
