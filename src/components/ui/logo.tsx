export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="rounded-lg flex items-center justify-center"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, #69EA9B 0%, #54D987 100%)",
          boxShadow: "0 4px 12px rgba(13, 48, 45, 0.22)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width={size * 0.6}
          height={size * 0.6}
          fill="none"
          stroke="#0D302D"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 10v12" />
          <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.98 2.3l-1.05 7A2 2 0 0 1 18.78 21H6a2 2 0 0 1-2-2v-7.34a2 2 0 0 1 .59-1.41l6.41-6.41a2 2 0 0 1 3.41 1.63Z" />
        </svg>
      </div>
      <span className="font-display text-lg font-bold tracking-tight">
        Marcable
      </span>
    </div>
  );
}
