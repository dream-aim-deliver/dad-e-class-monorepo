import { TDictionary } from '../../dictionaries/base';

export const CheckoutReturn_EN: TDictionary['pages']['checkoutReturn'] = {
    loading: {
        processing: 'Processing your payment...',
    },
    error: {
        title: 'Payment Error',
        needHelp: 'Need help?',
        email: 'Email:',
        phone: 'Phone:',
        tryAgain: 'Try Again',
        backToCheckout: 'Back to Checkout',
    },
    success: {
        title: 'Payment Successful!',
        confirmationEmailSent: 'Confirmation email sent to',
        transactionReceipt: 'Transaction Receipt',
        transactionId: 'Transaction ID:',
        amount: 'Amount:',
        alreadyProcessed:
            'This purchase has already been processed and unlocked.',
        purchaseUnlocked: 'Your purchase has been unlocked and is now available.',
        redirectingIn: 'Redirecting in {countdown} seconds...',
    },
    actions: {
        goToCourse: 'Go to Course',
        viewMyCourses: 'View My Courses',
        browseOfferings: 'Browse Offerings',
        bookSession: 'Book a Session',
        continue: 'Continue',
    },
};
