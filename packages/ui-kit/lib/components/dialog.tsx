'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
} from 'react';
import { IconClose } from './icons';
import { IconButton } from './icon-button';

interface DialogContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

interface DialogProps {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange: (open: boolean) => void;
    defaultOpen: boolean;
}

interface DialogTriggerProps {
    children: React.ReactNode;
    asChild: boolean;
    className?: string;
}

interface DialogContentProps {
    children: React.ReactNode;
    showCloseButton: boolean;
    closeOnOverlayClick: boolean;
    closeOnEscape: boolean;
    className?: string;
    disableCloseButton?: boolean;
}

interface DialogBodyProps {
    children: React.ReactNode;
    className?: string;
}

interface DialogCloseProps {
    children: React.ReactNode;
    asChild: boolean;
    className?: string;
}
const DialogContext = createContext<DialogContextType | null>(null);

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error(
            'Dialog components must be used within a Dialog provider',
        );
    }
    return context;
};

// Dialog Root Component
export const Dialog: React.FC<DialogProps> = ({
    children,
    open,
    onOpenChange,
    defaultOpen,
}) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    // Memoize setIsOpen to prevent unnecessary re-renders
    const setIsOpen = useCallback((newOpen: boolean) => {
        if (!isControlled) {
            setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
    }, [isControlled, onOpenChange]);

    // Memoize context value to prevent unnecessary re-renders
    const value = useMemo(() => ({ isOpen, setIsOpen }), [isOpen, setIsOpen]);

    return (
        <DialogContext.Provider value={value}>
            {children}
        </DialogContext.Provider>
    );
};

// Dialog Trigger Component
export const DialogTrigger: React.FC<DialogTriggerProps> = ({
    children,
    asChild,
    className = '',
}) => {
    const { setIsOpen } = useDialog();

    const handleClick = () => {
        setIsOpen(true);
    };

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: handleClick,
            className,
        });
    }

    return (
        <button
            onClick={handleClick}
            className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium 
        bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 
        focus:ring-primary focus:ring-offset-2 transition-colors ${className}`}
        >
            {children}
        </button>
    );
};

// Dialog Content Component
export const DialogContent: React.FC<DialogContentProps> = ({
    children,
    className = '',
    showCloseButton,
    closeOnOverlayClick,
    closeOnEscape,
    disableCloseButton = false,
}) => {
    const { isOpen, setIsOpen } = useDialog();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // Handle opening and closing animations
    useEffect(() => {
        if (isOpen) {
            // Opening animation
            setIsClosing(false);
            setIsAnimating(true);
            // Small delay to trigger entrance animation
            const timer = setTimeout(() => setIsAnimating(false), 50);
            return () => clearTimeout(timer);
        } else {
            // Closing animation
            setIsClosing(true);
            // Wait for closing animation to complete before unmounting
            const timer = setTimeout(() => {
                setIsClosing(false);
                setIsAnimating(false);
            }, 300); // Match animation duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (closeOnEscape && event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, closeOnEscape, setIsOpen]);

    // Show dialog during opening, open state, and closing animation
    if (!isOpen && !isClosing) return null;

    return (
        <>
            {/* Overlay with fade-in/out */}
            <div
                onMouseDown={() => {
                    if (closeOnOverlayClick) {
                        setIsOpen(false);
                    }
                }}
                className={`fixed inset-0 z-100 bg-neutral-900/60 backdrop-blur-sm transition-all duration-300 ease-out ${isAnimating || isClosing ? 'opacity-0' : 'opacity-100'
                    }`}
            />

            {/* Content with scale + fade animation */}
            <div
                ref={contentRef}
                className={`fixed top-1/2 left-1/2 w-full max-w-lg max-h-[80vh] overflow-y-auto
                    bg-card-fill border border-card-stroke rounded-lg shadow-[0_4px_12px_0var(base-neutral-950)]
                    p-4 transition-all duration-300 ease-out transform -translate-x-1/2 -translate-y-1/2 ${isAnimating || isClosing
                        ? 'opacity-0 scale-95'
                        : 'opacity-100 scale-100'
                    } ${className}`}
                style={{ zIndex: 9999 }}
                role="dialog"
                aria-modal="true"
            >
                {showCloseButton && (
                    <div className="absolute right-3 top-3 z-50">
                        <IconButton
                            aria-label="Close dialog"
                            styles="text"
                            icon={<IconClose />}
                            size="small"
                            onClick={() => setIsOpen(false)}
                            className="text-button-text-text"
                            disabled={disableCloseButton}
                        />
                    </div>
                )}
                {children}
            </div>
        </>
    );
};

// Dialog Body Component
export const DialogBody: React.FC<DialogBodyProps> = ({
    children,
    className = '',
}) => <div className={`px-6 py-4 ${className}`}>{children}</div>;

// Dialog Close Component
export const DialogClose: React.FC<DialogCloseProps> = ({
    children,
    asChild,
    className = '',
}) => {
    const { setIsOpen } = useDialog();

    const handleClick = () => {
        setIsOpen(false);
    };

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: handleClick,
            className,
        });
    }

    return (
        <div
            onClick={handleClick}
            className={`px-4 py-2 focus:ring-ring focus:ring-offset-2 transition-colors ${className}`}
        >
            {children}
        </div>
    );
};
