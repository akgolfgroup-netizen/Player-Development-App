/**
 * Admin Tier Features Management
 */

import React from 'react';
import { Page } from '../../ui/components/Page';
import { Text } from '../../ui/primitives';
import { Crown } from 'lucide-react';

export const TierFeaturesPage: React.FC = () => {
  return (
    <Page state="idle">
      <Page.Header
        title="Funksjoner per nivå"
        subtitle="Administrer funksjonalitet for hver tier"
      />

      <Page.Content>
        <Page.Section card={true}>
          <div className="text-center py-12">
            <Crown size={48} className="mx-auto mb-4 text-ak-text-tertiary" />
            <Text variant="title3" color="secondary" className="mb-2">
              Tier Features
            </Text>
            <Text variant="body" color="tertiary">
              Konfigurer hvilke funksjoner som er tilgjengelige på hvert abonnementsnivå
            </Text>
          </div>
        </Page.Section>
      </Page.Content>
    </Page>
  );
};

export default TierFeaturesPage;
