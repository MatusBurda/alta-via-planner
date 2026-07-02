import Image from "next/image";
import Link from "next/link";

export interface RouteCardData {
    id: string;
    region: string;
    difficulty: string;
    tagline: string;
    name: string;
    distance: string;
    ascent: string;
    duration: string;
    months: string[];
    href?: string;
    available: boolean;
    imageSrc?: string;
}

interface RouteCardProps {
    route: RouteCardData;
}

type DifficultyTone = "glacier" | "warn" | "alert";

const difficultyToneStyles: Record<DifficultyTone, string> = {
    glacier: "text-glacier bg-glacier/10 ring-glacier/20",
    warn: "text-warn bg-warn/10 ring-warn/20",
    alert: "text-alert bg-alert/10 ring-alert/20",
};

function getDifficultyTone(difficulty: string): DifficultyTone {
    switch (difficulty.toLowerCase()) {
        case "strenuous":
        case "extreme":
            return "alert";
        case "challenging":
        case "hard":
            return "warn";
        default:
            return "glacier";
    }
}

function DifficultyTag({ difficulty }: { difficulty: string }) {
    const tone = getDifficultyTone(difficulty);

    return (
        <span
            className={`tag-mono px-2 py-1 rounded ring-1 shrink-0 justify-self-end self-start ${difficultyToneStyles[tone]}`}
        >
            {difficulty}
        </span>
    );
}

function RouteCardVisual({ imageSrc, name }: { imageSrc?: string; name: string }) {
    return (
        <div className="relative h-full w-full overflow-hidden rounded-sm bg-summit ring-1 ring-summit/5">
            {imageSrc ? (
                <Image
                    src={imageSrc}
                    alt={`${name} route map`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 140px, (max-width: 1024px) 160px, 180px"
                />
            ) : null}
        </div>
    );
}

export default function RouteCard({ route }: RouteCardProps) {
    return (
        <article className="flex flex-col bg-paper ring-1 ring-summit/15 rounded-lg shadow-[0_1px_0_rgba(9,9,11,0.04)] overflow-hidden transition-all hover:ring-summit/30">
            <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-4 p-5 pb-0">
                <span className="meta-mono text-faint min-w-0">
                    {route.region}
                </span>

                <DifficultyTag difficulty={route.difficulty} />

                <div className="flex flex-col gap-4 min-w-0">
                    <div>
                        <p className="text-xs text-mute mb-1">{route.tagline}</p>
                        <h2 className="text-2xl font-semibold tracking-tight leading-tight">
                            {route.name}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 data-mono font-medium">
                        <span>{route.distance}</span>
                        <span className="text-faint font-normal">{route.ascent}</span>
                        <span className="text-faint font-normal">{route.duration}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {route.months.map((month) => (
                            <span
                                key={month}
                                className="tag-mono text-mute bg-base px-2 py-0.5 rounded ring-1 ring-summit/5"
                            >
                                {month}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="relative h-full aspect-square min-h-[8.5rem] justify-self-end self-end">
                    <RouteCardVisual imageSrc={route.imageSrc} name={route.name} />
                </div>
            </div>

            <div className="px-5 pb-5 pt-4">
                {route.available && route.href ? (
                    <Link
                        href={route.href}
                        className="block w-full text-center text-sm font-medium bg-summit text-base px-4 py-2.5 rounded-sm ring-1 ring-summit hover:bg-ink transition-colors"
                    >
                        Start planning
                    </Link>
                ) : (
                    <span className="block w-full text-center tag-mono text-faint bg-base px-4 py-2.5 rounded-sm ring-1 ring-summit/5 cursor-not-allowed">
                        Coming soon
                    </span>
                )}
            </div>
        </article>
    );
}
