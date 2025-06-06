export const calendarStyles = `
/* General calendar styles */
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

/* Month view specific styles */
.fc-daygrid-day-frame {
  border-color: var(--color-divider) !important; /* Consistent row/column borders */
  background-color: var(--color-input-stroke) !important; /* Consistent background */
  padding: 4px !important; /* Add padding to the entire day cell */
}

.fc-daygrid-day-top {
  display: flex;
  justify-content: flex-end; /* Align to the right */
  align-items: flex-start; /* Align to the top */
  padding: 4px 4px 0 0; /* Add padding to top-right corner */
}

.fc-daygrid-day-number {
  font-size: 14px;
  color: var(--color-text-primary);
  text-decoration: none !important;
  padding: 2px 4px; /* Padding around the day number */
}

/* Today's date in month view */
.fc-day-today .fc-daygrid-day-number {
  background-color: var(--color-button-primary-fill) !important; /* Circle background */
  color: black !important; /* Black text */
  border-radius: 50% !important; /* Circular shape */
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Day headers in month view (first row) */
.fc-daygrid .fc-col-header-cell .fc-col-header-cell-cushion {
  display: block !important; /* Override flex to show only day name */
}

.fc-daygrid .fc-col-header-cell .day-name {
  margin-bottom: 0; /* Remove margin for day name */
}

.fc-daygrid .fc-col-header-cell .day-number {
  display: none !important; /* Hide day number in month view headers */
}
`;