import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

/**
 * Landing-page entry point to /vibe-coders.
 *
 * Deliberately a thin band rather than a full section: the audience it targets
 * is a slice of the landing page's readers, not all of them, so it should be
 * skippable by everyone else in one scroll.
 *
 * No vertical padding of its own. It sits between two `py-24` sections on the
 * landing page, which already give it 96px of breathing room on each side.
 */
export default function VibeCodersCallout() {
    return (
        <section>
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                <Link
                    href="/vibe-coders"
                    className="group flex flex-col gap-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 transition-all hover:border-neutral-300 hover:bg-white hover:shadow-lg sm:flex-row sm:items-center sm:gap-6 sm:p-7"
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white">
                        <Terminal className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">
                            Building with Cursor, Claude Code, or Lovable?
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                            Shipping was never your problem. Knowing what to ship is. There is a version
                            of this page written for you, and the setup is one prompt you paste into
                            your agent.
                        </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 transition-all group-hover:gap-2.5">
                        Read it
                        <ArrowRight className="h-4 w-4" />
                    </span>
                </Link>
            </div>
        </section>
    );
}
