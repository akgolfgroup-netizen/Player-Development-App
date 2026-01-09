/**
 * ============================================================
 * ActionButton - Semantiske knapper for vanlige handlinger
 * TIER Golf Design System v3.1
 * ============================================================
 *
 * Gir utviklere enkle, semantiske knapper for vanlige brukstilfeller.
 * Bruker riktig farge automatisk basert på handlingstype.
 *
 * Bruk:
 * <ActionButton.Save onClick={handleSave} />
 * <ActionButton.Cancel onClick={handleCancel} />
 * <ActionButton.Delete onClick={handleDelete} />
 *
 * ============================================================
 */

import React from 'react';
import { Button, type ButtonProps } from '../shadcn/button';
import {
  Save,
  X,
  Trash2,
  Plus,
  Edit,
  Check,
  ArrowLeft,
  ArrowRight,
  Send,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Copy,
  Share2,
  Settings,
  type LucideIcon,
} from 'lucide-react';

type ActionButtonProps = Omit<ButtonProps, 'variant'> & {
  loading?: boolean;
  loadingText?: string;
};

// Helper for å lage action buttons
function createActionButton(
  Icon: LucideIcon,
  defaultLabel: string,
  variant: ButtonProps['variant'],
  defaultSize: ButtonProps['size'] = 'default'
) {
  const ActionButtonComponent = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
    ({ children, loading, loadingText, disabled, size = defaultSize, ...props }, ref) => {
      return (
        <Button
          ref={ref}
          variant={variant}
          size={size}
          disabled={disabled || loading}
          {...props}
        >
          {loading ? (
            <>
              <RefreshCw className="animate-spin" size={16} />
              {loadingText || children || defaultLabel}
            </>
          ) : (
            <>
              <Icon size={16} />
              {children || defaultLabel}
            </>
          )}
        </Button>
      );
    }
  );
  ActionButtonComponent.displayName = `ActionButton`;
  return ActionButtonComponent;
}

// ═══════════════════════════════════════════════════════════
// PRIMÆRE HANDLINGER (Gull)
// ═══════════════════════════════════════════════════════════

/** Lagre - Primær handling */
export const SaveButton = createActionButton(Save, 'Lagre', 'default');

/** Send - Primær handling */
export const SendButton = createActionButton(Send, 'Send', 'default');

/** Opprett - Primær handling */
export const CreateButton = createActionButton(Plus, 'Opprett', 'default');

/** Legg til - Primær handling */
export const AddButton = createActionButton(Plus, 'Legg til', 'default');

// ═══════════════════════════════════════════════════════════
// SEKUNDÆRE HANDLINGER (Navy outline)
// ═══════════════════════════════════════════════════════════

/** Avbryt - Sekundær handling */
export const CancelButton = createActionButton(X, 'Avbryt', 'outline');

/** Tilbake - Sekundær handling */
export const BackButton = createActionButton(ArrowLeft, 'Tilbake', 'outline');

/** Neste - Sekundær handling */
export const NextButton = createActionButton(ArrowRight, 'Neste', 'outline');

/** Rediger - Sekundær handling */
export const EditButton = createActionButton(Edit, 'Rediger', 'outline');

// ═══════════════════════════════════════════════════════════
// DESTRUKTIVE HANDLINGER (Rød)
// ═══════════════════════════════════════════════════════════

/** Slett - Destruktiv handling */
export const DeleteButton = createActionButton(Trash2, 'Slett', 'destructive');

/** Fjern - Destruktiv handling */
export const RemoveButton = createActionButton(X, 'Fjern', 'destructive');

// ═══════════════════════════════════════════════════════════
// BEKREFTELSE (Grønn)
// ═══════════════════════════════════════════════════════════

/** Bekreft - Suksess handling */
export const ConfirmButton = createActionButton(Check, 'Bekreft', 'success');

/** Godkjenn - Suksess handling */
export const ApproveButton = createActionButton(Check, 'Godkjenn', 'success');

// ═══════════════════════════════════════════════════════════
// TERTIÆRE HANDLINGER (Grå)
// ═══════════════════════════════════════════════════════════

/** Last ned - Tertiær handling */
export const DownloadButton = createActionButton(Download, 'Last ned', 'secondary');

/** Last opp - Tertiær handling */
export const UploadButton = createActionButton(Upload, 'Last opp', 'secondary');

/** Kopier - Tertiær handling */
export const CopyButton = createActionButton(Copy, 'Kopier', 'secondary');

/** Del - Tertiær handling */
export const ShareButton = createActionButton(Share2, 'Del', 'secondary');

/** Vis - Tertiær handling */
export const ViewButton = createActionButton(Eye, 'Vis', 'secondary');

/** Innstillinger - Tertiær handling */
export const SettingsButton = createActionButton(Settings, 'Innstillinger', 'secondary');

/** Oppdater - Tertiær handling */
export const RefreshButton = createActionButton(RefreshCw, 'Oppdater', 'secondary');

// ═══════════════════════════════════════════════════════════
// ICON-ONLY BUTTONS
// ═══════════════════════════════════════════════════════════

type IconButtonProps = Omit<ButtonProps, 'variant' | 'size' | 'children'> & {
  'aria-label': string;
};

function createIconButton(Icon: LucideIcon, variant: ButtonProps['variant']) {
  const IconButtonComponent = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ 'aria-label': ariaLabel, ...props }, ref) => {
      return (
        <Button
          ref={ref}
          variant={variant}
          size="icon"
          aria-label={ariaLabel}
          {...props}
        >
          <Icon size={18} />
        </Button>
      );
    }
  );
  IconButtonComponent.displayName = `IconButton`;
  return IconButtonComponent;
}

/** Lukk ikon-knapp */
export const CloseIconButton = createIconButton(X, 'ghost');

/** Rediger ikon-knapp */
export const EditIconButton = createIconButton(Edit, 'ghost');

/** Slett ikon-knapp */
export const DeleteIconButton = createIconButton(Trash2, 'ghost');

/** Legg til ikon-knapp */
export const AddIconButton = createIconButton(Plus, 'ghost');

/** Kopier ikon-knapp */
export const CopyIconButton = createIconButton(Copy, 'ghost');

/** Innstillinger ikon-knapp */
export const SettingsIconButton = createIconButton(Settings, 'ghost');

// ═══════════════════════════════════════════════════════════
// SAMLET EKSPORT
// ═══════════════════════════════════════════════════════════

export const ActionButton = {
  // Primære
  Save: SaveButton,
  Send: SendButton,
  Create: CreateButton,
  Add: AddButton,

  // Sekundære
  Cancel: CancelButton,
  Back: BackButton,
  Next: NextButton,
  Edit: EditButton,

  // Destruktive
  Delete: DeleteButton,
  Remove: RemoveButton,

  // Bekreftelse
  Confirm: ConfirmButton,
  Approve: ApproveButton,

  // Tertiære
  Download: DownloadButton,
  Upload: UploadButton,
  Copy: CopyButton,
  Share: ShareButton,
  View: ViewButton,
  Settings: SettingsButton,
  Refresh: RefreshButton,

  // Ikon-only
  CloseIcon: CloseIconButton,
  EditIcon: EditIconButton,
  DeleteIcon: DeleteIconButton,
  AddIcon: AddIconButton,
  CopyIcon: CopyIconButton,
  SettingsIcon: SettingsIconButton,
};

export default ActionButton;
