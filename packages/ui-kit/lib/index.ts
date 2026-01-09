import { ProfileTabs } from './components/profile-tabs';
import { DragAndDrop } from './components/drag-and-drop-uploader/drag-and-drop';
import { Badge } from './components/badge';



export { Button, type ButtonProps } from './components/button';
export { DummySkills, type DummySkillsProps } from './components/dummy-skills';
export { IconButton, type IconButtonProps } from './components/icon-button';
export { CheckBox, type CheckBoxProps } from './components/checkbox';
export { InputField, type InputFieldProps } from './components/input-field';
export { SearchInput, type SearchInputProps } from './components/search-input';
export { TextInput, type TextInputProps } from './components/text-input';
export {
  FeedBackMessage,
  type FeedBackMessageProps,
} from './components/feedback-message';
export { default as Banner } from './components/banner';
export {
  TextAreaInput,
  type TextAreaInputProps,
} from './components/text-areaInput';
export { ThemeProvider, useTheme, UnsavedChangesProvider, useUnsavedChanges, ImageProvider, useImageComponent } from './contexts';
export type { ImageComponentProps, ImageComponentType } from './contexts';
export { useFormDirtyTracking } from './hooks/use-form-dirty-tracking';
export { SessionExpirationModal, type SessionExpirationModalProps } from './components/session-expiration-modal';
export { VisitorCourseCard } from './components/course-card/visitor-course-card/visitor-course-card';
export { CoachCourseCard } from './components/course-card/coach-course-card/coach-course-card';
export { StudentCourseCard } from './components/course-card/student-course-card/student-course-card';
export { CourseCreatorCard, type CourseStatus } from './components/course-card/course-creator-course-card/course-creator-card';
export { ProfileTabs, DragAndDrop, Badge };
export { CoachBanner } from './components/coach-banner';
export { CourseCard } from './components/course-card/course-card';
export { CourseCardList } from './components/course-card/course-card-list';
export { EmptyState } from './components/course-card/empty-state';
export { default as BuyCoachingSession, type BuyCoachingSessionProps } from './components/buy-coaching-session';
export { BuyCourseCoachingSessions, type BuyCourseCoachingSessionsProps } from './components/buy-course-coaching-sessions';
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/accordion';
export * as contexts from './contexts';
export { Navbar } from './components/navbar';
export { Footer } from './components/footer';

export { NotificationGrid, type ExtendedNotification } from './components/grids/notification-grid';
export { Activity } from './components/notifications/activity';
export { RecentActivity } from './components/notifications/recent-activity';
export { SendNotificationModal, type SendNotificationModalProps } from './components/notifications/send-notification-modal';
export { UserGrid, type UserRow } from './components/grids/user-grid';
export { Hero } from './components/home-banner/hero';
export { Carousel } from './components/carousel/carousel';
export { GeneralCard } from './components/carousel/general-card';
export { Divider } from './components/divider';
export { CarouselSkeleton } from './components/skeletons/carousel-skeleton'
export { StudentCardListSkeleton } from './components/skeletons/students-skeleton';

export { ReviewSnippet } from './components/review/review-snippet';
export { default as CreateCourseModal } from './components/create-modal/create-course-modal';
export { ArchivePackageModal, ArchiveSuccessModal, type ArchivePackageModalProps, type ArchiveSuccessModalProps } from './components/archive-package-modal';

export { CoachesSkeleton } from './components/coaches-skeleton';
export { RemoveModal } from './components/remove-modal';
export { default as TopicList } from './components/topic-list';
export { CoachingOnDemandBanner } from './components/coaching-on-demand-banner/coaching-on-demand-banner';
export { HomeAccordion } from './components/home-accordion';
export { default as RichTextRenderer } from './components/rich-text-element/renderer';
export { default as RichTextEditor } from './components/rich-text-element/editor';
export { slateifySerialize, serialize, deserialize, slateToPlainText } from './components/rich-text-element/serializer';
export { Uploader } from './components/drag-and-drop-uploader/uploader';

// Create Package Components
export { PackageDetailsStep, type PackageDetailsFormData } from './components/create-package/package-details-step';
export { PackageCoursesStep } from './components/create-package/package-courses-step';
export { PackagePricingStep, type PackagePricingFormData } from './components/create-package/package-pricing-step';
export { PackagePreviewStep } from './components/create-package/package-preview-step';

// Components used in the Package subComponents
export { PackageCourseSelector } from './components/course-card/package-course-selector/package-course-selector';
export { PackageCourseCard } from './components/course-card/package-course-selector/package-course-card';
export { BuyCompletePackageBanner } from './components/buy-complete-package-banner';

export { default as DefaultLoading } from './components/default-loading';
export { default as DefaultError } from './components/default-error';
export { default as DefaultNotFound } from './components/default-not-found';
export { default as DefaultComingSoon } from './components/default-coming-soon';

export { Outline } from './components/outline';
export { default as FilterSwitch } from './components/filter-switch';
export * from './components/text';
export { Tabs } from './components/tabs/tab';
export { useTabContext } from './components/tabs/tab-context';
export { default as CardListLayout } from './components/card-list-layout';
export { CourseCardListSkeleton } from './components/skeletons/courses-skeleton';
export { CoachCardListSkeleton } from './components/skeletons/coaches-skeleton';
export { PackageCard } from './components/packages/package-card';
export { PlatformCard } from './components/platform-cards/platform-card';
export { PlatformCardList } from './components/platform-cards/platform-card-list';
export { PackageCardList } from './components/packages/package-card-list';
export { default as CoachCard } from './components/coach/coach-card';
export { AvailableCoachingSessions } from './components/available-coaching-sessions/available-coaching-sessions';
export { AvailableCoachingSessionCard } from './components/available-coaching-sessions/available-coaching-session-card';

export { FormElementRenderer } from './components/lesson/form-renderer';
export { SubmissionElementsRenderer as SubmissionRenderer } from './components/lesson/submission-renderer';
export { AssessmentSubmissionRenderer } from './components/pre-assessment/assessment-submission-renderer';
export * from './components/pre-assessment/types';
export * from './components/lesson-components/types';
export * from './components/course-builder-lesson-component/types';
export { CourseElementType, type CourseElement } from './components/course-builder/types';
export { LessonElementType, type LessonElement } from './components/lesson/types';
export { lessonElements } from './components/lesson/element-core';

export * from './components/icons';
export { CourseGeneralInformationView } from './components/course-general-information/course-general-information-view';
export { CourseGeneralInformationVisitor } from './components/course-general-information/course-general-information-visitor';
export { CourseProgressBar } from './components/course-progress-bar';

export { StarRating } from './components/star-rating';
export { Dropdown } from './components/dropdown';
export { CoachingSessionTracker } from './components/coaching-session-tracker/coaching-session-tracker';
export { CoachingSessionItem } from './components/coaching-session-tracker/coaching-session-item';
export { CoachingSessionCard } from './components/coaching-sessions/coaching-session-card';
export { CourseIntroBanner } from './components/course-intro-banner';

export { DefaultAccordion } from './components/accordion/default-accordion';
export { PackageGeneralInformation } from './components/package-general-information-banner';

export { StudentCard } from './components/student-card/student-card';
export { StudentCardList } from './components/student-card/student-card-list';
export { YourStudentCard } from './components/student-card/your-student-card';
export { YourStudentCardList } from './components/student-card/your-student-card-list';
export { StudentCardFilterModal, type StudentCardFilterModel } from './components/student-card/student-card-filter-modal';

export { AddCoachModal } from './components/add-coach-modal';
export { BookSessionWith } from './components/book-session-with-banner';

export { BuyCoachingSessionBanner } from './components/buy-coaching-session-banner';

export { Breadcrumbs } from './components/breadcrumbs';
export * from './components/dialog';
export { CheckoutModal, type CheckoutModalProps, type TransactionDraft, type CouponValidationResult } from './components/checkout/checkout-modal';
export { CourseForm, useCourseForm, type CourseDetailsState } from './components/course-form';
export * from './utils/file-utils';
export { generateCertificatePDF, type CertificateData } from './utils/course-certificate-generator';
export { CourseCertificate, type CourseCertificateProps } from './components/course-certificate';
export { PaginatedCertificate, type PaginatedCertificateHandle } from './components/paginated-certificate';

export { LessonHeader } from './components/lesson-header';


export { FormComponent as RichTextFormComponent } from './components/lesson-components/rich-text';
export { FormComponent as HeadingFormComponent } from './components/lesson-components/heading-lesson';
export { FormComponent as TextInputFormComponent } from './components/lesson-components/text-input';
export { FormComponent as SingleChoiceFormComponent } from './components/lesson-components/single-choice';
export { FormComponent as MultiCheckFormComponent } from './components/lesson-components/multi-check';
export { FormComponent as OneOutOfThreeFormComponent } from './components/lesson-components/one-out-of-three';

export { FormComponent as VideoFormComponent } from './components/course-builder-lesson-component/video';
export { FormComponent as ImageFormComponent } from './components/course-builder-lesson-component/image';
export { FormComponent as ImageGalleryFormComponent } from './components/course-builder-lesson-component/image-gallery';

export { FormComponent as DownloadFilesFormComponent } from './components/course-builder-lesson-component/download-files-lesson';
export { FormComponent as UploadFilesFormComponent } from './components/course-builder-lesson-component/upload-files-lesson';

export { FormComponentWrapper as QuizFormComponentWrapper } from './components/course-builder-lesson-component/quiz';
export { default as QuizTypeOneStudentView } from './components/quiz/quiz-type-one/quiz-type-one-student-view';
export { default as QuizTypeTwoStudentView } from './components/quiz/quiz-type-two/quiz-type-two-student-view';
export { default as QuizTypeThreeStudentView } from './components/quiz/quiz-type-three/quiz-type-three-student-view';
export { default as QuizTypeFourStudentView } from './components/quiz/quiz-type-four/quiz-type-four-student-view';

export { FormComponent as LinksFormComponent } from './components/course-builder-lesson-component/links';
export { FormComponent as AssignmentFormComponent } from './components/course-builder-lesson-component/assignment';

export { CoachingSessionStudentView } from './components/coaching-session-course-builder/coaching-session-student-view';
export { LessonCoachComponent } from './components/coaching-session-course-builder/lesson-coach-component';

export { SideMenu } from './components/sidemenu/sidemenu';

export { CourseOutlineAccordion } from './components/course-outline-accordion';

export { ComponentCard } from './components/course-builder/component-card';
export { ContentControlButtons } from './components/course-builder/control-buttons';
export { DuplicateLessonDialog, type DuplicateLessonDialogProps, type DuplicateLessonDialogModule } from './components/course-builder/duplicate-lesson-dialog';

export { DesignerComponent as RichTextDesignerComponent } from './components/lesson-components/rich-text';
export { DesignerComponent as HeadingDesignerComponent } from './components/lesson-components/heading-lesson';
export { DesignerComponent as VideoDesignerComponent } from './components/course-builder-lesson-component/video';
export { DesignerComponent as ImageDesignerComponent } from './components/course-builder-lesson-component/image';
export { DesignerComponent as ImageGalleryDesignerComponent } from './components/course-builder-lesson-component/image-gallery';
export { DesignerComponent as DownloadFilesDesignerComponent } from './components/course-builder-lesson-component/download-files-lesson';
export { DesignerComponent as UploadFilesDesignerComponent } from './components/course-builder-lesson-component/upload-files-lesson';
export { DesignerComponent as TextInputDesignerComponent } from './components/lesson-components/text-input';
export { DesignerComponent as SingleChoiceDesignerComponent } from './components/lesson-components/single-choice';
export { DesignerComponent as MultiCheckDesignerComponent } from './components/lesson-components/multi-check';
export { DesignerComponent as OneOutOfThreeDesignerComponent } from './components/lesson-components/one-out-of-three';
export { DesignerComponent as QuizDesignerComponent } from './components/course-builder-lesson-component/quiz';
export { DesignerComponent as LinksDesignerComponent } from './components/course-builder-lesson-component/links';
export { DesignerComponent as CoachingSessionDesignerComponent } from './components/course-builder-lesson-component/coaching-session';
export { DesignerComponent as AssignmentDesignerComponent } from './components/course-builder-lesson-component/assignment';

export { IntroductionForm, useCourseIntroductionForm, type CourseIntroductionForm } from './components/introduction-form';
export { AccordionBuilder, type AccordionBuilderItem } from './components/accordion-builder';
export { LessonNoteBuilderView, type LessonNoteBuilderViewType } from './components/lesson-note/lesson-note-builder-view';
export { LessonNoteStudentView, type LessonNoteStudentViewType } from './components/lesson-note/lesson-note-student-view';
export { LessonNoteView, type LessonNoteViewType } from './components/lesson-note/lesson-note-view';

export { type OneOutOfThreeData } from './components/out-of-three/one-out-of-three';
export { validatorPerType } from './components/lesson/validators';

export { PackageCmsCard } from './components/packages/package-cms-card';
export { PackageCmsCardList } from './components/packages/package-cms-card-list';
export { CourseCardAddToPackage } from './components/course-card/add-to-package/course-card-add-to-package';
export { CourseCardAddToPackageList } from './components/course-card/add-to-package/course-card-add-to-package-list';
export { CourseNotesAccordion } from './components/accordion/course-notes-accordion';

export { Stepper } from './components/stepper/stepper';
export { CourseMaterialsAccordion } from "./components/accordion/course-materials-accordion";
export { TeachCourseBanner } from './components/teach-course-banner';

export { CourseCompletionModal } from './components/course-completion-modal';


export { MonthlyCalendar, formatDateKey } from './components/calendar/monthly-calendar';
export { WeeklyCalendar } from './components/calendar/weekly-calendar';
export { CalendarNavigationHeader } from './components/calendar/calendar-navigation-header';
export * from './components/calendar/calendar-cards';
export { type CoachingSessionData } from './components/available-coaching-sessions/available-coaching-sessions';
export { CoachingAvailabilityCard } from './components/available-coaching-sessions/coaching-availability-card';

export { ReviewModal, ReviewDialog, ReviewCard } from './components/review/review-modal';
export { CancelCoachingSessionModal } from './components/coaching-sessions/cancel-coaching-session-modal';
export { CoachingSessionList } from "./components/coaching-sessions/coaching-session-list"
export { ConfirmationModal } from './components/confirmation-modal';
export { DeleteConfirmationModal } from './components/delete-confirmation-modal/delete-confirmation-modal';
export { AssessmentSubmissionConfirmationModal } from './components/pre-assessment/assessment-submission-confirmation-modal';

export { OrderHistoryCard, type OrderHistoryCardProps, type OrderHistoryType, type CourseOrderHistoryProps, type CoachingOrderHistoryProps, type PackageOrderHistoryProps } from './components/order-history/order-history-card';
export { OrderHistoryCardList, type OrderHistoryCardListProps } from './components/order-history/order-history-card-list';
export { CoachingSessionSnippet, type CoachingSessionSnippetProps } from './components/order-history/coaching-session-snippet';

export { ReceivedPaymentsCard, type ReceivedPaymentsCardProps } from './components/received-payments/received-payments-card';
export { ReceivedPaymentsCardList, type ReceivedPaymentsCardListProps } from './components/received-payments/received-payments-card-list';

export { AssignmentModalContent } from './components/assignment/assignment-modal-content';
export { Message } from './components/assignment/message';
export { ReplyPanel } from './components/assignment/reply-panel';

export { SideMenuCMS } from './components/sidemenu/sidemenu-cms';
export { SideMenuSection } from './components/sidemenu/sidemenu-section';
export { ManageCategoryTopicItem } from './components/manage-category-topic/manage-category-topic-item';
export { ManageCategoryTopicList } from './components/manage-category-topic/manage-category-topic-list';
export { SideMenuItem } from './components/sidemenu/sidemenu-item';
export { default as CreateEditCategoryTopicModal } from './components/create-modal/create-edit-category-topic-modal';
export { default as CoachingOfferingModal } from './components/coaching-offering-modal';
export { ManageCoachingOfferingItem } from './components/manage-coaching-offering/manage-coaching-offering-item';
export { ManageCoachingOfferingList } from './components/manage-coaching-offering/manage-coaching-offering-list';
export { CoachStudentInteractionCard } from './components/coach-student-interaction-card';
export { UserAvatar } from './components/avatar/user-avatar';

export { ReviewFilterModal, type ReviewFilterModel } from './components/grids/review-filter-modal';
export { default as CoachReviewCard, type ReviewCardProps as CoachReviewCardProps } from './components/review/coach-review-card';

// Coupons
export { CouponGrid, type CouponRow, type CouponGridProps } from './components/grids/coupon-grid';
export { CouponGridFilterModal, type CouponFilterModel, type CouponGridFilterModalProps } from './components/grids/coupon-grid-filter-modal';
export { RevokeCouponModal, type RevokeCouponModalProps } from './components/coupon/revoke-coupon-modal';
export { CreateCouponModal, type CreateCouponModalProps } from './components/coupon/create-coupon-modal';
export { CoachingSessionGroupOverviewList, CoachingSessionFilterModal, type CoachingSessionFilterModel } from './components/coaching-session-group-overview';
export { CoachingSessionGroupOverviewCard } from './components/coaching-session-group-overview/coaching-session-group-overview-card';
export { CoachReviewFilterModal, type CoachReviewFilterModel } from './components/review/coach-review-filter-modal';
export { GroupCoachingSessionBanner } from './components/group-coaching-session-banner';
export { GroupCoachingSessionReviewsBanner } from './components/group-coaching-session-reviews-banner';
export { CoachingSessionGrid } from './components/grids/coaching-session-grid';

// Transactions
export { TransactionsGrid, type TransactionRow, type TransactionsGridProps } from './components/grids/transactions-grid';
export { TransactionsGridFilterModal, type TransactionFilterModel, type TransactionsGridFilterModalProps } from './components/grids/transactions-grid-filter-modal';
export { AddTransactionModal, type AddTransactionModalProps } from './components/transactions/add-transaction-modal';

export { PreAssessmentForm } from './components/pre-assessment/pre-assessment-form';
export { PreCourseAssessmentBuilder, type PreCourseAssessmentBuilderProps } from './components/pre-assessment/pre-course-assessment-builder';
export { PreCourseAssessmentPreviewer, type PreCourseAssessmentPreviewerProps } from './components/pre-assessment/pre-course-assessment-previewer';


export * from "./components/cms"

export { JoinGroup } from './components/groups-card/join-group';
export { GroupOverviewCard, type GroupOverviewCardDetails, type GroupOverviewCardProps } from './components/groups-card/groups-overview-card';
export { GroupsList, type GroupsListProps } from './components/groups-card/groups-list';
export { CMSNotificationGrid } from './components/grids/cms-notification-grid';
export { default as RedeemStandaloneCoupon } from './components/redeem-standalone-coupon';

export { GroupIntroduction } from './components/group-introduction';
export { CoachNotesView, CoachNotesCreate } from './components/coach/coach-notes';
export { CoachNotesEditDialog } from './components/coach/coach-notes-edit-dialog';
export { CoachNotesResultPopup } from './components/coach/coach-notes-result-popup';
export { AssignmentCardFilterModal } from './components/assignment/assignment-card-filter-modal';
export { AssignmentOverview } from './components/assignment/assignment-overview';
export { AssignmentOverviewList } from './components/assignment/assignment-overview-list';

export { ProfessionalInfo } from './components/profile/professional-info';
export { BecomeACoachForm } from './components/profile/become-a-coach-form';

export { AutoPlayVideoPlayer, type AutoPlayVideoPlayerProps } from './components/auto-play-video-player';
export { PaginationButton, type PaginationButtonProps } from './components/pagination-button';

// Assignment types from cms-rest (authoritative backend schema)
export type { AssignmentReply, TAssignmentSenderResponse, TAssignmentReplyResponse, TAssignmentPassedResponse } from './types/assignment-types';
export { CoachReviewCardList } from './components/review/coach-review-card-list';
export { ReviewDisplay } from './components/review/review-display';
