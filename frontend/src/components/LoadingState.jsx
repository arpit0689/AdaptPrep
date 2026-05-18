export default function LoadingState({ label = 'Preparing your calm workspace...' }) {
  return <div className="surface rounded-2xl p-8 text-center muted">{label}</div>;
}
