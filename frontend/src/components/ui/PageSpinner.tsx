export function PageSpinner() {
    return (
        <div className="flex items-center justify-center bg-neutral-950 h-[calc(100vh-65px)]">
            <div className="flex flex-col items-center gap-6">
                {/* Jewel spinner */}
                <div className="relative w-14 h-14">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border border-neutral-800" />
                    {/* Spinning arc */}
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400 animate-spin" />
                    {/* Inner glow ring */}
                    <div className="absolute inset-[6px] rounded-full border border-amber-400/20 animate-pulse" />
                    {/* Center diamond */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 rotate-45 bg-gradient-to-br from-amber-300 to-amber-500 rounded-[3px] shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
                    </div>
                </div>

                {/* Wordmark */}
                <div className="flex items-center gap-2 opacity-60">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400/40" />
                    <span className="text-[10px] tracking-[0.4em] text-amber-400/80 uppercase font-light">
                        LuxSUV
                    </span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400/40" />
                </div>
            </div>
        </div>
    )
}