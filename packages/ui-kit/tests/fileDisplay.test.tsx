import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileSelector } from '@/components/professionalCard/fileDisplay';

describe('<FileSelector />', () => {
  it('renders default label and file name by default', () => {
    render(<FileSelector />);
    const label = screen.getByText('Upload Document');
    const fileName = screen.getByText('No file selected');

    expect(label).toBeInTheDocument();
    expect(fileName).toBeInTheDocument();
  });

  it('renders upload button when no file is selected', () => {
    const { container } = render(<FileSelector />);
    const uploadButton = container.querySelector(
      '#upload-button-container button',
    );

    expect(uploadButton).toBeInTheDocument();
  });

  it('shows error if file type is not accepted', () => {
    const { container } = render(
      <FileSelector acceptedFileTypes={['application/pdf']} />,
    );
    const uploadButton = container.querySelector(
      '#upload-button-container button',
    );
    const fileInput = screen.getByRole('textbox', {
      hidden: true,
    }) as HTMLInputElement;

    if (uploadButton) fireEvent.click(uploadButton);

    const testFile = new File(['content'], 'test.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    const errorText = screen.getByText(
      'Invalid file type. Please upload a valid document.',
    );
    expect(errorText).toBeInTheDocument();
  });

  it('shows error if file size exceeds the limit', () => {
    const { container } = render(<FileSelector maxSizeInMB={1} />);
    const uploadButton = container.querySelector(
      '#upload-button-container button',
    );
    const fileInput = screen.getByRole('textbox', {
      hidden: true,
    }) as HTMLInputElement;

    if (uploadButton) fireEvent.click(uploadButton);

    // Simulate a large file
    const testFile = new File(['a'.repeat(2 * 1024 * 1024)], 'large-file.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    const errorText = screen.getByText('File size should not exceed 1MB');
    expect(errorText).toBeInTheDocument();
  });

  it('handles successful file upload', () => {
    const handleUpload = vi.fn();
    const { container } = render(<FileSelector onUpload={handleUpload} />);
    const uploadButton = container.querySelector(
      '#upload-button-container button',
    );
    const fileInput = screen.getByRole('textbox', {
      hidden: true,
    }) as HTMLInputElement;

    if (uploadButton) fireEvent.click(uploadButton);

    const testFile = new File(['content'], 'test.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    const uploadedFileName = screen.getByText('test.pdf');
    expect(uploadedFileName).toBeInTheDocument();
    expect(handleUpload).toHaveBeenCalledWith(testFile);
  });

  it('handles file removal', () => {
    const handleRemove = vi.fn();
    const { container } = render(
      <FileSelector
        defaultFile="http://example.com/test.pdf"
        onRemove={handleRemove}
      />,
    );

    // Simulate removing the file
    const removeButton = container.querySelector(
      '#remove-button-container button',
    );

    if (removeButton) fireEvent.click(removeButton);

    // Check that the default state is restored
    const defaultFileName = screen.getByText('No file selected');
    expect(defaultFileName).toBeInTheDocument();
  });
});
