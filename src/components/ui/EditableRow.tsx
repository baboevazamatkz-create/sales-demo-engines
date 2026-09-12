export function EditableRow({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="bg-stone-50 rounded-2xl p-4">
      <div className="text-xs text-stone-400 mb-1">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-sm text-stone-900 bg-transparent w-full outline-none placeholder:text-stone-300"
      />
    </div>
  );
}
