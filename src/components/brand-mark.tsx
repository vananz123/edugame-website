import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/edugame-logo.png"
      alt=""
      width={72}
      height={72}
      priority
      className={cn("size-9 shrink-0", className)}
    />
  );
}
