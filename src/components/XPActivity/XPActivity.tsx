import React from 'react';
import {
  ArrowRight,
  CheckSquare,
  Flame,
  Gamepad2,
  Gift,
  Sparkles,
  Users,
} from 'lucide-react';
import { ActivityCategory, XPActivityItem } from '../../data/levelDashboardData';
import {
  ACTIVITY_FILTER_OPTIONS,
  useActivityFilter,
} from '../../hooks/useActivityFilter';
import styles from './XPActivity.module.css';

interface XPActivityProps {
  activities: XPActivityItem[];
  xpEarnedToday: number;
  vesEarnedToday: number;
  onStartEarning: () => void;
}

function getCategoryIcon(category: ActivityCategory) {
  switch (category) {
    case 'Tasks':
      return <CheckSquare size={15} aria-hidden="true" />;
    case 'Referrals':
      return <Users size={15} aria-hidden="true" />;
    case 'Games':
      return <Gamepad2 size={15} aria-hidden="true" />;
    case 'Streaks':
      return <Flame size={15} aria-hidden="true" />;
    case 'Daily Bonuses':
      return <Gift size={15} aria-hidden="true" />;
    case 'Challenges':
      return <Sparkles size={15} aria-hidden="true" />;
  }
}

export const XPActivity: React.FC<XPActivityProps> = ({
  activities,
  xpEarnedToday,
  vesEarnedToday,
  onStartEarning,
}) => {
  const { selectedCategory, setSelectedCategory, filteredActivities } =
    useActivityFilter(activities);

  return (
    <section
      id="activity"
      className={styles.card}
      aria-labelledby="activity-heading"
    >
      <div>
        <div className={styles.header}>
          <div>
            <h2 id="activity-heading" className={styles.title}>
              Recent XP Activity
            </h2>
            <p className={styles.subtitle}>
              Verified XP sources across sessions · Demo history
            </p>
          </div>
        </div>

        <div
          className={`${styles.filterRow} mt-3`}
          role="tablist"
          aria-label="Filter XP activity by source"
        >
          {ACTIVITY_FILTER_OPTIONS.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selectedCategory === category}
              className={`${styles.filterBtn} ${
                selectedCategory === category ? styles.filterBtnActive : ''
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>Your XP journey starts here</p>
          <p className={styles.emptyText}>
            {activities.length === 0
              ? 'Complete a mini-game round or daily task to log your first XP gain.'
              : `No recent entries recorded under ${selectedCategory} yet.`}
          </p>
          <button
            type="button"
            className={styles.emptyCta}
            onClick={onStartEarning}
          >
            Start Earning XP
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <ul className={styles.list}>
          {filteredActivities.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className={styles.itemLeft}>
                <span className={styles.itemIcon}>
                  {getCategoryIcon(item.category)}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p className={styles.itemTitle}>{item.title}</p>
                  <p className={styles.itemMeta}>
                    {item.category} · {item.timestamp}
                  </p>
                </div>
              </div>

              <div className={styles.itemReward}>
                <span className={`${styles.xpGain} tabularNums`}>
                  +{item.xpAmount} XP
                </span>
                {item.veAmount && item.veAmount > 0 && (
                  <span className={`${styles.veGain} tabularNums`}>
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
          <span className={styles.summaryLabel}>Today&apos;s XP Total</span>
          <span
            className={`${styles.summaryValue} tabularNums`}
            style={{ color: 'var(--vl-muted-purple)' }}
          >
            {xpEarnedToday} XP
          </span>
        </div>

        <div className={styles.summaryBox}>
          <span className={styles.summaryLabel}>Today&apos;s VEs Earned</span>
          <span
            className={`${styles.summaryValue} tabularNums`}
            style={{ color: 'var(--vl-gold-bright)' }}
          >
            {vesEarnedToday} VEs
          </span>
        </div>
      </div>
    </section>
  );
};
