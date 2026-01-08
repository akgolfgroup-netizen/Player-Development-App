/**
 * Admin Notification Settings
 */

import React from 'react';
import { Page } from '../../ui/components/Page';
import { Text } from '../../ui/primitives';
import { Bell } from 'lucide-react';

export const NotificationSettingsPage: React.FC = () => {
  return (
    <Page state="idle">
      <Page.Header
        title="Varselinnstillinger"
        subtitle="Konfigurer systemvarsler"
      />

      <Page.Content>
        <Page.Section card={true}>
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto mb-4 text-tier-text-tertiary" />
            <Text variant="title3" color="secondary" className="mb-2">
              Varselinnstillinger
            </Text>
            <Text variant="body" color="tertiary">
              Administrer e-post, push og in-app varsler
            </Text>
          </div>
        </Page.Section>
      </Page.Content>
    </Page>
  );
};

export default NotificationSettingsPage;
