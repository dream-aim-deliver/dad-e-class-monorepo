import type { Meta, StoryObj } from "@storybook/react-vite";
import { DeleteConfirmationModal } from "../../lib/components/delete-confirmation-modal/delete-confirmation-modal";

const meta: Meta<typeof DeleteConfirmationModal> = {
  title: "Components/Modals/DeleteConfirmationModal",
  component: DeleteConfirmationModal,
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
    title: {
      control: "text",
      description: "The title text for the confirmation modal.",
    },
    message: {
      control: "text",
      description: "Optional message to display below the title.",
    },
    onClose: {
      action: "modal-closed",
      description: "Callback triggered when the modal is closed.",
    },
    onDelete: {
      action: "item-deleted",
      description: "Callback triggered when the user confirms deletion.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof DeleteConfirmationModal>;

export const Default: Story = {
  args: {
    locale: "en",
    title: "Delete Topic?",
    onClose: () => {
      alert("Close button clicked");
      console.log("Modal Closed");
    },
    onDelete: () => {
      alert("Item Deleted");
      console.log("Item Deleted");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "The DeleteConfirmationModal in its default state (English). Allows users to confirm or cancel the deletion. Alerts show the close and delete actions.",
      },
    },
  },
};

export const WithMessage: Story = {
  args: {
    locale: "en",
    title: "Delete Topic?",
    message: "This action cannot be undone. All courses associated with this topic will lose their topic assignment.",
    onClose: () => {
      alert("Close button clicked");
      console.log("Modal Closed");
    },
    onDelete: () => {
      alert("Item Deleted");
      console.log("Item Deleted");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "The DeleteConfirmationModal with an additional message explaining the consequences of the deletion.",
      },
    },
  },
};

export const German: Story = {
  args: {
    locale: "de",
    title: "Thema löschen?",
    onClose: () => {
      alert("Schließen geklickt");
      console.log("Modal Geschlossen");
    },
    onDelete: () => {
      alert("Element gelöscht");
      console.log("Element gelöscht");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Das DeleteConfirmationModal im Standardzustand (Deutsch). Ermöglicht Benutzern, das Löschen zu bestätigen oder abzubrechen. Alerts zeigen die Aktionen zum Schließen und Löschen.",
      },
    },
  },
};

export const GermanWithMessage: Story = {
  args: {
    locale: "de",
    title: "Thema löschen?",
    message: "Diese Aktion kann nicht rückgängig gemacht werden. Alle Kurse, die mit diesem Thema verknüpft sind, verlieren ihre Themenzuordnung.",
    onClose: () => {
      alert("Schließen geklickt");
      console.log("Modal Geschlossen");
    },
    onDelete: () => {
      alert("Element gelöscht");
      console.log("Element gelöscht");
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Das DeleteConfirmationModal mit einer zusätzlichen Nachricht, die die Folgen des Löschens erklärt.",
      },
    },
  },
};
