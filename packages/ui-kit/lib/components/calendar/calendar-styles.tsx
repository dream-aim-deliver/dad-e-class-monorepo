export const calendarStyles = `
  .fc-daygrid-day {
    color: white !important;
  }
  .fc-timegrid-slot, .fc-timegrid-col {
    border-color: var(--color-divider) !important;
  }
  .fc-timegrid-axis {
    background-color: var(--color-input-stroke) !important;
    border-color: var(--color-divider) !important;
  }
  .fc-timegrid-axis-frame {
    display: flex;
    align-items: center;
    justify-content: center;
    border-color: var(--color-divider) !important;
  }
  .fc-timegrid-axis-cushion {
    color: #9CA3AF !important;
    border-color: var(--color-divider) !important;
  }
  .fc-col-header-cell:first-child {
    background-color: var(--color-input-stroke) !important;
    border-color: var(--color-divider) !important;
  }
  .fc-timegrid-axis.fc-scrollgrid-shrink {
    background-color: #1C1917 !important;
  }
  .fc-scrollgrid-shrink-cushion:empty::before {
    content: "GST+5:30";
    color: var(--color-text-primary);
    font-weight: bold;
  }
  .fc-col-header-cell {
    padding: 4px !important;
    background-color: var(--color-input-stroke) !important;
    border-color: var(--color-divider) !important;
  }
  .fc-col-header-cell-cushion {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    color: var(--color-text-primary) !important;
    text-decoration: none !important;
  }
  .day-name {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin-bottom: 1px;
    text-transform: uppercase;
    font-weight: 400;
  }
  .day-number {
    font-size: 20px;
    font-weight: 700;
  }
  .fc-timegrid-axis-cushion, .fc-timegrid-slot-label-cushion {
    color: var(--color-text-secondary) !important;
    background-color: var(--color-input-stroke) !important;
    border-color: var(--color-divider) !important;
  }
  .fc-event {
    border: none !important;
    padding: 0 !important;
    background-color: transparent !important;
  }
  .fc-day-today {
    background-color: var(--color-base-neutral-800) !important;
  }
  .fc-selectable {
    background-color: var(--color-input-stroke) !important;
    cursor: pointer !important;
  }
  .fc-highlight {
    background-color: var(--color-button-primary-fill) !important;
  }
`;