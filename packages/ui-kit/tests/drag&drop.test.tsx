import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DragAndDrop } from '../lib/components/drag&drop/drag&drop';

describe('DragAndDrop Component', () => {
  it('renders without crashing', () => {
    render(
      <DragAndDrop
        onUpload={vi.fn()}
        text={{
          title: 'Drop your files here',
          buttontext: 'Upload',
          dragtext: 'or drag and drop',
          filesize: 'Max file size',
        }}
      />,
    );

    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(screen.getByText('or drag and drop')).toBeInTheDocument();
    expect(
      screen.getByText(/Max file size: \d+(\.\d+)? MB/),
    ).toBeInTheDocument();
  });

  it('calls onUpload when files are dropped', async () => {
    const onUploadMock = vi.fn();
    render(
      <DragAndDrop
        onUpload={onUploadMock}
        text={{
          title: 'Drop your files here',
          buttontext: 'Upload',
          dragtext: 'or drag and drop',
          filesize: 'Max file size',
        }}
      />,
    );

    const input = screen.getByTestId('file-input').querySelector('input');
    if (input) {
      const file = new File(['dummy content'], 'example.png', {
        type: 'image/png',
      });
      await act(async () => {
        fireEvent.change(input, { target: { files: [file] } });
      });

      expect(onUploadMock).toHaveBeenCalledWith([file]);
    }
  });
});
