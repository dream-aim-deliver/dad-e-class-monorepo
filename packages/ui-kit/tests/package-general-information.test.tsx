import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PackageGeneralInformation } from '../lib/components/package-general-information';

// Mock dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: (locale: string) => ({
        components: {
            packageGeneralInformation: {
                coachingIncluded: 'Coaching included',
                purchaseButton: 'Buy Now',
                fromText: 'from',
                saveText: 'save',
                errorImageText: 'Image not available',
            },
        },
    }),
    isLocalAware: vi.fn(),
}));

vi.mock('../lib/components/badge', () => ({
    Badge: ({ text }: { text: string }) => <span>{text}</span>,
}));

vi.mock('../lib/components/button', () => ({
    Button: ({ text, onClick }: { text: string; onClick?: () => void }) => (
        <button onClick={onClick}>{text}</button>
    ),
}));

vi.mock('../lib/components/icons/icon-clock', () => ({
    IconClock: ({ size }: { size: string }) => (
        <span>Clock Icon (size {size})</span>
    ),
}));

vi.mock('../lib/components/checkbox', () => ({
    CheckBox: ({ label }: { label: string }) => {
        const id = 'mock-checkbox';
        return (
            <>
                <input type="checkbox" id={id} />
                <label htmlFor={id}>{label}</label>
            </>
        );
    },
}));

describe('PackageGeneralInformation', () => {
    const mockProps = {
        title: 'Visualisierung',
        subTitle: 'Als Package oder flexibel:',
        description:
            'Das Angebot "Visualisierung" richtet sich an Firmen und Einzelpersonen, die bereits über eine Idee verfügen.',
        duration: 165, // minutos
        pricing: {
            fullPrice: 299,
            partialPrice: 249,
            currency: 'CHF',
        },
        locale: 'en' as 'en' | 'de',
        onClickPurchase: vi.fn(),
        imageUrl:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    };

    it('renders all main content correctly', () => {
        render(<PackageGeneralInformation {...mockProps} />);

        // Títulos
        expect(screen.getByText(mockProps.title)).toBeInTheDocument();
        expect(screen.getByText(mockProps.subTitle)).toBeInTheDocument();
        expect(screen.getByText(mockProps.description)).toBeInTheDocument();

        // Duración formateada (165 min = 2h 45m)
        expect(screen.getByText('2h 45m')).toBeInTheDocument();

        // Checkbox con label
        expect(screen.getByLabelText('Coaching included')).toBeInTheDocument();

        // Botón y precios
        expect(screen.getByText('Buy Now')).toBeInTheDocument();
        expect(
            screen.getByText(`from CHF ${mockProps.pricing.fullPrice}`),
        ).toBeInTheDocument();
        expect(
            screen.getByText(`save CHF ${mockProps.pricing.partialPrice}`),
        ).toBeInTheDocument();
    });

    it('calls onClickPurchase when purchase button is clicked', () => {
        render(<PackageGeneralInformation {...mockProps} />);
        fireEvent.click(screen.getByText('Buy Now'));
        expect(mockProps.onClickPurchase).toHaveBeenCalled();
    });

    it('shows placeholder text if image is broken', () => {
        // Pasamos una URL de imagen rota para forzar error
        render(
            <PackageGeneralInformation
                {...mockProps}
                imageUrl="broken-image.jpg"
            />,
        );

        // Forzamos el error manualmente disparando el evento onError
        const img = screen.queryByRole('img');
        if (img) {
            fireEvent.error(img);
        }

        // Placeholder debe mostrarse con el texto del diccionario
        expect(screen.getByText('Image not available')).toBeInTheDocument();
    });
});
