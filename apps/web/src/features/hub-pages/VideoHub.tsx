/**
 * Video Hub Page
 * Consolidated video page with tabs for different video features
 * - Videoer: Instructional videos library
 * - Sammenlign: Side-by-side video comparison
 * - Annotering: Video annotation with drawing tools
 */

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getAreaTabs } from '../../config/player-navigation-v4';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import PageContainer from '../../ui/raw-blocks/PageContainer.raw';
import { AreaTabs } from '../../components/navigation/AreaTabs';
import * as LucideIcons from 'lucide-react';

const { Video, GitCompare, PenTool, Play, Upload, BookOpen } = LucideIcons;

interface VideoHubProps {}

export default function VideoHub({}: VideoHubProps) {
  const location = useLocation();

  // Determine active tab from URL path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/bibliotek')) return 'bibliotek';
    if (path.includes('/sammenligning')) return 'sammenligning';
    if (path.includes('/annotering')) return 'annotering';
    return 'oversikt';
  };

  const activeTab = getActiveTab();

  // Get video tabs from config
  const tabs = getAreaTabs('video');

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'bibliotek':
        return <VideoLibraryTab />;
      case 'sammenligning':
        return <VideoComparisonTab />;
      case 'annotering':
        return <VideoAnnotationTab />;
      default:
        return <VideoOverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-tier-surface-base">
      <PageHeader
        title="Video"
        subtitle="Videoer, sammenligning og annotering"
        helpText="Se instruksjonsvideoer, sammenlign din teknikk, og annot videoer med tegning og notater"
      />

      <PageContainer paddingY="lg" background="base">
        {/* Video Tabs */}
        <AreaTabs tabs={tabs} color="green" className="mb-6" />

        {/* Dynamic Content */}
        {renderContent()}
      </PageContainer>
    </div>
  );
}

/**
 * Overview Tab - Landing page with quick actions
 */
function VideoOverviewTab() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-tier-white to-tier-surface-subtle rounded-2xl p-6 md:p-8 mb-8 border border-tier-border-default shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-tier-status-success text-white">
            <Video size={24} />
          </span>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-tier-navy leading-tight" aria-hidden="true">
              Video
            </div>
            <p className="text-tier-text-secondary mt-1">
              Videoer, sammenligning og annotering
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-tier-white rounded-lg p-4 border border-tier-border-subtle">
            <div className="text-2xl font-bold text-tier-navy">45</div>
            <div className="text-sm text-tier-text-secondary">Instruksjonsvideoer</div>
          </div>
          <div className="bg-tier-white rounded-lg p-4 border border-tier-border-subtle">
            <div className="text-2xl font-bold text-tier-navy">12</div>
            <div className="text-sm text-tier-text-secondary">Mine videoer</div>
          </div>
          <div className="bg-tier-white rounded-lg p-4 border border-tier-border-subtle">
            <div className="text-2xl font-bold text-tier-navy">8</div>
            <div className="text-sm text-tier-text-secondary">Sammenligninger</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/trening/video/bibliotek"
            className="inline-flex items-center gap-2 px-4 py-2 bg-tier-status-success text-white rounded-lg hover:bg-tier-status-success-dark transition-colors"
          >
            <Play size={18} />
            Se videoer
          </Link>
          <Link
            to="/trening/video?tab=sammenligning"
            className="inline-flex items-center gap-2 px-4 py-2 bg-tier-white text-tier-navy border border-tier-border-default rounded-lg hover:bg-tier-surface-subtle transition-colors"
          >
            <GitCompare size={18} />
            Sammenlign
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon={Video}
          title="Videoer"
          description="Se instruksjonsvideoer og læringsressurser"
          href="/trening/video/bibliotek"
        />
        <FeatureCard
          icon={GitCompare}
          title="Sammenlign"
          description="Sammenlign videoer side-ved-side for å analysere teknikk"
          href="/trening/video?tab=sammenligning"
        />
        <FeatureCard
          icon={PenTool}
          title="Annot"
          description="Annot videoer med tegning, linjer og notater"
          href="/trening/video?tab=annotering"
        />
      </div>
    </div>
  );
}

/**
 * Video Library Tab
 */
function VideoLibraryTab() {
  return (
    <div>
      <div className="bg-tier-white rounded-xl p-6 border border-tier-border-default mb-6">
        <h2 className="text-xl font-bold text-tier-navy mb-2">Instruksjonsvideoer</h2>
        <p className="text-tier-text-secondary mb-4">
          Utforsk biblioteket med instruksjonsvideoer og læringsressurser
        </p>

        {/* Placeholder - this would be replaced with actual video library implementation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-tier-surface-subtle rounded-lg p-4 border border-tier-border-subtle">
              <div className="aspect-video bg-tier-surface-base rounded mb-3 flex items-center justify-center">
                <Video className="text-tier-text-tertiary" size={32} />
              </div>
              <h3 className="font-semibold text-tier-navy mb-1">Video tittel {i}</h3>
              <p className="text-sm text-tier-text-secondary">Beskrivelse av video innhold</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-tier-status-info-light rounded-xl p-4 border border-tier-status-info">
        <div className="flex items-start gap-3">
          <BookOpen className="text-tier-status-info-dark flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-tier-status-info-dark mb-1">Tips</h3>
            <p className="text-sm text-tier-status-info-dark">
              Klikk på en video for å se den i fullskjerm. Du kan også laste opp dine egne videoer for analyse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Video Comparison Tab
 */
function VideoComparisonTab() {
  return (
    <div>
      <div className="bg-tier-white rounded-xl p-6 border border-tier-border-default">
        <h2 className="text-xl font-bold text-tier-navy mb-2">Video sammenligning</h2>
        <p className="text-tier-text-secondary mb-6">
          Sammenlign videoer side-ved-side for å analysere teknikk og fremgang
        </p>

        {/* Placeholder for video comparison interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="aspect-video bg-tier-surface-base rounded-lg border-2 border-dashed border-tier-border-default flex items-center justify-center">
            <div className="text-center">
              <GitCompare className="text-tier-text-tertiary mx-auto mb-2" size={48} />
              <p className="text-tier-text-secondary">Velg første video</p>
            </div>
          </div>
          <div className="aspect-video bg-tier-surface-base rounded-lg border-2 border-dashed border-tier-border-default flex items-center justify-center">
            <div className="text-center">
              <GitCompare className="text-tier-text-tertiary mx-auto mb-2" size={48} />
              <p className="text-tier-text-secondary">Velg andre video</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-tier-status-success text-white rounded-lg hover:bg-tier-status-success-dark transition-colors">
            <Upload className="inline mr-2" size={18} />
            Last opp video
          </button>
          <button className="px-4 py-2 bg-tier-white text-tier-navy border border-tier-border-default rounded-lg hover:bg-tier-surface-subtle transition-colors">
            Velg fra bibliotek
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Video Annotation Tab
 */
function VideoAnnotationTab() {
  return (
    <div>
      <div className="bg-tier-white rounded-xl p-6 border border-tier-border-default">
        <h2 className="text-xl font-bold text-tier-navy mb-2">Video annotasjon</h2>
        <p className="text-tier-text-secondary mb-6">
          Annot videoer med tegning, linjer og notater for detaljert analyse
        </p>

        {/* Placeholder for video annotation interface */}
        <div className="aspect-video bg-tier-surface-base rounded-lg border border-tier-border-default mb-6 flex items-center justify-center">
          <div className="text-center">
            <PenTool className="text-tier-text-tertiary mx-auto mb-2" size={48} />
            <p className="text-tier-text-secondary">Velg en video for å annotere</p>
          </div>
        </div>

        {/* Annotation tools */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="px-3 py-2 bg-tier-surface-subtle text-tier-navy rounded-lg hover:bg-tier-surface-base transition-colors">
            Tegn linje
          </button>
          <button className="px-3 py-2 bg-tier-surface-subtle text-tier-navy rounded-lg hover:bg-tier-surface-base transition-colors">
            Sirkel
          </button>
          <button className="px-3 py-2 bg-tier-surface-subtle text-tier-navy rounded-lg hover:bg-tier-surface-base transition-colors">
            Pil
          </button>
          <button className="px-3 py-2 bg-tier-surface-subtle text-tier-navy rounded-lg hover:bg-tier-surface-base transition-colors">
            Tekst
          </button>
          <button className="px-3 py-2 bg-tier-surface-subtle text-tier-navy rounded-lg hover:bg-tier-surface-base transition-colors">
            Vinkelmåler
          </button>
        </div>

        <button className="px-4 py-2 bg-tier-status-success text-white rounded-lg hover:bg-tier-status-success-dark transition-colors">
          <Upload className="inline mr-2" size={18} />
          Last opp video
        </button>
      </div>
    </div>
  );
}

/**
 * Feature Card Component
 */
interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}

function FeatureCard({ icon: Icon, title, description, href }: FeatureCardProps) {
  return (
    <Link
      to={href}
      className="bg-tier-white rounded-xl p-6 border border-tier-border-default hover:border-tier-status-success hover:shadow-md transition-all group"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-tier-status-success-light text-tier-status-success mb-4 group-hover:bg-tier-status-success group-hover:text-white transition-colors">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-semibold text-tier-navy mb-2">{title}</h3>
      <p className="text-tier-text-secondary text-sm">{description}</p>
    </Link>
  );
}
