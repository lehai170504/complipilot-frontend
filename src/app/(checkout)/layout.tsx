import { ReactNode } from "react";
import Link from "next/link";
import { Package2 } from "lucide-react";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50/50">
            <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link
                        href="/billing"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <Package2 className="size-5" />
                        </div>
                        <span>CompliPilot</span>
                    </Link>
                </nav>
            </header>
            <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
