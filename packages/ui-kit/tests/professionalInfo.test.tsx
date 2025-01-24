import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfessionalInfo } from '@/components/professionalCard/ProfessionalInfo';

// Mock dependencies to isolate the component
vi.mock('../components/button', () => ({
    Button: vi.fn(({ children, onClick, ...props }) => (
        <button onClick={onClick} {...props}>{children}</button>
    ))
}));

vi.mock('../components/professionalCard/FileDisplay', () => ({
    FileSelector: vi.fn(({ onUpload, onRemove, ...props }) => (
        <div data-testid="file-selector">
            <button data-testid="upload-button" onClick={() => onUpload('mockFile')}>Upload</button>
            <button data-testid="remove-button" onClick={() => onRemove()}>Remove</button>
        </div>
    ))
}));

describe('ProfessionalInfo Component', () => {
    const mockInitialData = {
        bio: 'Test bio',
        linkedinUrl: 'https://linkedin.com/test',
        curriculumVitae: 'cv.pdf',
        portfolioWebsite: 'https://portfolio.com',
        associatedCompanyName: 'Test Company',
        associatedCompanyRole: 'Software Engineer',
        associatedCompanyIndustry: 'Technology',
        skills: ['Skill 1'],
        isPrivateProfile: false,
    };

    const mockOnSave = vi.fn();

    it('opens and closes skills modal', async () => {
        render(<ProfessionalInfo onSave={mockOnSave} />);
        const addSkillsButton = screen.getByText(/Add Skills/i);
        await userEvent.click(addSkillsButton);
        expect(screen.getByText(/Select Skills/i)).toBeInTheDocument();
        const closeModalButton = screen.getByTestId('close-modal-button');
        await userEvent.click(closeModalButton);
        expect(screen.queryByText(/Select Skills/i)).not.toBeInTheDocument();
    });


    it('toggles private profile', async () => {
        render(<ProfessionalInfo onSave={mockOnSave} />);
        const privateProfileCheckbox = screen.getByLabelText(/Private profile/i);
        await userEvent.click(privateProfileCheckbox); 
        expect(privateProfileCheckbox).toBeChecked();
    });


    it('handles form discard', async () => {
        render(<ProfessionalInfo initialData={mockInitialData} onSave={mockOnSave} />);
        await userEvent.type(screen.getByLabelText(/bio/i), 'Modified bio'); 
        const discardButton = screen.getByText(/Discard/i);
        await userEvent.click(discardButton);
        expect(screen.getByDisplayValue('Test bio')).toBeInTheDocument();
    });

    it('handles file upload and removal', async () => {
        render(<ProfessionalInfo onSave={mockOnSave} />);
    
        // Find file selector buttons
        const uploadButton = screen.getByTestId('upload-button');
        const removeButton = screen.getByTestId('remove-button');
    
        // Simulate file upload
        await act(async () => {
          fireEvent.click(uploadButton);
        });
    
        // Simulate file removal
        await act(async () => {
          fireEvent.click(removeButton);
        });
      });

});