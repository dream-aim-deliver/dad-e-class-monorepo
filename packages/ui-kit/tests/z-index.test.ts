import { describe, it, expect } from 'vitest';
import { Z_INDEX } from '../lib/utils/z-index';

describe('Z_INDEX layering hierarchy', () => {
  it('exports all expected layers', () => {
    expect(Z_INDEX).toHaveProperty('SIDEBAR');
    expect(Z_INDEX).toHaveProperty('MODAL_BACKDROP');
    expect(Z_INDEX).toHaveProperty('SIDEMENU');
    expect(Z_INDEX).toHaveProperty('OVERLAY');
    expect(Z_INDEX).toHaveProperty('DIALOG');
    expect(Z_INDEX).toHaveProperty('POPOVER');
    expect(Z_INDEX).toHaveProperty('TOOLTIP');
  });

  it('sidebar is below modal backdrop', () => {
    expect(Z_INDEX.MODAL_BACKDROP).toBeGreaterThan(Z_INDEX.SIDEBAR);
  });

  it('sidemenu is above modal backdrop', () => {
    expect(Z_INDEX.SIDEMENU).toBeGreaterThan(Z_INDEX.MODAL_BACKDROP);
  });

  it('overlay is above sidemenu', () => {
    expect(Z_INDEX.OVERLAY).toBeGreaterThan(Z_INDEX.SIDEMENU);
  });

  it('dialog is above overlay', () => {
    expect(Z_INDEX.DIALOG).toBeGreaterThan(Z_INDEX.OVERLAY);
  });

  it('popover is above dialog (dropdowns/calendars render over dialogs)', () => {
    expect(Z_INDEX.POPOVER).toBeGreaterThan(Z_INDEX.DIALOG);
  });

  it('tooltip is the topmost layer', () => {
    expect(Z_INDEX.TOOLTIP).toBeGreaterThan(Z_INDEX.POPOVER);
  });

  it('full hierarchy: SIDEBAR < MODAL_BACKDROP < SIDEMENU < OVERLAY < DIALOG < POPOVER < TOOLTIP', () => {
    const ordered = [
      Z_INDEX.SIDEBAR,
      Z_INDEX.MODAL_BACKDROP,
      Z_INDEX.SIDEMENU,
      Z_INDEX.OVERLAY,
      Z_INDEX.DIALOG,
      Z_INDEX.POPOVER,
      Z_INDEX.TOOLTIP,
    ];
    for (let i = 1; i < ordered.length; i++) {
      expect(ordered[i]).toBeGreaterThan(ordered[i - 1]);
    }
  });
});
