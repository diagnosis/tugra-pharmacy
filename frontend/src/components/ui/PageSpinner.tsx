// src/components/ui/PageSpinner.tsx
export function PageSpinner() {
    return (
        <div className="flex items-center justify-center bg-[#f0faf6] min-h-screen">
            <div className="flex flex-col items-center gap-6">

                <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border border-[#c8e6d4]" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1a6b4a] animate-spin" />
                    <div className="absolute inset-[6px] rounded-full border border-[#1a6b4a]/20 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 rotate-45 bg-gradient-to-br from-[#1a6b4a] to-[#0f2d1f] rounded-[3px] shadow-[0_0_12px_rgba(26,107,74,0.4)]" />
                    </div>
                </div>

                <div className="flex items-center gap-2 opacity-60">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#1a6b4a]/40" />
                    <span className="text-[10px] tracking-[0.4em] text-[#1a6b4a]/80 uppercase font-light">
            Tuğra
          </span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#1a6b4a]/40" />
                </div>

            </div>
        </div>
    )
}