/**
 * ProPlayerComparison Component
 * Compare your SG stats with professional golfers from DataGolf
 *
 * Features:
 * - Search for any pro player (e.g., Kristoffer Reitan, Viktor Hovland)
 * - Visual side-by-side comparison
 * - Gap analysis for each category
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  User,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Star,
  Flag,
} from 'lucide-react';
import Card from '../../ui/primitives/Card';
import { SectionTitle, SubSectionTitle } from '../../components/typography';
import { useProPlayerSearch, useProPlayer, ProPlayer, ProPlayerStats } from '../../hooks/useProPlayerSearch';
import { useStrokesGained } from '../../hooks/useStrokesGained';

interface ProPlayerComparisonProps {
  /** Optional suggested players to show initially */
  suggestedPlayers?: ProPlayer[];
}

const ProPlayerComparison: React.FC<ProPlayerComparisonProps> = ({ suggestedPlayers }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { results, loading: searchLoading, search } = useProPlayerSearch(300);
  const { player: selectedPlayer, loading: playerLoading } = useProPlayer(selectedPlayerId);
  const { data: userSgData } = useStrokesGained();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    search(value);
    setShowDropdown(value.length >= 2);
  };

  const handleSelectPlayer = (player: ProPlayer) => {
    setSelectedPlayerId(player.dataGolfId);
    setSearchQuery(player.playerName);
    setShowDropdown(false);
  };

  const handleClearSelection = () => {
    setSelectedPlayerId(null);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const formatSG = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    if (value > 0) return `+${value.toFixed(2)}`;
    return value.toFixed(2);
  };

  const getSGColor = (value: number | null) => {
    if (value === null) return 'var(--text-tertiary)';
    if (value >= 0.5) return 'var(--success)';
    if (value >= 0) return 'var(--accent)';
    if (value >= -0.5) return 'var(--warning)';
    return 'var(--error)';
  };

  const getGapIndicator = (userValue: number, proValue: number | null) => {
    if (proValue === null) return null;
    const gap = userValue - proValue;

    if (gap >= 0.1) {
      return { icon: TrendingUp, color: 'var(--success)', label: 'Foran' };
    } else if (gap <= -0.1) {
      return { icon: TrendingDown, color: 'var(--error)', label: 'Bak' };
    }
    return { icon: Minus, color: 'var(--text-tertiary)', label: 'Likt' };
  };

  // Get user's SG values
  const getUserSG = (category: 'total' | 'approach' | 'putting' | 'aroundGreen' | 'tee') => {
    if (!userSgData) return 0;
    if (category === 'total') return userSgData.total || 0;
    const catMap: Record<string, string> = {
      approach: 'approach',
      putting: 'putting',
      aroundGreen: 'around_green',
      tee: 'tee',
    };
    return userSgData.byCategory?.[catMap[category]]?.value || 0;
  };

  const comparisonCategories = [
    { key: 'total', label: 'Total SG', proKey: 'sgTotal' as keyof ProPlayerStats },
    { key: 'tee', label: 'Fra tee', proKey: 'sgTee' as keyof ProPlayerStats },
    { key: 'approach', label: 'Innspill', proKey: 'sgApproach' as keyof ProPlayerStats },
    { key: 'aroundGreen', label: 'Rundt green', proKey: 'sgAround' as keyof ProPlayerStats },
    { key: 'putting', label: 'Putting', proKey: 'sgPutting' as keyof ProPlayerStats },
  ];

  return (
    <div style={styles.container}>
      {/* Search Section */}
      <div ref={searchRef} style={styles.searchContainer}>
        <div style={styles.searchInputWrapper}>
          <Search size={18} color="var(--text-tertiary)" style={styles.searchIcon} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Sok etter proff (f.eks. Kristoffer Reitan)"
            style={styles.searchInput}
            onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
          />
          {(searchQuery || selectedPlayerId) && (
            <button onClick={handleClearSelection} style={styles.clearButton}>
              <X size={16} color="var(--text-tertiary)" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && (
          <div style={styles.dropdown}>
            {searchLoading ? (
              <div style={styles.dropdownItem}>
                <span style={styles.dropdownLoading}>Soker...</span>
              </div>
            ) : results.length > 0 ? (
              results.map((player) => (
                <button
                  key={player.dataGolfId}
                  onClick={() => handleSelectPlayer(player)}
                  style={styles.dropdownItem}
                >
                  <div style={styles.dropdownPlayerInfo}>
                    <User size={16} color="var(--accent)" />
                    <div>
                      <span style={styles.dropdownPlayerName}>
                        {player.playerName} ({player.rank})
                      </span>
                      <span style={styles.dropdownPlayerTour}>
                        {player.tour?.toUpperCase() || 'Tour'}
                      </span>
                    </div>
                  </div>
                  <div style={styles.dropdownPlayerSG}>
                    <span style={{ color: getSGColor(player.stats.sgTotal) }}>
                      {formatSG(player.stats.sgTotal)}
                    </span>
                    <ChevronRight size={14} color="var(--text-tertiary)" />
                  </div>
                </button>
              ))
            ) : searchQuery.length >= 2 ? (
              <div style={styles.dropdownItem}>
                <span style={styles.dropdownEmpty}>Ingen spillere funnet</span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Suggested Players (when no selection) */}
      {!selectedPlayer && suggestedPlayers && suggestedPlayers.length > 0 && (
        <div style={styles.suggestedSection}>
          <SubSectionTitle style={{ margin: '0 0 var(--spacing-2) 0', fontSize: 'var(--font-size-caption1)' }}>
            Foreslatte spillere
          </SubSectionTitle>
          <div style={styles.suggestedGrid}>
            {suggestedPlayers.slice(0, 3).map((player) => (
              <button
                key={player.dataGolfId}
                onClick={() => handleSelectPlayer(player)}
                style={styles.suggestedCard}
              >
                <div style={styles.suggestedCardHeader}>
                  {player.playerName.includes('Hovland') && (
                    <Star size={12} color="var(--achievement)" fill="var(--achievement)" />
                  )}
                  <Flag size={12} color="var(--text-tertiary)" />
                </div>
                <span style={styles.suggestedName}>{player.playerName}</span>
                <span style={{ ...styles.suggestedSG, color: getSGColor(player.stats.sgTotal) }}>
                  {formatSG(player.stats.sgTotal)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comparison View */}
      {selectedPlayer && (
        <Card padding="md">
          <div style={styles.comparisonHeader}>
            <div style={styles.comparisonPlayer}>
              <div style={styles.playerAvatar}>
                <User size={20} color="var(--accent)" />
              </div>
              <div>
                <span style={styles.playerLabel}>Du</span>
                <span style={styles.playerSGTotal}>
                  {formatSG(userSgData?.total)}
                </span>
              </div>
            </div>

            <div style={styles.vsIndicator}>VS</div>

            <div style={styles.comparisonPlayer}>
              <div style={{ ...styles.playerAvatar, backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                <Star size={20} color="var(--success)" />
              </div>
              <div>
                <span style={styles.playerLabel}>{selectedPlayer.playerName}</span>
                <span style={styles.playerSGTotal}>
                  {formatSG(selectedPlayer.stats.sgTotal)}
                </span>
              </div>
            </div>
          </div>

          <div style={styles.comparisonGrid}>
            {comparisonCategories.map((cat) => {
              const userValue = getUserSG(cat.key as 'total' | 'approach' | 'putting' | 'aroundGreen' | 'tee');
              const proValue = selectedPlayer.stats[cat.proKey] as number | null;
              const gap = getGapIndicator(userValue, proValue);
              const GapIcon = gap?.icon || Minus;

              return (
                <div key={cat.key} style={styles.comparisonRow}>
                  <div style={styles.comparisonCategory}>
                    <span style={styles.categoryLabel}>{cat.label}</span>
                    {gap && (
                      <div style={{ ...styles.gapBadge, backgroundColor: `${gap.color}15` }}>
                        <GapIcon size={12} color={gap.color} />
                      </div>
                    )}
                  </div>

                  <div style={styles.comparisonValues}>
                    <div style={styles.valueColumn}>
                      <span style={{ ...styles.valueText, color: getSGColor(userValue) }}>
                        {formatSG(userValue)}
                      </span>
                    </div>

                    <div style={styles.gapColumn}>
                      <span style={{
                        ...styles.gapText,
                        color: gap?.color || 'var(--text-tertiary)',
                      }}>
                        {proValue !== null ? formatSG(userValue - proValue) : '-'}
                      </span>
                    </div>

                    <div style={styles.valueColumn}>
                      <span style={{ ...styles.valueText, color: getSGColor(proValue) }}>
                        {formatSG(proValue)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div style={styles.summarySection}>
            {(() => {
              const totalGap = (userSgData?.total || 0) - (selectedPlayer.stats.sgTotal || 0);
              const isAhead = totalGap >= 0;

              return (
                <div style={{
                  ...styles.summaryCard,
                  backgroundColor: isAhead ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                }}>
                  {isAhead ? (
                    <TrendingUp size={20} color="var(--success)" />
                  ) : (
                    <TrendingDown size={20} color="var(--error)" />
                  )}
                  <div>
                    <span style={{
                      ...styles.summaryValue,
                      color: isAhead ? 'var(--success)' : 'var(--error)',
                    }}>
                      {formatSG(Math.abs(totalGap))} slag
                    </span>
                    <span style={styles.summaryLabel}>
                      {isAhead ? 'foran' : 'bak'} {selectedPlayer.playerName.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </Card>
      )}

      {/* Empty state when no player selected */}
      {!selectedPlayer && !suggestedPlayers?.length && (
        <Card variant="flat" padding="md">
          <div style={styles.emptyState}>
            <Search size={32} style={{ opacity: 0.3, marginBottom: 8, color: 'var(--text-tertiary)' }} />
            <p style={styles.emptyText}>
              Sok etter en proffspiller for a sammenligne dine SG-tall
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
  },
  searchContainer: {
    position: 'relative',
  },
  searchInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 'var(--spacing-3)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: 'var(--spacing-3) var(--spacing-3) var(--spacing-3) var(--spacing-10)',
    paddingRight: 'var(--spacing-10)',
    fontSize: 'var(--font-size-body)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--background-surface)',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  },
  clearButton: {
    position: 'absolute',
    right: 'var(--spacing-3)',
    padding: 'var(--spacing-1)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 'var(--spacing-1)',
    backgroundColor: 'var(--background-elevated)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 100,
    maxHeight: '300px',
    overflowY: 'auto',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 'var(--spacing-3) var(--spacing-4)',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--border-subtle)',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.1s ease',
  },
  dropdownPlayerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  dropdownPlayerName: {
    display: 'block',
    fontSize: 'var(--font-size-body)',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  dropdownPlayerTour: {
    display: 'block',
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
  },
  dropdownPlayerSG: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
  },
  dropdownLoading: {
    color: 'var(--text-tertiary)',
    fontSize: 'var(--font-size-body)',
  },
  dropdownEmpty: {
    color: 'var(--text-tertiary)',
    fontSize: 'var(--font-size-body)',
  },
  suggestedSection: {
    marginTop: 'var(--spacing-1)',
  },
  suggestedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--spacing-2)',
  },
  suggestedCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  suggestedCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    marginBottom: 'var(--spacing-1)',
  },
  suggestedName: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
  },
  suggestedSG: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 700,
    marginTop: 'var(--spacing-1)',
  },
  comparisonHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--spacing-4)',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-elevated)',
    borderRadius: 'var(--radius-md)',
  },
  comparisonPlayer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    flex: 1,
  },
  playerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerLabel: {
    display: 'block',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
  },
  playerSGTotal: {
    display: 'block',
    fontSize: 'var(--font-size-title3)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  vsIndicator: {
    padding: 'var(--spacing-1) var(--spacing-2)',
    fontSize: 'var(--font-size-caption2)',
    fontWeight: 700,
    color: 'var(--text-tertiary)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-sm)',
  },
  comparisonGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  comparisonRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-2) 0',
    borderBottom: '1px solid var(--border-subtle)',
  },
  comparisonCategory: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    minWidth: '100px',
  },
  categoryLabel: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
  },
  gapBadge: {
    width: '20px',
    height: '20px',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  comparisonValues: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-4)',
  },
  valueColumn: {
    width: '50px',
    textAlign: 'center',
  },
  valueText: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  gapColumn: {
    width: '50px',
    textAlign: 'center',
  },
  gapText: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
  },
  summarySection: {
    marginTop: 'var(--spacing-4)',
  },
  summaryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
  },
  summaryValue: {
    display: 'block',
    fontSize: 'var(--font-size-title3)',
    fontWeight: 700,
  },
  summaryLabel: {
    display: 'block',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-6)',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-secondary)',
    margin: 0,
    maxWidth: '280px',
  },
};

export default ProPlayerComparison;
