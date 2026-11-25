import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  CalendarCheck,
  CheckCircle2,
  Compass,
  Flame,
  Gamepad2,
  HelpCircle,
  PlayCircle,
  Search,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react';
import { WalletFlowIllustration } from '../../assets/VeloopIllustrations';
import {
  ActivityCategory,
  EarningOpportunity,
} from '../../data/levelDashboardData';
import styles from './EarnMoreXP.module.css';

interface EarnMoreXPProps {
  opportunities: EarningOpportunity[];
  remainingXP: number;
  nextLevel: number;
  onJumpToGame: () => void;
  onClaimDemoPathwayXP: (
    xp: number,
    title: string,
    category: ActivityCategory
  ) => void;
}

type PathwayFilter = 'all' | 'active' | 'upcoming';

function getPathwayIcon(iconKey: EarningOpportunity['iconKey']) {
  switch (iconKey) {
    case 'play':
      return <Gamepad2 size={18} aria-hidden="true" />;
    case 'watch':
      return <PlayCircle size={18} aria-hidden="true" />;
    case 'tasks':
      return <CheckCircle2 size={18} aria-hidden="true" />;
    case 'refer':
      return <Users size={18} aria-hidden="true" />;
    case 'daily_challenge':
      return <Target size={18} aria-hidden="true" />;
    case 'streak':
      return <Flame size={18} aria-hidden="true" />;
    case 'daily_mission':
      return <Compass size={18} aria-hidden="true" />;
    case 'bonus':
      return <Sparkles size={18} aria-hidden="true" />;
    case 'xp_challenge':
      return <Award size={18} aria-hidden="true" />;
    case 'weekly_quest':
      return <CalendarCheck size={18} aria-hidden="true" />;
    case 'quick_quiz':
      return <HelpCircle size={18} aria-hidden="true" />;
    case 'reward_hunt':
      return <Search size={18} aria-hidden="true" />;
  }
}

export const EarnMoreXP: React.FC<EarnMoreXPProps> = ({
  opportunities,
  remainingXP,
  nextLevel,
  onJumpToGame,
  onClaimDemoPathwayXP,
}) => {
  const [filter, setFilter] = useState<PathwayFilter>('all');
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<EarningOpportunity | null>(null);

  const filteredList = useMemo(() => {
    if (filter === 'active') {
      return opportunities.filter((item) => item.badgeTag === 'active');
    }
    if (filter === 'upcoming') {
      return opportunities.filter((item) => item.badgeTag !== 'active');
    }
    return opportunities;
  }, [opportunities, filter]);

  const handleCardClick = (item: EarningOpportunity) => {
    if (item.actionType === 'scroll_game') {
      onJumpToGame();
      return;
    }

    setSelectedOpportunity(item);
  };

  const handleConfirmDemoAction = () => {
    if (!selectedOpportunity || !selectedOpportunity.demoClaimXP) {
      setSelectedOpportunity(null);
      return;
    }

    const categoryMap: Record<string, ActivityCategory> = {
      'watch-earn': 'Daily Bonuses',
      'daily-tasks': 'Tasks',
      'refer-earn': 'Referrals',
    };

    onClaimDemoPathwayXP(
      selectedOpportunity.demoClaimXP,
      `${selectedOpportunity.title} (Demo Action)`,
      categoryMap[selectedOpportunity.id] ?? 'Tasks'
    );
    setSelectedOpportunity(null);
  };

  const nextLvlStr = String(nextLevel).padStart(2, '0');

  return (
    <section
      id="earn-more"
      className={styles.section}
      aria-labelledby="earn-heading"
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <WalletFlowIllustration size={50} />
          <div>
            <h2 id="earn-heading" className={styles.title}>
              Earn More XP &amp; Rewards
            </h2>
            <p className={styles.subtitle}>
              Ways to reach your next level — play, watch, complete daily tasks, refer friends, or preview upcoming concepts.
            </p>
          </div>
        </div>

        <div className={`${styles.remainingBanner} tabularNums`}>
          {remainingXP > 0
            ? `${remainingXP.toLocaleString()} XP left to Level ${nextLvlStr}`
            : `Level ${nextLvlStr} XP threshold met`}
        </div>
      </div>

      <div className={styles.filterBar} role="tablist" aria-label="Filter earning pathways">
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'all'}
          className={`${styles.tabBtn} ${filter === 'all' ? styles.tabBtnActive : ''}`}
          onClick={() => setFilter('all')}
        >
          All Pathways ({opportunities.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'active'}
          className={`${styles.tabBtn} ${filter === 'active' ? styles.tabBtnActive : ''}`}
          onClick={() => setFilter('active')}
        >
          Supported Now
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'upcoming'}
          className={`${styles.tabBtn} ${filter === 'upcoming' ? styles.tabBtnActive : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          Coming Soon &amp; Concepts
        </button>
      </div>

      <div className={styles.grid}>
        {filteredList.map((item) => {
          const isConcept = item.badgeTag !== 'active';
          const statusLabel =
            item.badgeTag === 'active'
              ? 'Supported'
              : item.badgeTag === 'coming_soon'
                ? 'Coming Soon'
                : 'Concept';
          const statusClass =
            item.badgeTag === 'active'
              ? styles.statusActive
              : item.badgeTag === 'coming_soon'
                ? styles.statusSoon
                : styles.statusConcept;

          return (
            <article
              key={item.id}
              className={`${styles.card} ${isConcept ? styles.cardConcept : ''}`}
            >
              <div>
                <div className={styles.cardTop}>
                  <span className={styles.iconCircle}>
                    {getPathwayIcon(item.iconKey)}
                  </span>
                  <span className={`${styles.statusText} ${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>

                <h3 className={`${styles.cardTitle} mt-3`}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.description}</p>
              </div>

              <div className={styles.cardFooter}>
                <span className={`${styles.xpPreview} tabularNums`}>
                  {item.xpPreview}
                </span>

                <button
                  type="button"
                  className={isConcept ? styles.conceptBtn : styles.ctaBtn}
                  onClick={() => handleCardClick(item)}
                >
                  {item.ctaLabel}
                  {!isConcept && <ArrowRight size={13} aria-hidden="true" />}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {selectedOpportunity && (
        <div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pathway-modal-title"
        >
          <div className={styles.modalDialog}>
            <div className={styles.modalHeader}>
              <h3 id="pathway-modal-title" className={styles.modalTitle}>
                {selectedOpportunity.title}
              </h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setSelectedOpportunity(null)}
                aria-label="Close pathway preview"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <p className={styles.modalBody}>
              {selectedOpportunity.badgeTag === 'active'
                ? `${selectedOpportunity.description} In the live VELOOP platform, this opens the verified ${selectedOpportunity.title} workflow. You can simulate earning ${selectedOpportunity.xpPreview} right now in demo mode.`
                : `${selectedOpportunity.description} This earning concept is marked as "${selectedOpportunity.badgeTag === 'coming_soon' ? 'Coming Soon' : 'Concept'}" until approved and connected by the product team.`}
            </p>

            <div className={`${styles.modalRoute} tabularNums`}>
              Target Route: {selectedOpportunity.route} · Status:{' '}
              {selectedOpportunity.badgeTag === 'active'
                ? 'Active Pathway (Demo Simulation)'
                : selectedOpportunity.badgeTag === 'coming_soon'
                  ? 'Coming Soon'
                  : 'Proposed Concept'}
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.conceptBtn}
                onClick={() => setSelectedOpportunity(null)}
              >
                Close
              </button>
              {selectedOpportunity.badgeTag === 'active' &&
                selectedOpportunity.demoClaimXP && (
                  <button
                    type="button"
                    className={styles.primaryActionBtn}
                    onClick={handleConfirmDemoAction}
                  >
                    Simulate +{selectedOpportunity.demoClaimXP} XP (Demo)
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
