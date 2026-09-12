export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-stone-50 rounded-2xl p-4">
      <div className="text-xs text-stone-400 mb-1">{label}</div>
      <div className="text-sm text-stone-900">{value}</div>
    </div>
  );
}
