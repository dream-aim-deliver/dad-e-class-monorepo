/**
 * DOM-level z-index regression tests.
 *
 * Each test renders real components, reads the z-index the browser would see,
 * and asserts the stacking relationship holds (X renders above Y).
 * If someone changes a constant or forgets to apply it, these break.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog, DialogContent } from '../lib/components/dialog';
import Tooltip from '../lib/components/tooltip';
import { PurchaseAuthModal } from '../lib/components/purchase-auth-modal';
import { SessionExpirationModal } from '../lib/components/session-expiration-modal';
import { SideMenu } from '../lib/components/sidemenu/sidemenu';
import { CouponSearchDropdown } from '../lib/components/coupon/coupon-search-dropdown';

// ---- shared helpers --------------------------------------------------------

function zOf(el: HTMLElement): number {
  const inline = el.style.zIndex;
  if (inline) return parseInt(inline, 10);
  const match = el.className.match(/z-\[(\d+)\]/);
  if (match) return parseInt(match[1], 10);
  return 0;
}

// ---- mocks -----------------------------------------------------------------

vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => ({
    components: {
      purchaseAuthModal: {
        title: 'Login Required',
        message: 'Please log in',
        loginButtonText: 'Login',
        cancelButtonText: 'Cancel',
      },
      sessionExpirationModal: {
        title: 'Session Expired',
        message: 'Your session has expired',
        unsavedChangesWarning: 'Unsaved changes',
        stayLoggedInText: 'Stay',
        logoutText: 'Logout',
        continueAsVisitorText: 'Continue',
      },
      sideMenu: {
        studentText: 'Student',
        coachText: 'Coach',
        courseCreatorText: 'Creator',
      },
      sendNotificationModal: {},
    },
  }),
  isLocalAware: vi.fn(),
}));

// ---- tests -----------------------------------------------------------------

describe('z-index DOM regression: stacking relationships', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---- Dialog overlay vs panel ---------------------------------------------

  it('dialog panel renders above its own overlay', () => {
    render(
      <Dialog defaultOpen={false} open onOpenChange={() => {}}>
        <DialogContent showCloseButton closeOnOverlayClick closeOnEscape>
          <div>body</div>
        </DialogContent>
      </Dialog>,
    );

    const panel = screen.getByRole('dialog');
    const overlay = document.querySelector('.fixed.inset-0') as HTMLElement;

    expect(zOf(panel)).toBeGreaterThan(zOf(overlay));
  });

  // ---- Tooltip above Dialog ------------------------------------------------

  it('tooltip renders above a dialog', () => {
    render(
      <Dialog defaultOpen={false} open onOpenChange={() => {}}>
        <DialogContent showCloseButton closeOnOverlayClick closeOnEscape>
          <Tooltip
            text="help"
            description="Some help text"
          />
        </DialogContent>
      </Dialog>,
    );

    const dialogPanel = screen.getByRole('dialog');
    const dialogZ = zOf(dialogPanel);

    // Hover over the tooltip trigger to make it visible
    const trigger = screen.getByText('help').closest('div[class*="relative"]') as HTMLElement;
    fireEvent.mouseEnter(trigger);

    const tooltipContent = document.querySelector('[role="tooltip"]') as HTMLElement;
    expect(tooltipContent).not.toBeNull();

    const tooltipZ = zOf(tooltipContent);
    expect(tooltipZ).toBeGreaterThan(dialogZ);
  });

  // ---- PurchaseAuthModal (DIALOG) above add-transaction-modal backdrop (MODAL_BACKDROP) ----

  it('purchase-auth-modal renders above modal-backdrop level', () => {
    // Render a MODAL_BACKDROP-level element and a DIALOG-level element
    // and verify the DIALOG one sits higher.
    const { container } = render(
      <>
        <div data-testid="backdrop-level" className="fixed inset-0" style={{ zIndex: 1100 }} />
        <PurchaseAuthModal
          isOpen
          onLogin={() => {}}
          onCancel={() => {}}
          locale="en"
        />
      </>,
    );

    const backdrop = screen.getByTestId('backdrop-level');
    const modal = document.querySelectorAll('.fixed.inset-0');
    // The PurchaseAuthModal's outer div is the second fixed inset-0
    const purchaseModal = Array.from(modal).find(
      (el) => (el as HTMLElement).style.zIndex && parseInt((el as HTMLElement).style.zIndex, 10) > 1100,
    ) as HTMLElement;

    expect(purchaseModal).toBeTruthy();
    expect(zOf(purchaseModal)).toBeGreaterThan(zOf(backdrop));
  });

  // ---- SessionExpirationModal (DIALOG) above modal-backdrop level ----------

  it('session-expiration-modal renders above modal-backdrop level', () => {
    render(
      <>
        <div data-testid="backdrop-level" className="fixed inset-0" style={{ zIndex: 1100 }} />
        <SessionExpirationModal
          isOpen
          hasUnsavedChanges={false}
          onConfirm={() => {}}
          locale="en"
        />
      </>,
    );

    const backdrop = screen.getByTestId('backdrop-level');
    const modals = document.querySelectorAll('.fixed.inset-0');
    const sessionModal = Array.from(modals).find(
      (el) => (el as HTMLElement).style.zIndex && parseInt((el as HTMLElement).style.zIndex, 10) > 1100,
    ) as HTMLElement;

    expect(sessionModal).toBeTruthy();
    expect(zOf(sessionModal)).toBeGreaterThan(zOf(backdrop));
  });

  // ---- Mobile sidemenu above modal-backdrop --------------------------------

  it('mobile sidemenu renders above modal-backdrop level', () => {
    render(
      <>
        <div data-testid="backdrop-level" className="fixed inset-0" style={{ zIndex: 1100 }} />
        <SideMenu
          userName="Test"
          userRole="student"
          locale="en"
          mode="mobileOverlay"
          onClickToggle={() => {}}
        >
          <div>menu items</div>
        </SideMenu>
      </>,
    );

    const backdrop = screen.getByTestId('backdrop-level');
    const menuContainer = screen.getByTestId('menu-container');

    expect(zOf(menuContainer)).toBeGreaterThan(zOf(backdrop));
  });

  // ---- CouponSearchDropdown portal above sidebar ---------------------------

  it('coupon-search-dropdown portal renders above sidebar level', () => {
    render(
      <>
        <div data-testid="sidebar-level" className="sticky" style={{ zIndex: 1000 }} />
        <CouponSearchDropdown
          mode="single"
          options={[{ label: 'A', value: 'a' }]}
          onSelectionChange={() => {}}
          placeholder="Pick"
        />
      </>,
    );

    const sidebar = screen.getByTestId('sidebar-level');

    // Open the dropdown
    fireEvent.click(screen.getByRole('button'));

    // Find the portal (fixed div with zIndex style containing the option list)
    const portals = document.querySelectorAll('div[style]');
    const dropdownPortal = Array.from(portals).find((el) => {
      const htmlEl = el as HTMLElement;
      return htmlEl.style.position === 'fixed' && htmlEl.style.zIndex;
    }) as HTMLElement;

    expect(dropdownPortal).toBeTruthy();
    expect(zOf(dropdownPortal)).toBeGreaterThan(zOf(sidebar));
  });

  // ---- Dialog (DIALOG) above sidebar (SIDEBAR) ----------------------------

  it('dialog renders above sidebar', () => {
    render(
      <>
        <div data-testid="sidebar-level" className="sticky" style={{ zIndex: 1000 }} />
        <Dialog defaultOpen={false} open onOpenChange={() => {}}>
          <DialogContent showCloseButton closeOnOverlayClick closeOnEscape>
            <div>content</div>
          </DialogContent>
        </Dialog>
      </>,
    );

    const sidebar = screen.getByTestId('sidebar-level');
    const panel = screen.getByRole('dialog');

    expect(zOf(panel)).toBeGreaterThan(zOf(sidebar));
  });

  // ---- Dialog overlay above modal-backdrop ---------------------------------

  it('dialog overlay renders above modal-backdrop level', () => {
    render(
      <>
        <div data-testid="backdrop-level" style={{ zIndex: 1100 }} />
        <Dialog defaultOpen={false} open onOpenChange={() => {}}>
          <DialogContent showCloseButton closeOnOverlayClick closeOnEscape>
            <div>content</div>
          </DialogContent>
        </Dialog>
      </>,
    );

    const backdrop = screen.getByTestId('backdrop-level');
    const overlay = document.querySelector('.fixed.inset-0') as HTMLElement;

    expect(zOf(overlay)).toBeGreaterThan(zOf(backdrop));
  });
});
