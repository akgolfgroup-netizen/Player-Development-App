/**
 * KnowledgeBlog Component
 *
 * Blog-style knowledge base display with articles, categories,
 * and author information. Based on Tailwind UI blog template.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Sample knowledge base articles
const ARTICLES = [
  {
    id: 1,
    title: 'Optimal svingteknikk for større lengde',
    description: 'Lær hvordan du kan øke drivelengden ved å fokusere på hofterotering og timing.',
    date: '15. des 2024',
    datetime: '2024-12-15',
    category: { id: 'teknikk', title: 'Teknikk' },
    readTime: '8 min',
    author: { name: 'Anders Kristiansen', role: 'Head Coach' },
  },
  {
    id: 2,
    title: 'Mental forberedelse før turneringer',
    description: 'Strategier for å håndtere prestasjonsangst og bygge mental styrke.',
    date: '10. des 2024',
    datetime: '2024-12-10',
    category: { id: 'mental', title: 'Mental trening' },
    readTime: '6 min',
    author: { name: 'Kari Nordmann', role: 'Sportspsykolog' },
  },
  {
    id: 3,
    title: 'Ernæring for optimale prestasjoner',
    description: 'Hva du bør spise før, under og etter en turnering.',
    date: '5. des 2024',
    datetime: '2024-12-05',
    category: { id: 'fysisk', title: 'Fysisk trening' },
    readTime: '5 min',
    author: { name: 'Ole Hansen', role: 'Ernæringsfysiolog' },
  },
  {
    id: 4,
    title: 'Putting: Avstandskontroll over alt',
    description: 'Hvorfor avstandskontroll er viktigere enn retning.',
    date: '1. des 2024',
    datetime: '2024-12-01',
    category: { id: 'teknikk', title: 'Teknikk' },
    readTime: '7 min',
    author: { name: 'Anders Kristiansen', role: 'Head Coach' },
  },
  {
    id: 5,
    title: 'Forstå Strokes Gained-statistikk',
    description: 'En grundig innføring i SG-analyse for å identifisere forbedringsområder.',
    date: '25. nov 2024',
    datetime: '2024-11-25',
    category: { id: 'analyse', title: 'Analyse' },
    readTime: '10 min',
    author: { name: 'Anders Kristiansen', role: 'Head Coach' },
  },
  {
    id: 6,
    title: 'Golfregler: Vanlige situasjoner',
    description: 'Gjennomgang av de vanligste regelsituasjonene på banen.',
    date: '20. nov 2024',
    datetime: '2024-11-20',
    category: { id: 'regler', title: 'Regler' },
    readTime: '9 min',
    author: { name: 'Per Olsen', role: 'Dommer NGF' },
  },
];

const CATEGORIES = [
  { id: 'all', title: 'Alle' },
  { id: 'teknikk', title: 'Teknikk' },
  { id: 'mental', title: 'Mental trening' },
  { id: 'fysisk', title: 'Fysisk trening' },
  { id: 'analyse', title: 'Analyse' },
  { id: 'regler', title: 'Regler' },
];

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export function KnowledgeBlog() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter(article => {
      const matchesCategory = activeCategory === 'all' || article.category.id === activeCategory;
      const matchesSearch = !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Kunnskapsbase</h1>
          <p style={styles.subtitle}>
            Lær deg nye teknikker, mentale strategier og analysemetoder.
          </p>
        </div>

        <div style={styles.filterSection}>
          <div style={styles.searchContainer}>
            <svg style={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Søk i artikler..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.categoryFilters}>
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                style={{
                  ...styles.categoryButton,
                  ...(activeCategory === category.id ? styles.categoryButtonActive : {}),
                }}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.articlesGrid}>
          {filteredArticles.map(article => (
            <article key={article.id} style={styles.articleCard}>
              <div style={styles.articleMeta}>
                <time dateTime={article.datetime} style={styles.articleDate}>
                  {article.date}
                </time>
                <span style={styles.categoryBadge}>{article.category.title}</span>
              </div>

              <div style={styles.articleContent}>
                <h3 style={styles.articleTitle}>
                  <a
                    href={`/ressurser/${article.id}`}
                    onClick={(e) => { e.preventDefault(); navigate(`/ressurser/${article.id}`); }}
                    style={styles.articleLink}
                  >
                    {article.title}
                  </a>
                </h3>
                <p style={styles.articleDescription}>{article.description}</p>
                <p style={styles.readTime}>{article.readTime} lesetid</p>
              </div>

              <div style={styles.authorSection}>
                <div style={styles.authorAvatar}>{getInitials(article.author.name)}</div>
                <div style={styles.authorInfo}>
                  <p style={styles.authorName}>{article.author.name}</p>
                  <p style={styles.authorRole}>{article.author.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: 'var(--background-white)', minHeight: '100vh', padding: '32px 16px' },
  content: { maxWidth: '1200px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0' },
  subtitle: { fontSize: '18px', color: 'var(--text-secondary)', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' },
  filterSection: { display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' },
  searchContainer: { position: 'relative', maxWidth: '400px', width: '100%', margin: '0 auto' },
  searchIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
  searchInput: { width: '100%', padding: '12px 14px 12px 44px', fontSize: '15px', border: '1px solid var(--border-default)', borderRadius: '10px', backgroundColor: 'var(--background-white)', color: 'var(--text-primary)', outline: 'none' },
  categoryFilters: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' },
  categoryButton: { padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', backgroundColor: 'var(--background-surface)', border: '1px solid var(--border-subtle)', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.15s ease' },
  categoryButtonActive: { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)', color: 'var(--text-inverse)' },
  articlesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' },
  articleCard: { display: 'flex', flexDirection: 'column', backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border-subtle)', padding: '24px' },
  articleMeta: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  articleDate: { fontSize: '13px', color: 'var(--text-tertiary)' },
  categoryBadge: { padding: '4px 12px', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', backgroundColor: 'var(--background-surface)', borderRadius: '16px' },
  articleContent: { flex: 1, marginBottom: '20px' },
  articleTitle: { fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 10px 0', lineHeight: 1.3 },
  articleLink: { color: 'inherit', textDecoration: 'none' },
  articleDescription: { fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)', margin: '0 0 12px 0' },
  readTime: { fontSize: '13px', color: 'var(--text-tertiary)', margin: 0 },
  authorSection: { display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' },
  authorAvatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-muted)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600 },
  authorInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
  authorName: { fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 },
  authorRole: { fontSize: '13px', color: 'var(--text-tertiary)', margin: 0 },
};

export default KnowledgeBlog;
