import type { ReactNode } from 'react';
import { X } from 'lucide-react';

/** Выезжающая снизу шторка — как в нативных приложениях доставки. */
export function Sheet({
  open,
  onClose,
  children,
  fullHeight = false,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  fullHeight?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40">
      <button
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 animate-fade-in"
      />
      <div
        className={`absolute left-0 right-0 bottom-0 bg-surface rounded-t-[1.75rem] overflow-hidden animate-sheet-up ${
          fullHeight ? 'top-8' : 'max-h-[88%]'
        } flex flex-col`}
      >
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center"
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}
