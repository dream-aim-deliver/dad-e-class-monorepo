import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ProfilePicture } from '@/components/profile/profile-picture';

describe('<ProfilePicture />', () => {
  it('renders default image and label by default', () => {
    render(<ProfilePicture />);
    const label = screen.getByText('Profile Picture');

    expect(label).toBeInTheDocument();
  });

  it('displays the default file name', () => {
    render(<ProfilePicture />);
    const fileName = screen.getByText('No file selected');
    expect(fileName).toBeInTheDocument();
  });

  it('renders upload button when the default image is displayed', () => {
    const { container } = render(<ProfilePicture />);

    // Query the container by ID and then find the button
    const uploadButton = container.querySelector(
      '#upload-button-container button',
    );

    expect(uploadButton).toBeInTheDocument();
  });

  it('shows error if file type is not accepted', () => {
    const { container } = render(
      <ProfilePicture acceptedFileTypes={['image/jpeg']} />,
    );
    const uploadButton = container.querySelector(
      '#upload-button-container button',
    );
    const fileInput = screen.getByRole('textbox', {
      hidden: true,
    }) as HTMLInputElement;

    if (uploadButton) fireEvent.click(uploadButton);

    const testFile = new File(['content'], 'test.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    const errorText = screen.getByText(
      'Invalid file type. Please upload a valid image file.',
    );
    expect(errorText).toBeInTheDocument();
  });

  it('handles remove', () => {
    const handleRemove = vi.fn();
    const { container } = render(
      <ProfilePicture
        onRemove={handleRemove}
        defaultImage="/api/placeholder/64/64"
      />,
    );
    const uploadButton = container.querySelector(
      '#upload-button-container button',
    );
    const fileInput = screen.getByRole('textbox', {
      hidden: true,
    }) as HTMLInputElement;

    if (uploadButton) fireEvent.click(uploadButton);

    const testFile = new File(['content'], 'test.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    const removeButton = container.querySelector(
      '#remove-button-container button',
    );

    if (removeButton) fireEvent.click(removeButton);

    const defaultFileName = screen.getByText('No file selected');
    expect(defaultFileName).toBeInTheDocument();
  });
});
