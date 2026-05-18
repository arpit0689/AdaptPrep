export default function StatCard({ label, value, hint, tone = 'sage' }) {
  const toneMap = {
    sage: 'bg-sage-100 text-sage-700 dark:bg-sage-700/30 dark:text-sage-100',
    sand: 'bg-[#eee2cd] text-[#6d5d43] dark:bg-[#5a4c37]/40 dark:text-[#eadcc2]',
    lavender: 'bg-[#ebe6f3] text-[#695d7d] dark:bg-[#4b435a]/45 dark:text-[#ded3ef]'
  };
  return (
    <div className="surface rounded-2xl p-5 shadow-soft">
      <div className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-bold ${toneMap[tone]}`}>{label}</div>
      <div className="text-3xl font-black">{value}</div>
      <p className="muted mt-2 text-sm">{hint}</p>
    </div>
  );
}
