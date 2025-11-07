import { Meta, StoryObj } from '@storybook/react';
import RedeemStandaloneCoupon from '../lib/components/redeem-standalone-coupon';
import { Dialog, DialogContent, DialogTrigger } from '../lib/components/dialog';

const meta: Meta = {
    title: 'Components/RedeemStandaloneCoupon',
    component: RedeemStandaloneCoupon,
    tags: ['docs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;

// Universal mock function that accepts all coupon types
const mockRedeemUniversal = async (code: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const upperCode = code.toUpperCase();
    console.log('Validating coupon code:', upperCode);

    // Validate specific coupon codes
    if (upperCode === 'COURSE2024') {
        return {
            valid: true,
            data: {
                type: 'course' as const,
                title: 'Advanced React Patterns',
                imageUrl: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3',
            },
        };
    }

    if (upperCode === 'PACKAGE2024') {
        return {
            valid: true,
            data: {
                type: 'package' as const,
                title: 'Premium Bundle Package',
                imageUrl: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3',
            },
        };
    }

    if (upperCode === 'COACHING2024') {
        return {
            valid: true,
            data: {
                type: 'coaching' as const,
                title: '60 min Strategy Session',
            },
        };
    }

    if (upperCode === 'GROUP2024') {
        return {
            valid: true,
            data: {
                type: 'group' as const,
                title: 'Marketing Masterclass Group',
            },
        };
    }

    return { valid: false };
};

// Mock function for course only (for specific stories)
const mockRedeemValid = async (code: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validate specific coupon codes
    if (code.toUpperCase() === 'COURSE2024') {
        return {
            valid: true,
            data: {
                type: 'course' as const,
                title: 'Advanced React Patterns',
                imageUrl: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3',
            },
        };
    }

    return { valid: false };
};

const mockRedeemInvalid = async (code: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { valid: false };
};

const mockRedeemPackage = async (code: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validate specific coupon code for package
    if (code.toUpperCase() === 'PACKAGE2024') {
        return {
            valid: true,
            data: {
                type: 'package' as const,
                title: 'Premium Bundle Package',
                imageUrl: 'https://img.lalr.co/cms/2018/08/16181927/Mini-pig.jpg?r=4_3',
            },
        };
    }

    return { valid: false };
};

const mockRedeemCoaching = async (code: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validate specific coupon code for coaching
    if (code.toUpperCase() === 'COACHING2024') {
        return {
            valid: true,
            data: {
                type: 'coaching' as const,
                title: '60 min Strategy Session',
            },
        };
    }

    return { valid: false };
};

const mockRedeemGroup = async (code: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validate specific coupon code for group
    if (code.toUpperCase() === 'GROUP2024') {
        return {
            valid: true,
            data: {
                type: 'group' as const,
                title: 'Marketing Masterclass Group',
            },
        };
    }

    return { valid: false };
};

// Mock final redemption with delay
const mockFinalRedeem = async (code: string, data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Coupon redeemed:', code, data);
};

// State Stories
export const DefaultState: StoryObj<typeof RedeemStandaloneCoupon> = {
    name: '1. Default State',
    args: {
        locale: 'en',
        onRedeem: mockRedeemUniversal,
        onFinalRedeem: mockFinalRedeem,
        onClose: () => console.log('Modal Closed'),
    },
    parameters: {
        docs: {
            description: {
                story: 'Try these codes: COURSE2024, PACKAGE2024, COACHING2024, or GROUP2024. Any other code will show invalid state.',
            },
        },
    },
};

export const InvalidState: StoryObj<typeof RedeemStandaloneCoupon> = {
    name: '2. Invalid State',
    args: {
        locale: 'en',
        onRedeem: mockRedeemInvalid,
        onClose: () => console.log('Modal Closed'),
    },
    parameters: {
        docs: {
            description: {
                story: 'Enter any code and click "Redeem Coupon" to see the invalid state with error message.',
            },
        },
    },
};

export const LoadingState: StoryObj<typeof RedeemStandaloneCoupon> = {
    name: '3. Loading State',
    args: {
        locale: 'en',
        onRedeem: async (code: string) => {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            return mockRedeemUniversal(code);
        },
        onClose: () => console.log('Modal Closed'),
    },
    parameters: {
        docs: {
            description: {
                story: 'Enter any valid code (COURSE2024, PACKAGE2024, COACHING2024, GROUP2024) to see the loading state for 5 seconds.',
            },
        },
    },
};

export const ValidStateCourse: StoryObj<typeof RedeemStandaloneCoupon> = {
    name: '4. Valid State - Course',
    args: {
        locale: 'en',
        onRedeem: mockRedeemValid,
        onFinalRedeem: mockFinalRedeem,
        onClose: () => console.log('Modal Closed'),
    },
    parameters: {
        docs: {
            description: {
                story: 'Enter the code "COURSE2024" to see the valid state showing a course is available. Any other code will show the invalid state.',
            },
        },
    },
};

export const ValidStatePackage: StoryObj<typeof RedeemStandaloneCoupon> = {
    name: '4. Valid State - Package',
    args: {
        locale: 'en',
        onRedeem: mockRedeemPackage,
        onFinalRedeem: mockFinalRedeem,
        onClose: () => console.log('Modal Closed'),
    },
    parameters: {
        docs: {
            description: {
                story: 'Enter the code "PACKAGE2024" to see the valid state showing a package is available. Any other code will show the invalid state.',
            },
        },
    },
};

export const ValidStateCoaching: StoryObj<typeof RedeemStandaloneCoupon> = {
    name: '4. Valid State - Coaching',
    args: {
        locale: 'en',
        onRedeem: mockRedeemCoaching,
        onFinalRedeem: mockFinalRedeem,
        onClose: () => console.log('Modal Closed'),
    },
    parameters: {
        docs: {
            description: {
                story: 'Enter the code "COACHING2024" to see the valid state showing a coaching session is available. Any other code will show the invalid state.',
            },
        },
    },
};

export const ValidStateGroup: StoryObj<typeof RedeemStandaloneCoupon> = {
    name: '4. Valid State - Group',
    args: {
        locale: 'en',
        onRedeem: mockRedeemGroup,
        onFinalRedeem: mockFinalRedeem,
        onClose: () => console.log('Modal Closed'),
    },
    parameters: {
        docs: {
            description: {
                story: 'Enter the code "GROUP2024" to see the valid state showing a group is available. Any other code will show the invalid state.',
            },
        },
    },
};

export const RedeemedStateCourse: StoryObj<typeof RedeemStandaloneCoupon> = {
    name: '5. Redeemed State - Course',
    args: {
        locale: 'en',
        onRedeem: mockRedeemValid,
        onFinalRedeem: mockFinalRedeem,
        onClose: () => console.log('Modal Closed'),
    },
    parameters: {
        docs: {
            description: {
                story: 'Enter the code "COURSE2024", wait for validation, then click "Redeem Coupon" to see the success/redeemed state.',
            },
        },
    },
};

export const RedeemedStatePackage: StoryObj<typeof RedeemStandaloneCoupon> = {
    name: '5. Redeemed State - Package',
    args: {
        locale: 'en',
        onRedeem: mockRedeemPackage,
        onFinalRedeem: mockFinalRedeem,
        onClose: () => console.log('Modal Closed'),
    },
    parameters: {
        docs: {
            description: {
                story: 'Enter the code "PACKAGE2024", wait for validation, then click "Redeem Coupon" to see the success/redeemed state for a package.',
            },
        },
    },
};

// Locale Stories
export const GermanLocale: StoryObj<typeof RedeemStandaloneCoupon> = {
    name: 'German Locale',
    args: {
        locale: 'de',
        onRedeem: mockRedeemValid,
        onClose: () => console.log('Modal Closed'),
    },
};

// Dialog Example
export const InDialog: StoryObj<typeof RedeemStandaloneCoupon> = {
    name: 'Inside Dialog',
    args: {
        locale: 'en',
        onRedeem: mockRedeemValid,
        onClose: () => console.log('Modal Closed'),
    },
    render: (args) => (
        <Dialog open={undefined} onOpenChange={() => {
            console.log('Dialog Opened/Closed');
        }} defaultOpen={false}>
            <DialogTrigger asChild>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                    Open Redeem Coupon Modal
                </button>
            </DialogTrigger>
            <DialogContent showCloseButton={true} closeOnOverlayClick closeOnEscape>
                <div className="p-6">
                    <RedeemStandaloneCoupon {...args} />
                </div>
            </DialogContent>
        </Dialog>
    ),
};
