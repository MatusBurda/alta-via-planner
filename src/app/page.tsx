import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import RouteCard from "@/components/route-card";
import { featuredRoutes } from "@/lib/routes";

export const metadata: Metadata = {
    title: "Alta Via.OS — Plan Your Hut-to-Hut Trek",
    description:
        "Alpine refuges book out fast and must be reserved in order along the route. Check if your dates work, with auto-adjusted stages and hotel detours when huts are full.",
};

export default function LandingPage() {
    return (
        <main className="min-h-screen topo-grid">
            <div className="max-w-7xl mx-auto px-6 pb-16">
                <SiteHeader />

                <section className="mt-8 md:mt-16 mb-16 md:mb-24">
                    <p className="meta-mono mb-4">
                        Hut-to-hut trek planner
                    </p>

                    <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-none text-balance max-w-[22ch] mb-6">
                        Plan your hut-to-hut alpine traverse with ease
                    </h1>

                    <p className="text-lg text-mute max-w-[56ch] text-pretty leading-relaxed">
                        Alpine refuges book out months ahead — and each night depends on the one
                        before. Enter your dates and pace to see in seconds whether the route is
                        actually possible. We rebalance stages and route via nearby hotels when beds
                        run out.
                    </p>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="section-mono">
                            Featured routes
                        </h2>
                        <span className="label-mono">
                            {featuredRoutes.filter((r) => r.available).length} of{" "}
                            {featuredRoutes.length} bookable
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {featuredRoutes.map((route) => (
                            <RouteCard key={route.id} route={route} />
                        ))}
                    </div>
                </section>

                <footer className="mt-24 pt-8 border-t border-summit/5">
                    <p className="text-sm text-mute leading-relaxed max-w-[60ch]">
                        Itineraries are built dynamically from your fitness level, dates, and
                        simulated hut availability — no spreadsheets required.
                    </p>
                </footer>
            </div>
        </main>
    );
}
