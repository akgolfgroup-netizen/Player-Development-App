import React, { useState } from 'react';
import { ListTemplate, ListItem, ListSection } from '../templates/ListTemplate';
import { CardGridTemplate, CardItem } from '../templates/CardGridTemplate';
import {
  CheckCircle,
  TrendingUp,
  Calendar,
  Target,
  Award,
  FileText,
  Inbox,
  Plus,
} from 'lucide-react';

/**
 * Templates Lab - Demo and testing page for reusable UI templates
 * Access at /ui-lab/templates
 */
export const TemplatesLab: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'list' | 'cards'>('list');
  const [selectedListItem, setSelectedListItem] = useState<string | null>(null);

  // List Template Demo Data
  const listSections: ListSection[] = [
    {
      id: 'in-progress',
      header: 'I arbeid',
      items: [
        {
          id: '1',
          icon: <Target size={20} />,
          title: 'Forbedre putting-teknikk',
          subtitle: '5 av 8 økter fullført',
          metadata: '62%',
          badge: 'Høy',
          badgeColor: 'error',
          onClick: () => setSelectedListItem('1'),
          selected: selectedListItem === '1',
        },
        {
          id: '2',
          icon: <TrendingUp size={20} />,
          title: 'Øk driverdistanse',
          subtitle: '3 av 10 økter fullført',
          metadata: '30%',
          badge: 'Medium',
          badgeColor: 'warning',
          onClick: () => setSelectedListItem('2'),
          selected: selectedListItem === '2',
        },
      ],
    },
    {
      id: 'completed',
      header: 'Fullført',
      items: [
        {
          id: '3',
          icon: <CheckCircle size={20} />,
          title: 'Chip-øvelser rundt green',
          subtitle: 'Fullført 15. des 2025',
          metadata: '100%',
          badge: 'Fullført',
          badgeColor: 'success',
          onClick: () => setSelectedListItem('3'),
          selected: selectedListItem === '3',
        },
      ],
    },
  ];

  const flatListItems: ListItem[] = [
    {
      id: '1',
      icon: <Calendar size={20} />,
      title: 'Neste økt: Teknikktrening',
      subtitle: 'I morgen kl. 14:00',
      metadata: '60 min',
      onClick: () => alert('Økt klikket'),
    },
    {
      id: '2',
      icon: <FileText size={20} />,
      title: 'Treningsnotat fra coach',
      subtitle: 'Gjennomgang av forrige økt',
      metadata: '2t siden',
      badge: 'Ny',
      badgeColor: 'primary',
      onClick: () => alert('Notat klikket'),
    },
    {
      id: '3',
      icon: <Award size={20} />,
      title: 'Nytt merke opptjent!',
      subtitle: 'Putting Mester - Sølv',
      metadata: 'I dag',
      badge: 'Sølv',
      badgeColor: 'success',
      onClick: () => alert('Merke klikket'),
    },
  ];

  // Card Grid Template Demo Data
  const cardItems: CardItem[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400',
      imageAlt: 'Golf course',
      title: 'Putting Masterclass',
      description: 'Lær avanserte putting-teknikker fra profesjonelle spillere.',
      badge: 'Ny',
      badgeColor: 'primary',
      metadata: '12 videoer • 2t 30min',
      actions: {
        primary: {
          label: 'Start kurs',
          onClick: () => alert('Start kurs'),
        },
        secondary: {
          label: 'Forhåndsvis',
          onClick: () => alert('Forhåndsvis'),
        },
      },
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1593111774240-d529f12a3aae?w=400',
      imageAlt: 'Golf swing',
      title: 'Driver-teknikk',
      description: 'Optimaliser din driver-swing for lengre og mer presise slag.',
      badge: 'Populær',
      badgeColor: 'warning',
      metadata: '8 videoer • 1t 45min',
      actions: {
        primary: {
          label: 'Fortsett',
          onClick: () => alert('Fortsett'),
        },
      },
      onClick: () => alert('Card clicked'),
    },
    {
      id: '3',
      icon: <Target size={64} />,
      title: 'Kort spill rundt green',
      description: 'Mestre chip og pitch for bedre scoring.',
      metadata: '6 videoer • 1t 15min',
      actions: {
        primary: {
          label: 'Start kurs',
          onClick: () => alert('Start kurs'),
        },
      },
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400',
      imageAlt: 'Golf bunker',
      title: 'Bunkerslag',
      description: 'Komme ut av sandtraps med selvtillit.',
      badge: 'Snart',
      badgeColor: 'success',
      metadata: 'Lanseres 1. jan 2026',
    },
    {
      id: '5',
      loading: true,
      title: 'Loading...',
      description: '',
    },
  ];

  return (
    <div className="min-h-screen bg-ak-snow p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-[32px] font-bold text-ak-charcoal mb-2">
          UI Templates Lab
        </h1>
        <p className="text-[16px] text-ak-steel">
          Demo og testing av gjenbrukbare UI-maler
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 border-b border-ak-mist">
          <button
            onClick={() => setSelectedTab('list')}
            className={`px-6 py-3 text-[14px] font-medium transition-colors ${
              selectedTab === 'list'
                ? 'text-ak-primary border-b-2 border-ak-primary'
                : 'text-ak-steel hover:text-ak-charcoal'
            }`}
          >
            List Template
          </button>
          <button
            onClick={() => setSelectedTab('cards')}
            className={`px-6 py-3 text-[14px] font-medium transition-colors ${
              selectedTab === 'cards'
                ? 'text-ak-primary border-b-2 border-ak-primary'
                : 'text-ak-steel hover:text-ak-charcoal'
            }`}
          >
            Card Grid Template
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* List Template Examples */}
        {selectedTab === 'list' && (
          <div className="space-y-8">
            {/* Sectioned List */}
            <div>
              <h2 className="text-[20px] font-semibold text-ak-charcoal mb-4">
                Sectioned List with Icons & Badges
              </h2>
              <div className="bg-white rounded-xl border border-ak-mist p-6">
                <ListTemplate sections={listSections} showDividers />
              </div>
            </div>

            {/* Flat List */}
            <div>
              <h2 className="text-[20px] font-semibold text-ak-charcoal mb-4">
                Flat List with Metadata
              </h2>
              <div className="bg-white rounded-xl border border-ak-mist p-6">
                <ListTemplate items={flatListItems} showDividers />
              </div>
            </div>

            {/* Empty State */}
            <div>
              <h2 className="text-[20px] font-semibold text-ak-charcoal mb-4">
                Empty State Example
              </h2>
              <div className="bg-white rounded-xl border border-ak-mist p-6">
                <ListTemplate
                  items={[]}
                  emptyState={{
                    icon: <Inbox size={48} />,
                    title: 'Ingen meldinger',
                    description: 'Du har ingen nye meldinger akkurat nå.',
                    action: {
                      label: 'Se arkiv',
                      onClick: () => alert('Se arkiv'),
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Card Grid Template Examples */}
        {selectedTab === 'cards' && (
          <div className="space-y-8">
            {/* 3 Column Grid */}
            <div>
              <h2 className="text-[20px] font-semibold text-ak-charcoal mb-4">
                3 Column Grid with Images & Actions
              </h2>
              <CardGridTemplate cards={cardItems} columns={3} gap="md" />
            </div>

            {/* 2 Column Grid */}
            <div>
              <h2 className="text-[20px] font-semibold text-ak-charcoal mb-4">
                2 Column Grid
              </h2>
              <CardGridTemplate
                cards={cardItems.slice(0, 4)}
                columns={2}
                gap="lg"
              />
            </div>

            {/* 4 Column Grid */}
            <div>
              <h2 className="text-[20px] font-semibold text-ak-charcoal mb-4">
                4 Column Grid (Small Cards)
              </h2>
              <CardGridTemplate
                cards={cardItems.slice(0, 4)}
                columns={4}
                gap="sm"
              />
            </div>

            {/* Empty State */}
            <div>
              <h2 className="text-[20px] font-semibold text-ak-charcoal mb-4">
                Empty State Example
              </h2>
              <CardGridTemplate
                cards={[]}
                columns={3}
                emptyState={{
                  icon: <Plus size={48} />,
                  title: 'Ingen kurs tilgjengelig',
                  description: 'Nye kurs kommer snart. Hold deg oppdatert!',
                  action: {
                    label: 'Opprett nytt kurs',
                    onClick: () => alert('Opprett kurs'),
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Implementation Examples */}
      <div className="max-w-7xl mx-auto mt-12 p-6 bg-white rounded-xl border border-ak-mist">
        <h2 className="text-[20px] font-semibold text-ak-charcoal mb-4">
          Implementation Examples
        </h2>

        <div className="space-y-6">
          {/* List Template Code */}
          <div>
            <h3 className="text-[16px] font-medium text-ak-charcoal mb-2">
              List Template Usage
            </h3>
            <pre className="bg-ak-snow p-4 rounded-lg text-[13px] text-ak-charcoal overflow-x-auto">
              {`import { ListTemplate } from '@/ui/templates/ListTemplate';

const items = [
  {
    id: '1',
    icon: <Calendar size={20} />,
    title: 'Next training session',
    subtitle: 'Tomorrow at 14:00',
    metadata: '60 min',
    badge: 'New',
    badgeColor: 'primary',
    onClick: () => console.log('Clicked'),
  },
];

<ListTemplate items={items} showDividers />`}
            </pre>
          </div>

          {/* Card Grid Template Code */}
          <div>
            <h3 className="text-[16px] font-medium text-ak-charcoal mb-2">
              Card Grid Template Usage
            </h3>
            <pre className="bg-ak-snow p-4 rounded-lg text-[13px] text-ak-charcoal overflow-x-auto">
              {`import { CardGridTemplate } from '@/ui/templates/CardGridTemplate';

const cards = [
  {
    id: '1',
    image: '/course-image.jpg',
    title: 'Putting Masterclass',
    description: 'Learn advanced putting techniques',
    badge: 'New',
    badgeColor: 'primary',
    actions: {
      primary: {
        label: 'Start course',
        onClick: () => console.log('Start'),
      },
    },
  },
];

<CardGridTemplate cards={cards} columns={3} gap="md" />`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesLab;
