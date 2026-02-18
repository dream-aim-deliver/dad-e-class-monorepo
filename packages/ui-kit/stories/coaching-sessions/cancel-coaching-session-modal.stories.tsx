import type { Meta, StoryObj } from "@storybook/react-vite";
import { CancelCoachingSessionModal } from "../../lib/components/coaching-sessions/cancel-coaching-session-modal";

const meta: Meta<typeof CancelCoachingSessionModal> = {
  title: "Components/CoachingSessionComponents/CancelCoachingSessionModal",
  component: CancelCoachingSessionModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    locale: {
      control: "select",
      options: ["en", "de"],
      description: "The locale for the modal (e.g., for translations).",
    },
    onClose: {
      action: "modal-closed",
      description: "Callback triggered when the modal is closed.",
    },
    onCancel: {
      action: "session-cancelled",
      description: "Callback triggered when the user confirms cancellation.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CancelCoachingSessionModal>;

export const Default: Story = {
  args: {
    locale: "en",
    onClose: () => {
      alert("Close button clicked");
      console.log("Modal Closed");
    },
    onCancel: () => {
      alert("Session Cancelled");
      console.log("Session Cancelled");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "The CancelCoachingSessionModal in its default state (English). Allows users to confirm or cancel the session cancellation. Alerts show the close and cancel actions.",
      },
    },
  },
};

export const German: Story = {
  args: {
    locale: "de",
    onClose: () => {
      alert("Schließen geklickt");
      console.log("Modal Geschlossen");
    },
    onCancel: () => {
      alert("Sitzung storniert");
      console.log("Sitzung storniert");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Das CancelCoachingSessionModal im Standardzustand (Deutsch). Ermöglicht Benutzern, die Stornierung der Sitzung zu bestätigen oder abzubrechen. Alerts zeigen die Aktionen zum Schließen und Stornieren.",
      },
    },
  },
};