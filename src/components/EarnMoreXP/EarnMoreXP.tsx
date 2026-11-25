import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Compass, Flame, Gamepad2, PlayCircle, Sparkles, Target, Users, CalendarCheck, X } from 'lucide-react';
import { ActivityCategory, EarningOpportunity } from '../../data/levelDashboardData';
import styles from './EarnMoreXP.module.css';

const PATHWAY_ICONS: Record<string, React.ReactNode> = {
  'play-earn': <Gamepad2 size={18} color="var(--vl-gold)" aria-hidden="true" />,
  'watch-earn': <PlayCircle size={18} color="var(--vl-gold)" aria-hidden="true" />,
  'daily-tasks': <CheckCircle2 size={18} color="var(--vl-gold)" aria-hidden="true" />,
  'refer-earn': <Users size={18} color="var(--vl-gold)" aria-hidden="true" />,
  'daily-challenge': <Target size={18} color="var(--vl-soft-blue)" aria-hidden="true" />,
  'streak-xp': <Flame size={18} color="var(--vl-soft-blue)" aria-hidden="true" />,
  'daily-mission': <Compass size={18} color="var(--vl-muted-purple)" aria-hidden="true" />,
  'bonus-missions': <Sparkles size={18} color="var(--vl-muted-purple)" aria-hidden="true" />,
  'weekly-quest': <CalendarCheck size={18} color="var(--vl-muted-purple)" aria-hidden="true" />,
};

export const EarnMoreXP: React.FC<{
  opportunities: EarningOpportunity[];
  remainingXP: number;
  nextLevel: number;
  onJumpToGame: () => void;
  onClaimDemoPathwayXP: (xp: number, title: string, category: ActivityCategory) => void;
}> = ({ opportunities, remainingXP, nextLevel, onJumpToGame, onClaimDemoPathwayXP }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming'>('all');
  const [selected, setSelected] = useState<EarningOpportunity | null>(null);

  const list = useMemo(() => {
    if (filter === 'active') return opportunities.filter((o) => o.badgeTag === 'active');
    if (filter === 'upcoming') return opportunities.filter((o) => o.badgeTag !== 'active');
    return opportunities;
  }, [opportunities, filter]);

  const handleConfirmDemo = () => {
    if (!selected?.demoClaimXP) return;
    const categoryMap: Record<string, ActivityCategory> = {
      'watch-earn': 'Daily Bonuses',
      'daily-tasks': 'Tasks',
      'refer-earn': 'Referrals',
    };
    onClaimDemoPathwayXP(selected.demoClaimXP, `${selected.title} (Demo Action)`, categoryMap[selected.id] ?? 'Tasks');
    setSelected(null);
  };

  const nxtStr = String(nextLevel).padStart(2, '0');

  return (
    <section id="earn-more" className="vlCard" aria-labelledby="earn-heading">
      <div className={styles.header}>
        <div>
          <h2 id="earn-heading" className="m-0 fw-bold" style={{ fontSize: '1.25rem' }}>
            Earn More XP &amp; Rewards
          </h2>
          <p className="mt-1 mb-0" style={{ fontSize: '0.85rem', color: 'var(--vl-text-secondary)' }}>
            Ways to reach your next level — play, watch, complete tasks, refer friends, or preview upcoming concepts.
          </p>
        </div>

        <div className={`${styles.remainingBanner} tabularNums`}>
          {remainingXP > 0 ? `${remainingXP.toLocaleString()} XP left to Level ${nxtStr}` : `Level ${nxtStr} XP threshold met`}
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3" role="tablist" aria-label="Filter earning pathways">
        {(['all', 'active', 'upcoming'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={filter === tab}
            className={`${styles.tabBtn} ${filter === tab ? styles.tabBtnActive : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab === 'all' ? `All (${opportunities.length})` : tab === 'active' ? 'Supported Now' : 'Coming Soon & Concepts'}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {list.map((item) => {
          const isConcept = item.badgeTag !== 'active';
          const statusColor =
            item.badgeTag === 'active'
              ? 'var(--vl-subtle-green)'
              : item.badgeTag === 'coming_soon'
                ? 'var(--vl-soft-blue)'
                : 'var(--vl-muted-purple)';

          return (
            <article key={item.id} className={styles.card}>
              <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span>{PATHWAY_ICONS[item.id] ?? <Sparkles size={18} aria-hidden="true" />}</span>
                  <span style={{ fontSize: '0.74rem', fontWeight: 600, color: statusColor }}>
                    {item.badgeTag === 'active' ? 'Supported' : item.badgeTag === 'coming_soon' ? 'Coming Soon' : 'Concept'}
                  </span>
                </div>
                <h3 className="m-0 mb-1 fw-bold" style={{ fontSize: '1rem' }}>{item.title}</h3>
                <p className="m-0" style={{ fontSize: '0.84rem', color: 'var(--vl-text-secondary)' }}>{item.description}</p>
              </div>

              <div className={styles.cardFooter}>
                <span className="tabularNums fw-bold" style={{ fontSize: '0.82rem', color: 'var(--vl-gold-bright)' }}>
                  {item.xpPreview}
                </span>
                <button
                  type="button"
                  className={isConcept ? 'vlBtnGhost' : 'vlBtnGold'}
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                  onClick={() => (item.actionType === 'scroll_game' ? onJumpToGame() : setSelected(item))}
                >
                  {item.ctaLabel}
                  {!isConcept && <ArrowRight size={13} aria-hidden="true" />}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {selected && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby="pathway-modal-title">
          <div className={`vlCard ${styles.modalDialog}`}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h3 id="pathway-modal-title" className="m-0 fw-bold" style={{ fontSize: '1.1rem' }}>{selected.title}</h3>
              <button
                type="button"
                className="vlBtnGhost"
                style={{ padding: 4, border: 'none' }}
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--vl-text-secondary)' }}>
              {selected.badgeTag === 'active'
                ? `${selected.description} Simulate earning ${selected.xpPreview} in demo mode.`
                : `${selected.description} Marked as ${selected.badgeTag === 'coming_soon' ? 'Coming Soon' : 'Concept'} until approved.`}
            </p>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button type="button" className="vlBtnGhost" onClick={() => setSelected(null)}>Close</button>
              {selected.badgeTag === 'active' && selected.demoClaimXP && (
                <button type="button" className="vlBtnGold" onClick={handleConfirmDemo}>
                  Simulate +{selected.demoClaimXP} XP (Demo)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
