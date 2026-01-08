/**
 * Admin Panel Page
 * System administration dashboard (admin role required)
 */

import React, { useState } from 'react';
import { Shield, Activity, Flag, Headphones, DollarSign, Plus, Edit2, Trash2, CheckCircle, XCircle, FileText } from 'lucide-react';
import {
  useSystemStatus,
  useFeatureFlags,
  useCreateFeatureFlag,
  useUpdateFeatureFlag,
  useDeleteFeatureFlag,
  useSupportCases,
  useUpdateSupportCase,
  useTiers,
} from '../../hooks/useAdmin.js';
import { useAuditEvents } from '../../hooks/useAuditLog.js';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import PageHeader from '../../components/layout/PageHeader';

const AdminPanelPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'flags' | 'support' | 'tiers' | 'audit'>('system');

  const tabs = [
    { id: 'system', label: 'System Status', icon: <Activity size={16} /> },
    { id: 'flags', label: 'Feature Flags', icon: <Flag size={16} /> },
    { id: 'support', label: 'Support Cases', icon: <Headphones size={16} /> },
    { id: 'tiers', label: 'Subscription Tiers', icon: <DollarSign size={16} /> },
    { id: 'audit', label: 'Audit Log', icon: <FileText size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-tier-surface-base p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Admin Panel"
          subtitle="System administration and management"
          icon={<Shield size={28} className="text-tier-error" />}
        />

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-tier-border-default">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-tier-navy text-tier-navy font-semibold'
                  : 'border-transparent text-tier-text-secondary hover:text-tier-navy'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'system' && <SystemStatusTab />}
        {activeTab === 'flags' && <FeatureFlagsTab />}
        {activeTab === 'support' && <SupportCasesTab />}
        {activeTab === 'tiers' && <TiersTab />}
      </div>
    </div>
  );
};

// ============================================================================
// System Status Tab
// ============================================================================

const SystemStatusTab: React.FC = () => {
  const { status, loading, error } = useSystemStatus();

  if (loading) return <Card><div className="p-8 text-center text-tier-text-secondary">Loading...</div></Card>;
  if (error) return <Card><div className="p-8 text-center text-tier-error">{error}</div></Card>;
  if (!status) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <div className="p-6">
          <p className="text-sm text-tier-text-secondary mb-1">Environment</p>
          <p className="text-2xl font-bold text-tier-navy capitalize">{status.environment}</p>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <p className="text-sm text-tier-text-secondary mb-1">Version</p>
          <p className="text-2xl font-bold text-tier-navy">{status.version}</p>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <p className="text-sm text-tier-text-secondary mb-1">Uptime (hours)</p>
          <p className="text-2xl font-bold text-tier-navy">{status.uptimeHours}</p>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <p className="text-sm text-tier-text-secondary mb-1">Response Time</p>
          <p className="text-2xl font-bold text-tier-navy">{status.responseTime}ms</p>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <p className="text-sm text-tier-text-secondary mb-1">Total Users</p>
          <p className="text-2xl font-bold text-tier-navy">{status.counts.users}</p>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <p className="text-sm text-tier-text-secondary mb-1">Total Coaches</p>
          <p className="text-2xl font-bold text-tier-navy">{status.counts.coaches}</p>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <p className="text-sm text-tier-text-secondary mb-1">Total Players</p>
          <p className="text-2xl font-bold text-tier-navy">{status.counts.players}</p>
        </div>
      </Card>
    </div>
  );
};

// ============================================================================
// Feature Flags Tab
// ============================================================================

const FeatureFlagsTab: React.FC = () => {
  const { flags, loading, error, refetch } = useFeatureFlags();
  const { updateFlag } = useUpdateFeatureFlag();
  const { deleteFlag } = useDeleteFeatureFlag();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleToggle = async (flagId: string, currentEnabled: boolean) => {
    try {
      await updateFlag(flagId, { enabled: !currentEnabled });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (flagId: string) => {
    if (!confirm('Delete this feature flag?')) return;
    try {
      await deleteFlag(flagId);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Card><div className="p-8 text-center text-tier-text-secondary">Loading...</div></Card>;
  if (error) return <Card><div className="p-8 text-center text-tier-error">{error}</div></Card>;

  return (
    <div>
      <div className="mb-4">
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setShowCreateModal(true)}>
          New Feature Flag
        </Button>
      </div>

      <div className="grid gap-4">
        {flags.map((flag: any) => (
          <Card key={flag.id}>
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-semibold text-tier-navy">{flag.name}</p>
                  {flag.enabled ? (
                    <span className="px-2 py-1 bg-tier-success-light text-tier-success text-xs rounded">Enabled</span>
                  ) : (
                    <span className="px-2 py-1 bg-tier-border-default text-tier-text-secondary text-xs rounded">Disabled</span>
                  )}
                </div>
                <p className="text-sm text-tier-text-secondary">{flag.description}</p>
                <p className="text-xs text-tier-text-tertiary mt-1">Key: {flag.key}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggle(flag.id, flag.enabled)}
                  className={`p-2 rounded ${
                    flag.enabled ? 'bg-tier-success-light hover:bg-tier-success' : 'bg-tier-border-default hover:bg-tier-navy-light'
                  }`}
                >
                  {flag.enabled ? <CheckCircle size={16} className="text-tier-success" /> : <XCircle size={16} className="text-tier-text-secondary" />}
                </button>
                <button
                  onClick={() => handleDelete(flag.id)}
                  className="p-2 hover:bg-tier-error-light rounded"
                >
                  <Trash2 size={16} className="text-tier-error" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showCreateModal && (
        <CreateFeatureFlagModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// Support Cases Tab
// ============================================================================

const SupportCasesTab: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { cases, loading, error, refetch } = useSupportCases({ status: statusFilter });
  const { updateCase } = useUpdateSupportCase();

  const handleStatusChange = async (caseId: string, newStatus: string) => {
    try {
      await updateCase(caseId, { status: newStatus });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Card><div className="p-8 text-center text-tier-text-secondary">Loading...</div></Card>;
  if (error) return <Card><div className="p-8 text-center text-tier-error">{error}</div></Card>;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {['', 'open', 'in_progress', 'closed'].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setStatusFilter(status)}
          >
            {status || 'All'}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {cases.map((supportCase: any) => (
          <Card key={supportCase.id}>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-tier-navy">{supportCase.title}</p>
                  <p className="text-sm text-tier-text-secondary mt-1">{supportCase.description}</p>
                </div>
                <select
                  value={supportCase.status}
                  onChange={(e) => handleStatusChange(supportCase.id, e.target.value)}
                  className="px-3 py-1 border border-tier-border-default rounded text-sm"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="flex items-center gap-4 text-xs text-tier-text-secondary">
                <span>Priority: {supportCase.priority}</span>
                <span>Created: {new Date(supportCase.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Tiers Tab
// ============================================================================

const TiersTab: React.FC = () => {
  const { tiers, loading, error } = useTiers();

  if (loading) return <Card><div className="p-8 text-center text-tier-text-secondary">Loading...</div></Card>;
  if (error) return <Card><div className="p-8 text-center text-tier-error">{error}</div></Card>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tiers.map((tier: any) => (
        <Card key={tier.id}>
          <div className="p-6">
            <h3 className="text-xl font-bold text-tier-navy mb-2">{tier.name}</h3>
            <p className="text-3xl font-bold text-tier-navy mb-4">${tier.price}<span className="text-sm text-tier-text-secondary">/{tier.interval}</span></p>
            <div className="space-y-2">
              {Object.entries(tier.features).map(([feature, enabled]: [string, any]) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  {enabled ? (
                    <CheckCircle size={16} className="text-tier-success" />
                  ) : (
                    <XCircle size={16} className="text-tier-text-tertiary" />
                  )}
                  <span className={enabled ? 'text-tier-navy' : 'text-tier-text-tertiary'}>{feature.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// ============================================================================
// Create Feature Flag Modal
// ============================================================================

interface CreateFeatureFlagModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateFeatureFlagModal: React.FC<CreateFeatureFlagModalProps> = ({ onClose, onSuccess }) => {
  const { createFlag, loading } = useCreateFeatureFlag();
  const [formData, setFormData] = useState({ key: '', name: '', description: '', enabled: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFlag(formData);
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-tier-navy mb-4">New Feature Flag</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-tier-navy mb-1">Key</label>
            <input
              type="text"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              className="w-full px-3 py-2 border border-tier-border-default rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-tier-navy mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-tier-border-default rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-tier-navy mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-tier-border-default rounded"
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
            />
            <label className="text-sm text-tier-navy">Enabled</label>
          </div>
          <div className="flex gap-3">
            <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanelPage;
