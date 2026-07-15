import { PERKS, steps } from "@/lib/data/data";
import { Link } from "@/i18n/navigation";

export function LoginPanel() {
    return (
        <div className="hidden lg:flex flex-col justify-between bg-forest-900 text-white p-12 relative overflow-hidden">
            {/* Background texture */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[500px] h-[500px] rounded-full opacity-10 bg-white blur-[120px] -top-40 -left-40" />
                <div className="absolute w-[300px] h-[300px] rounded-full opacity-10 bg-white blur-[80px] bottom-0 right-0" />
                {/* Dot grid */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1.5" fill="white" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
            </div>

            {/* Logo */}
            <div className="relative z-10">
                <Link href="/" className="text-white no-underline">
                    <div className="font-serif text-2xl font-light tracking-tight">
                        Le<span className="text-[#9ECC60]">Guide</span>
                    </div>
                    <div className="text-white/40 text-xs mt-1 tracking-widest uppercase">
                        Student Admin Guide
                    </div>
                </Link>
            </div>

            {/* Progress preview card */}
            <div className="relative z-10 space-y-4">
                <div className="text-white/50 text-xs tracking-widest uppercase mb-6">
                    Your progress overview
                </div>

                <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-4">
                    {steps.map((step) => (
                        <div key={step.label}>
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[13px] text-white/80">{step.label}</span>
                                <span className="text-[12px] font-medium" style={{ color: step.pct > 0 ? step.color : "rgba(255,255,255,0.3)" }}>
                                    {step.pct}%
                                </span>
                            </div>
                            <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${step.pct}%`, background: step.color }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Urgent callout */}
                <div className="flex items-start gap-3 bg-coral-600/20 border border-coral-400/30 rounded-xl p-4">
                    <div className="w-6 h-6 rounded-full bg-coral-400/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-coral-200 text-xs font-bold">!</span>
                    </div>
                    <div>
                        <p className="text-coral-200 text-sm font-medium">OFII deadline approaching</p>
                        <p className="text-coral-300/70 text-xs mt-0.5 leading-relaxed">
                            Validate your visa within 3 months of arrival to avoid legal issues.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quote */}
            <div className="relative z-10">
                <blockquote className="text-white/60 text-sm leading-relaxed italic font-serif font-light">
                    &ldquo;LeGuide saved me hours of confusion. I knew exactly what to do, in what order, from day one.&rdquo;
                </blockquote>
                <div className="flex items-center gap-2.5 mt-4">
                    <div className="w-7 h-7 rounded-full bg-forest-50 flex items-center justify-center text-[10px] font-medium text-forest-600">
                        YK
                    </div>
                    <div>
                        <p className="text-white/70 text-xs font-medium">Yuki Kobayashi</p>
                        <p className="text-white/40 text-xs">Sorbonne, Paris</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function RegisterPanel() {
    return (
        <div className="hidden lg:flex flex-col justify-between bg-forest-900 text-white p-12 relative overflow-hidden">
            {/* Blobs + dot grid */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[500px] h-[500px] rounded-full opacity-10 bg-white blur-[120px] -top-40 -right-40" />
                <div className="absolute w-[300px] h-[300px] rounded-full opacity-10 bg-white blur-[80px] bottom-0 left-0" />
                <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="dots2" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1.5" fill="white" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots2)" />
                </svg>
            </div>

            {/* Logo */}
            <div className="relative z-10">
                <Link href="/" className="text-white no-underline">
                    <div className="font-serif text-2xl font-light tracking-tight">
                        Le<span className="text-[#9ECC60]">Guide</span>
                    </div>
                    <div className="text-white/40 text-xs mt-1 tracking-widest uppercase">
                        Student Admin Guide
                    </div>
                </Link>
            </div>

            {/* Perks */}
            <div className="relative z-10 space-y-3">
                <p className="text-white/50 text-xs tracking-widest uppercase mb-6">
                    Everything included, free
                </p>
                {PERKS.map((p) => (
                    <div
                        key={p.title}
                        className="flex items-start gap-3.5 bg-white/6 border border-white/10 rounded-xl p-4"
                    >
                        <span className="text-xl mt-0.5 shrink-0">{p.icon}</span>
                        <div>
                            <p className="text-[13.5px] font-medium text-white/90">{p.title}</p>
                            <p className="text-[12px] text-white/50 mt-0.5 leading-relaxed">{p.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats row */}
            <div className="relative z-10 flex gap-8">
                {[
                    { value: "1,200+", label: "Students helped" },
                    { value: "40+", label: "Nationalities" },
                    { value: "Free", label: "Always" },
                ].map((s) => (
                    <div key={s.label}>
                        <p className="text-xl font-serif font-light text-[#9ECC60]">{s.value}</p>
                        <p className="text-[11px] text-white/40 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}