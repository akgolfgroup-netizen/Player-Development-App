/**
 * Admin Error Log Viewer
 */

import React from 'react';
import { Page } from '../../ui/components/Page';
import { Text } from '../../ui/primitives';
import { AlertCircle } from 'lucide-react';

export const ErrorLogPage: React.FC = () => {
  return (
    <Page state="idle">
      <Page.Header
        title="Feillogg"
        subtitle="Systemfeil og advarsler"
      />

      <Page.Content>
        <Page.Section card={true}>
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto mb-4 text-tier-text-tertiary" />
            <Text variant="title3" color="secondary" className="mb-2">
              Feillogg
            </Text>
            <Text variant="body" color="tertiary">
              Oversikt over systemfeil og advarsler
            </Text>
          </div>
        </Page.Section>
      </Page.Content>
    </Page>
  );
};

export default ErrorLogPage;
