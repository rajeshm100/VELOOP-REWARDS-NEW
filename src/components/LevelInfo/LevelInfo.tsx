import React from 'react';
import { Info, X } from 'lucide-react';
import { useDisclosure } from '../../hooks/useDisclosure';
import styles from './LevelInfo.module.css';

interface LevelInfoProps {
  title: string;
  description: string;
  demoNote?: string;
  ariaLabel: string;
}

export const LevelInfo: React.FC<LevelInfoProps> = ({ title, description, demoNote, ariaLabel }) => {
  const { isOpen, toggle, close, containerRef } = useDisclosure(false);

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        title={title}
      >
        <Info size={14} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className={styles.popover} role="dialog" aria-label={title}>
          <div className={styles.popoverHeader}>
            <h4 className={styles.popoverTitle}>{title}</h4>
            <button type="button" className={styles.closeBtn} onClick={close} aria-label="Close">
              <X size={14} aria-hidden="true" />
            </button>
          </div>
          <p className={styles.popoverBody}>{description}</p>
          {demoNote && <p className={styles.demoNote}>{demoNote}</p>}
        </div>
      )}
    </div>
  );
};
