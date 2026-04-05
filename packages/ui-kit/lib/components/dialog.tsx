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
import { createPortal } from 'react-dom';
import { IconClose } from './icons';
import { IconButton } from './icon-button';
import { cn } from '../utils/style-utils';
import { Z_INDEX } from '../utils/z-index';

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

type ClickableChildProps = {
    onClick?: React.MouseEventHandler<HTMLElement>;
    className?: string;
};

const SCROLL_TOLERANCE = 1;
const VERTICAL_FADE_HEIGHT_CLASS = 'h-30';

function toTransparentColor(color: string) {
    const match = color.match(/rgba?\(([^)]+)\)/);

    if (!match) {
        return 'rgba(28, 25, 23, 0)';
    }

    const [red = '28', green = '25', blue = '23'] = match[1]
        .split(',')
        .slice(0, 3)
        .map((value) => value.trim());

    return `rgba(${red}, ${green}, ${blue}, 0)`;
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
        return React.cloneElement(children as React.ReactElement<ClickableChildProps>, {
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
    const panelRef = useRef<HTMLDivElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const scrollContentRef = useRef<HTMLDivElement | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [showTopFade, setShowTopFade] = useState(false);
    const [showBottomFade, setShowBottomFade] = useState(false);
    const [fadeColor, setFadeColor] = useState('rgb(28, 25, 23)');

    // Mark the dialog content as mounted after the first client render.
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Sync scroll fade visibility and color with the current panel state.
    const updateFadeState = useCallback(() => {
        const node = scrollRef.current;
        const panelNode = panelRef.current;

        if (!node) {
            return;
        }

        const { scrollTop, clientHeight, scrollHeight } = node;
        const computedBackgroundColor = window.getComputedStyle(
            panelNode ?? node,
        ).backgroundColor;

        setShowTopFade(scrollTop > SCROLL_TOLERANCE);
        setShowBottomFade(
            scrollTop + clientHeight < scrollHeight - SCROLL_TOLERANCE,
        );

        if (
            computedBackgroundColor &&
            computedBackgroundColor !== 'transparent' &&
            computedBackgroundColor !== 'rgba(0, 0, 0, 0)'
        ) {
            setFadeColor((currentColor) =>
                currentColor === computedBackgroundColor
                    ? currentColor
                    : computedBackgroundColor,
            );
        }
    }, []);

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

    // Recalculate scroll fades whenever the viewport or content size changes.
    useEffect(() => {
        const node = scrollRef.current;
        const contentNode = scrollContentRef.current;

        if (!isMounted || !node || !isOpen) {
            return;
        }

        updateFadeState();

        const resizeObserver =
            typeof ResizeObserver !== 'undefined'
                ? new ResizeObserver(() => updateFadeState())
                : null;
        const requestId = window.requestAnimationFrame(updateFadeState);

        node.addEventListener('scroll', updateFadeState, { passive: true });
        window.addEventListener('resize', updateFadeState);
        resizeObserver?.observe(node);
        if (contentNode) {
            resizeObserver?.observe(contentNode);
        }

        return () => {
            window.cancelAnimationFrame(requestId);
            node.removeEventListener('scroll', updateFadeState);
            window.removeEventListener('resize', updateFadeState);
            resizeObserver?.disconnect();
        };
    }, [children, isMounted, isOpen, updateFadeState]);

    // Show dialog during opening, open state, and closing animation
    if (!isOpen && !isClosing) return null;
    if (!isMounted) return null;

    // Prefer the themed root so the portal inherits the active CSS variables.
    const portalTarget =
        document.querySelector('.theme') ?? document.body;

    const transparentFadeColor = toTransparentColor(fadeColor);
    const topFadeStyle = {
        backgroundImage: `linear-gradient(to bottom, ${fadeColor} 0%, ${transparentFadeColor} 100%)`,
    };
    const bottomFadeStyle = {
        backgroundImage: `linear-gradient(to top, ${fadeColor} 0%, ${transparentFadeColor} 100%)`,
    };

    return createPortal(
        <>
            {/* Overlay with fade-in/out */}
            <div
                onMouseDown={() => {
                    if (closeOnOverlayClick) {
                        setIsOpen(false);
                    }
                }}
                className={`fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-all duration-300 ease-out ${isAnimating || isClosing ? 'opacity-0' : 'opacity-100'
                    }`}
                style={{ zIndex: Z_INDEX.OVERLAY }}
            />

            {/* Content with scale + fade animation */}
            <div
                ref={panelRef}
                className={cn(
                    `fixed top-1/2 left-1/2 flex max-h-screen w-full max-w-lg flex-col
                    bg-card-fill shadow-[0_4px_12px_0var(base-neutral-950)] max-[27rem]:border-0
                    max-[27rem]:rounded-none max-[27rem]:top-auto max-[27rem]:bottom-0
                    max-[27rem]:left-0 max-[27rem]:translate-x-0 max-[27rem]:translate-y-0
                    min-[27rem]:w-[calc(100%-32px)] min-[27rem]:max-h-[90vh] min-[27rem]:border
                    min-[27rem]:border-card-stroke min-[27rem]:rounded-lg
                    transition-all duration-300 ease-out transform -translate-x-1/2 -translate-y-1/2`,
                    isAnimating || isClosing
                        ? 'opacity-0 scale-95'
                        : 'opacity-100 scale-100',
                    className,
                )}
                style={{ zIndex: Z_INDEX.DIALOG }}
                role="dialog"
                aria-modal="true"
            >
                {showTopFade && (
                    <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute left-0 top-0 z-10 w-full max-[27rem]:rounded-none min-[27rem]:rounded-t-lg ${VERTICAL_FADE_HEIGHT_CLASS}`}
                        style={topFadeStyle}
                    />
                )}
                {showBottomFade && (
                    <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute bottom-0 left-0 z-10 w-full max-[27rem]:rounded-none min-[27rem]:rounded-b-lg ${VERTICAL_FADE_HEIGHT_CLASS}`}
                        style={bottomFadeStyle}
                    />
                )}
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
                <div
                    ref={scrollRef}
                    className="min-h-0 flex-1 overflow-y-auto max-[27rem]:min-h-auto"
                >
                    <div ref={scrollContentRef}>
                        {children}
                    </div>
                </div>
            </div>
        </>,
        portalTarget,
    );
};

// Dialog Body Component
export const DialogBody: React.FC<DialogBodyProps> = ({
    children,
    className = '',
}) => <div className={cn('p-6', className)}>{children}</div>;

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
        return React.cloneElement(children as React.ReactElement<ClickableChildProps>, {
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
