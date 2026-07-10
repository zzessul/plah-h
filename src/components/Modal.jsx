import { X } from 'lucide-react';

export default function Modal({ title, children, onClose }) {
  return (
    <div className="modalBackdrop" role="presentation" onClick={onClose}>
      <div className="modalSheet" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modalHeader">
          <h3>{title}</h3>
          <button className="iconButton" onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
