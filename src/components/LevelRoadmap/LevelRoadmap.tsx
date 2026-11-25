import React, { useEffect, useState } from 'react';
import { CheckCircle2, Compass, Lock, Target } from 'lucide-react';
import { RewardTowerIllustration } from '../../assets/VeloopIllustrations';
import { RoadmapLevelItem } from '../../data/levelDashboardData';
import { LevelRewardCard } from '../LevelRewardCard/LevelRewardCard';
import styles from './LevelRoadmap.module.css';

interface LevelRoadmapProps {
  levels: RoadmapLevelItem[];
  currentLevel: number;
}

export const LevelRoadmap: React.FC<LevelRoadmapProps> = ({
  levels,
  currentLevel,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(currentLevel + 1);

  useEffect(() => {
    setSelectedLevel(currentLevel + 1);
  }, [currentLevel]);

  const activeDetail =
    levels.find((lvl) => lvl.level === selectedLevel) ?? levels[0];

  return (
    <section
      id="roadmap"
      className={styles.section}
      aria-labelledby="roadmap-heading"
    >
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <RewardTowerIllustration size={52} />
          <div>
            <h2 id="roadmap-heading" className={styles.title}>
              Level Progression Roadmap
            </h2>
            <p className={styles.subtitle}>
              Inspect unlocked tiers, your active milestone, and upcoming rewards. Select any level for full perks.
            </p>
          </div>
        </div>

        <div className={styles.legend} aria-label="Roadmap status key">
          <span className={styles.legendItem}>
            <CheckCircle2 size={14} color="var(--vl-subtle-green)" aria-hidden="true" />
            Completed
          </span>
          <span className={styles.legendItem}>
            <Compass size={14} color="var(--vl-gold)" aria-hidden="true" />
            Current
          </span>
          <span className={styles.legendItem}>
            <Target size={14} color="var(--vl-soft-blue)" aria-hidden="true" />
            Next Goal
          </span>
          <span className={styles.legendItem}>
            <Lock size={14} color="var(--vl-text-muted)" aria-hidden="true" />
            Locked
          </span>
        </div>
      </div>

      <div className={styles.trackGrid}>
        {levels.map((item) => (
          <LevelRewardCard
            key={item.level}
            item={item}
            isSelected={activeDetail?.level === item.level}
            onSelect={setSelectedLevel}
          />
        ))}
      </div>

      {activeDetail && (
        <div className={styles.detailDrawer} aria-live="polite">
          <div>
            <h3 className={styles.detailTitle}>
              Level {String(activeDetail.level).padStart(2, '0')} · {activeDetail.title}
            </h3>
            <p className={styles.detailMeta}>
              <span className="tabularNums">
                Threshold: {activeDetail.requiredXP.toLocaleString()} XP
              </span>
              <span aria-hidden="true"> · </span>
              <span>
                Reward: +{activeDetail.reward.amount} {activeDetail.reward.type}
                {activeDetail.reward.secondaryType
                  ? ` and +${activeDetail.reward.secondaryAmount} ${activeDetail.reward.secondaryType}`
                  : ''}
              </span>
              {activeDetail.isDemo && <span> · Demo Data</span>}
            </p>
          </div>

          <ul className={styles.perkList}>
            {activeDetail.perks.map((perk) => (
              <li key={perk} className={styles.perkItem}>
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
