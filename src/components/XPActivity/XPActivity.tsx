import React from 'react';
import { ArrowRight, CheckSquare, Flame, Gamepad2, Gift, Sparkles, Users } from 'lucide-react';
import { ActivityCategory, XPActivityItem } from '../../data/levelDashboardData';
import { ACTIVITY_FILTER_OPTIONS, useActivityFilter } from '../../hooks/useActivityFilter';
import styles from './XPActivity.module.css';

const CATEGORY_ICONS: Record<ActivityCategory, React.ReactNode> = {
  Tasks: <CheckSquare size={15} aria-hidden="true" />,
  Referrals: <Users size={15} aria-hidden="true" />,
  Games: <Gamepad2 size={15} aria-hidden="true" />,
  Streaks: <Flame size={15} aria-hidden="true" />,
  'Daily Bonuses': <Gift size={15} aria-hidden="true" />,
  Challenges: <Sparkles size={15} aria-hidden="true" />,
};

export const XPActivity: React.FC<{
  activities: XPActivityItem[];
  xpEarnedToday: number;
  vesEarnedToday: number;
  onStartEarning: () => void;
}> = ({ activities, xpEarnedToday, vesEarnedToday, onStartEarning }) => {
  const { selectedCategory, setSelectedCategory, filteredActivities } = useActivityFilter(activities);

  return (
    <section id="activity" className={`vlCard ${styles.card}`} aria-labelledby="activity-heading">
      <div>
        <h2 id="activity-heading" className="m-0 fw-bold" style={{ fontSize: '1.2rem' }}>Recent XP Activity</h2>
        <p className="mt-1 mb-3" style={{ fontSize: '0.82rem', color: 'var(--vl-text-muted)' }}>
          XP sources across sessions · Demo history
        </p>

        <div className={styles.filterRow} role="tablist" aria-label="Filter XP activity">
          {ACTIVITY_FILTER_OPTIONS.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selectedCategory === category}
              className={`${styles.filterBtn} ${selectedCategory === category ? styles.filterBtnActive : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <div className={styles.emptyState}>
          <p className="m-0 fw-bold">Your XP journey starts here</p>
          <p className="m-0" style={{ fontSize: '0.84rem', color: 'var(--vl-text-secondary)' }}>
            {activities.length === 0
              ? 'Complete a mini-game round or daily task to log your first XP gain.'
              : `No recent entries under ${selectedCategory}.`}
          </p>
          <button type="button" className="vlBtnGold" onClick={onStartEarning}>
            Start Earning XP
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <ul className={styles.list}>
          {filteredActivities.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                <span className={styles.itemIcon}>{CATEGORY_ICONS[item.category]}</span>
                <div style={{ minWidth: 0 }}>
                  <p className="m-0 fw-semibold text-truncate" style={{ fontSize: '0.85rem' }}>{item.title}</p>
                  <p className="m-0" style={{ fontSize: '0.74rem', color: 'var(--vl-text-muted)' }}>
                    {item.category} · {item.timestamp}
                  </p>
                </div>
              </div>

              <div className="text-end flex-shrink-0">
                <span className="d-block fw-bold tabularNums" style={{ fontSize: '0.85rem', color: 'var(--vl-subtle-green)' }}>
                  +{item.xpAmount} XP
                </span>
                {item.veAmount && item.veAmount > 0 && (
                  <span className="d-block tabularNums" style={{ fontSize: '0.74rem', color: 'var(--vl-gold)' }}>
                    +{item.veAmount} VEs
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.summaryFooter}>
        <div className={styles.summaryBox}>
          <span style={{ fontSize: '0.72rem', color: 'var(--vl-text-muted)' }}>Today&apos;s XP Total</span>
          <span className="d-block fw-bold tabularNums" style={{ color: 'var(--vl-muted-purple)' }}>
            {xpEarnedToday} XP
          </span>
        </div>
        <div className={styles.summaryBox}>
          <span style={{ fontSize: '0.72rem', color: 'var(--vl-text-muted)' }}>Today&apos;s VEs Earned</span>
          <span className="d-block fw-bold tabularNums" style={{ color: 'var(--vl-gold-bright)' }}>
            {vesEarnedToday} VEs
          </span>
        </div>
      </div>
    </section>
  );
};
