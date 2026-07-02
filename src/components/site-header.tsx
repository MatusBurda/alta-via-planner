import Link from "next/link";

interface SiteHeaderProps {
    tagline?: string;
}

export default function SiteHeader({ tagline = "Live hut feed" }: SiteHeaderProps) {
    return (
        <header className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="size-2 bg-summit rotate-45 shrink-0 transition-transform group-hover:scale-110" />
                <span className="font-mono text-sm font-semibold tracking-tighter uppercase">
                    Alta Via.OS
                </span>
            </Link>

            {tagline && (
                <span className="hidden sm:flex items-center gap-2 meta-mono">
                    <span className="size-1.5 rounded-full bg-glacier animate-pulse" />
                    {tagline}
                </span>
            )}
        </header>
    );
}
