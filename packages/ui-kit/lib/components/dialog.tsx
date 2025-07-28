import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
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
    onOpenChange?: (open: boolean) => void;
    defaultOpen?: boolean;
}

interface DialogTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
    className?: string;
}

interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
}

interface DialogBodyProps {
    children: React.ReactNode;
    className?: string;
}

interface DialogCloseProps {
    children: React.ReactNode;
    asChild?: boolean;
    className?: string;
}
const DialogContext = createContext<DialogContextType | null>(null);

const useDialog = () => {
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
    defaultOpen = false,
}) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    const setIsOpen = (newOpen) => {
        if (!isControlled) {
            setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
    };

    return (
        <DialogContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </DialogContext.Provider>
    );
};

// Dialog Trigger Component
export const DialogTrigger: React.FC<DialogTriggerProps> = ({
    children,
    asChild = false,
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
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
}) => {
    const { isOpen, setIsOpen } = useDialog();
    const contentRef = useRef(null);

    useEffect(() => {
        const handleEscape = (event) => {
            if (closeOnEscape && event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        const handleClickOutside = (event) => {
            if (
                closeOnOverlayClick &&
                contentRef.current &&
                !contentRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, closeOnEscape, closeOnOverlayClick, setIsOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm" />

            {/* Content */}
            <div
                ref={contentRef}
                className={`relative z-50 w-full max-w-lg bg-card-fill border border-card-stroke rounded-lg 
          shadow-[0_4px_12px_0var(base-neutral-950)] transform transition-all duration-200 ${className}`}
                role="dialog"
                aria-modal="true"
            >
                {showCloseButton && (
                    <div className="absolute right-3 top-0">
                        <IconButton
                            aria-label="Close dialog"
                            styles="text"
                            icon={<IconClose />}
                            size="small"
                            onClick={() => setIsOpen(false)}
                            className="text-button-text-text"
                        />
                    </div>
                )}
                {children}
            </div>
        </div>
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
    asChild = false,
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
