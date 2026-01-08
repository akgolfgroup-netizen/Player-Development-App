/**
 * Admin Audit Log Viewer
 */

import React from 'react';
import { Page } from '../../ui/components/Page';
import { Text } from '../../ui/primitives';
import { FileText } from 'lucide-react';

export const AuditLogPage: React.FC = () => {
  return (
    <Page state="idle">
      <Page.Header
        title="Audit-logg"
        subtitle="System aktivitetslogg"
      />

      <Page.Content>
        <Page.Section card={true}>
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto mb-4 text-ak-text-tertiary" />
            <Text variant="title3" color="secondary" className="mb-2">
              Audit-logg
            </Text>
            <Text variant="body" color="tertiary">
              System for sporing av brukeraktiviteter og endringer
            </Text>
          </div>
        </Page.Section>
      </Page.Content>
    </Page>
  );
};

export default AuditLogPage;
