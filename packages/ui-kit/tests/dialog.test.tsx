import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Dialog, DialogContent } from '../lib/components/dialog';

describe('<Dialog /> z-index and positioning', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderOpenDialog(props: { className?: string } = {}) {
    return render(
      <Dialog defaultOpen={false} open={true} onOpenChange={() => {}}>
        <DialogContent
          showCloseButton
          closeOnOverlayClick
          closeOnEscape
          className={props.className}
        >
          <div data-testid="dialog-body">Dialog content here</div>
        </DialogContent>
      </Dialog>,
    );
  }

  function getOverlay() {
    // The overlay is the fixed div with the backdrop blur
    const overlays = document.querySelectorAll('.fixed.inset-0');
    return overlays[0] as HTMLElement | undefined;
  }

  function getPanel() {
    const panel = screen.getByRole('dialog');
    return panel as HTMLElement;
  }

  function getZIndex(el: HTMLElement): number {
    // Check inline style first, then computed
    const inlineZ = el.style.zIndex;
    if (inlineZ) return parseInt(inlineZ, 10);
    const computed = window.getComputedStyle(el).zIndex;
    if (computed && computed !== 'auto') return parseInt(computed, 10);
    // Check class-based z-index (e.g., z-[9998])
    const match = el.className.match(/z-\[(\d+)\]/);
    if (match) return parseInt(match[1], 10);
    return 0;
  }

  it('renders the close button inside the dialog panel', () => {
    renderOpenDialog();

    const closeButton = screen.getByLabelText('Close dialog');
    const panel = getPanel();

    expect(closeButton).toBeInTheDocument();
    expect(panel.contains(closeButton)).toBe(true);
  });

  it('positions the close button in the top-right corner of the panel', () => {
    renderOpenDialog();

    const closeButton = screen.getByLabelText('Close dialog');
    const closeWrapper = closeButton.closest('div.absolute');

    expect(closeWrapper).not.toBeNull();
    expect(closeWrapper).toHaveClass('absolute');
    expect(closeWrapper).toHaveClass('right-3');
    expect(closeWrapper).toHaveClass('top-3');
  });

  it('dialog panel z-index is higher than the overlay z-index', () => {
    renderOpenDialog();

    const overlay = getOverlay();
    const panel = getPanel();

    expect(overlay).toBeDefined();
    const overlayZ = getZIndex(overlay!);
    const panelZ = getZIndex(panel);

    expect(panelZ).toBeGreaterThan(overlayZ);
  });

  it('close button z-index is higher than the scroll fade z-index', () => {
    renderOpenDialog();

    const closeButton = screen.getByLabelText('Close dialog');
    const closeWrapper = closeButton.closest('div.absolute') as HTMLElement;

    // Close wrapper has z-50 class
    expect(closeWrapper).toHaveClass('z-50');

    // Fade elements (if they exist) have z-10
    const fades = document.querySelectorAll('[aria-hidden="true"].pointer-events-none');
    fades.forEach((fade) => {
      expect(fade).toHaveClass('z-10');
      // z-50 > z-10
    });
  });

  it('does not apply overflow-hidden on the dialog panel', () => {
    renderOpenDialog();

    const panel = getPanel();

    // The panel should NOT have overflow-hidden, so child popovers are not clipped
    expect(panel.className).not.toContain('overflow-hidden');
  });

  it('the scroll container inside the panel has overflow-y-auto', () => {
    renderOpenDialog();

    const panel = getPanel();
    const scrollContainer = panel.querySelector('.overflow-y-auto');

    expect(scrollContainer).not.toBeNull();
  });

  it('closes the dialog when the close button is clicked', () => {
    const onOpenChange = vi.fn();

    render(
      <Dialog defaultOpen={false} open={true} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton closeOnOverlayClick closeOnEscape>
          <div>Content</div>
        </DialogContent>
      </Dialog>,
    );

    const closeButton = screen.getByLabelText('Close dialog');
    fireEvent.click(closeButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes the dialog when the overlay is clicked', () => {
    const onOpenChange = vi.fn();

    render(
      <Dialog defaultOpen={false} open={true} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton closeOnOverlayClick closeOnEscape>
          <div>Content</div>
        </DialogContent>
      </Dialog>,
    );

    const overlay = getOverlay();
    expect(overlay).toBeDefined();
    fireEvent.mouseDown(overlay!);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes the dialog on Escape key', async () => {
    const onOpenChange = vi.fn();

    render(
      <Dialog defaultOpen={false} open={true} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton closeOnOverlayClick closeOnEscape>
          <div>Content</div>
        </DialogContent>
      </Dialog>,
    );

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders dialog body content when open', () => {
    renderOpenDialog();

    expect(screen.getByTestId('dialog-body')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-body')).toHaveTextContent('Dialog content here');
  });
});
