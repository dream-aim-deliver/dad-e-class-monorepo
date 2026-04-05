/**
 * Shared z-index constants for consistent layering across the application.
 * Import from @maany_shr/e-class-ui-kit to use in cms/platform apps.
 */
export const Z_INDEX = {
  SIDEBAR: 1000,
  MODAL_BACKDROP: 1100,
  SIDEMENU: 1200,
  OVERLAY: 9998,
  DIALOG: 9999,
  POPOVER: 10000,
  TOOLTIP: 10001,
} as const;
