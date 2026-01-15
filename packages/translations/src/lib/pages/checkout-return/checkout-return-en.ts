import { TDictionary } from '../../dictionaries/base';

export const CheckoutReturn_EN: TDictionary['pages']['checkoutReturn'] = {
    loading: {
        processing: 'Processing your payment...',
    },
    error: {
        title: 'Payment Error',
        checkCardWarning: 'Please check your bank statement to verify if your card was charged.',
        transactionDetails: 'Transaction Details',
        sessionId: 'Session ID:',
        paymentIntentId: 'Payment ID:',
        customerEmail: 'Email:',
        amount: 'Amount:',
        items: 'Items:',
        purchaseInfo: 'Purchase Info:',
        timestamp: 'Time:',
        needHelp: 'Need help?',
        contactInstructions: 'Please contact us with the details above and include:',
        includeEmail: 'Your email address used for purchase',
        includeDescription: 'A brief description of the issue',
        email: 'Email:',
        phone: 'Phone:',
        tryAgain: 'Try Again',
        backToDashboard: 'Back to Dashboard',
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
