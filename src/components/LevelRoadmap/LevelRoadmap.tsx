import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { RoadmapLevelItem } from '../../data/levelDashboardData';
import { LevelRewardCard } from '../LevelRewardCard/LevelRewardCard';
import styles from './LevelRoadmap.module.css';

export const LevelRoadmap: React.FC<{
  levels: RoadmapLevelItem[];
  currentLevel: number;
}> = ({ levels, currentLevel }) => {
  const [selectedLevel, setSelectedLevel] = useState(currentLevel + 1);

  useEffect(() => {
    setSelectedLevel(currentLevel + 1);
  }, [currentLevel]);

  const active = levels.find((lvl) => lvl.level === selectedLevel) ?? levels[0];

  return (
    <section id="roadmap" className="vlCard" aria-labelledby="roadmap-heading">
      <div className={styles.header}>
        <div>
          <h2 id="roadmap-heading" className={styles.title}>Level Progression Roadmap</h2>
          <p className={styles.subtitle}>
            Select any tier to inspect threshold XP, unlocked rewards, and milestone perks.
          </p>
        </div>
      </div>

      <div className={styles.trackGrid}>
        {levels.map((item) => (
          <LevelRewardCard
            key={item.level}
            item={item}
            isSelected={active?.level === item.level}
            onSelect={setSelectedLevel}
          />
        ))}
      </div>

      {active && (
        <div className={styles.detailDrawer} aria-live="polite">
          <div>
            <div className="fw-bold" style={{ fontSize: '0.95rem' }}>
              Level {String(active.level).padStart(2, '0')} · {active.title}
            </div>
            <div className="tabularNums" style={{ fontSize: '0.82rem', color: 'var(--vl-text-secondary)' }}>
              Threshold: {active.requiredXP.toLocaleString()} XP · Reward: +{active.reward.amount} {active.reward.type}
              {active.reward.secondaryType ? ` & +${active.reward.secondaryAmount} ${active.reward.secondaryType}` : ''}
              {active.isDemo ? ' · Demo Data' : ''}
            </div>
          </div>

          <ul className={styles.perkList}>
            {active.perks.map((perk) => (
              <li key={perk} className="d-inline-flex align-items-center gap-2">
                <CheckCircle2 size={14} color="var(--vl-gold)" aria-hidden="true" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
