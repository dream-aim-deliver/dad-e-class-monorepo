'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../button';
import { IconClose } from '../icons/icon-close';
import { IconCheck } from '../icons/icon-check';
import { IconSave } from '../icons/icon-save';
import { TextInput } from '../text-input';
import { DateInput } from '../date-input';
import { RadioButton } from '../radio-button';
import { CheckBox } from '../checkbox';
import { Dropdown } from '../dropdown';
import { getDictionary, isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { COUPON_NAME_REGEX } from '@dream-aim-deliver/e-class-cms-rest';

// Types for form data
type CouponType = 'freeCourses' | 'freeBundles' | 'freeCoachingSession' | 'discountOnEverything' | 'groupCourse';

interface CourseOption {
  id: number;
  title: string;
  slug: string;
}

interface PackageOption {
  id: number;
  title: string;
}

interface CoachingOfferingOption {
  id: number;
  title: string;
  duration: number;
}

interface SelectedCourse {
  id: number;
  title: string;
  withCoaching: boolean;
}

interface SingleCourse {
  id: number;
  title: string;
  withCoaching: boolean;
}

interface SelectedPackage {
  id: number;
  title: string;
  withCoaching: boolean;
}

export interface CreateCouponModalProps extends isLocalAware {
  onClose: () => void;
  onSuccess: (couponName: string) => void;
  
  coursesQuery?: {
    data?: any;
    isLoading: boolean;
    error?: any;
  };
  packagesQuery?: {
    data?: any;
    isLoading: boolean;
    error?: any;
  };
  coachingQuery?: {
    data?: any;
    isLoading: boolean;
    error?: any;
  };
  onCreateCoupon: (data: any) => void;
  isCreating?: boolean;
  isSuccess?: boolean;
  createdCouponName?: string;
  errorMessage?: string | null;
}

/**
 * CreateCouponModal component for creating coupons with 5 different types.
 * Shows dynamic form fields based on coupon type, validation, and success/error states.
 *
 * @param onClose - Callback when modal should close
 * @param onSuccess - Callback when coupon is successfully created
 * @param locale - For translations
 * @param coursesQuery - TRPC query for platform courses
 * @param packagesQuery - TRPC query for platform packages
 * @param coachingQuery - TRPC query for platform coaching offerings
 * @param onCreateCoupon - Callback to trigger coupon creation mutation
 * @param isCreating - Loading state for the create button
 * @param isSuccess - Success state to show success message
 * @param createdCouponName - Name of the successfully created coupon
 * @param errorMessage - Error message to display
 *
 * @example
 * <CreateCouponModal
 *   locale="en"
 *   onClose={() => setModalOpen(false)}
 *   onSuccess={(couponName) => console.log('Created:', couponName)}
 *   coursesQuery={coursesQuery}
 *   packagesQuery={packagesQuery}
 *   coachingQuery={coachingQuery}
 *   onCreateCoupon={(data) => createCouponMutation.mutate(data)}
 *   isCreating={isLoading}
 *   isSuccess={isSuccess}
 *   createdCouponName={createdCouponName}
 *   errorMessage={errorMessage}
 * />
 */
export const CreateCouponModal: React.FC<CreateCouponModalProps> = ({
  onClose,
  onSuccess,
  locale,
  coursesQuery,
  packagesQuery,
  coachingQuery,
  onCreateCoupon,
  isCreating = false,
  isSuccess = false,
  createdCouponName: propCreatedCouponName,
  errorMessage = null,
}) => {
  const dictionary = getDictionary(locale).components.createCouponModal;
  
  // Form state
  const [couponName, setCouponName] = useState('');
  const [usagesAllowed, setUsagesAllowed] = useState<number | null>(null);
  const [usagesAllowedPerUser, setUsagesAllowedPerUser] = useState<number | null>(null);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<CouponType | null>(null);

  // Type-specific form states
  const [selectedCourses, setSelectedCourses] = useState<SelectedCourse[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<SelectedPackage[]>([]);
  const [coachingDuration, setCoachingDuration] = useState<number | null>(null);
  const [isCoachingPartOfCourse, setIsCoachingPartOfCourse] = useState(false);
  const [selectedCoachingOffering, setSelectedCoachingOffering] = useState<number | null>(null);
  const [selectedCourseForCoaching, setSelectedCourseForCoaching] = useState<number | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState<number | null>(null);
  const [selectedGroupCourse, setSelectedGroupCourse] = useState<number | null>(null);
  const [groupName, setGroupName] = useState('');

  // Search state
  const [courseSearchQuery, setCourseSearchQuery] = useState('');

  // Validation state
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);
  const [couponNameTouched, setCouponNameTouched] = useState<boolean>(false);
  const [usagesAllowedTouched, setUsagesAllowedTouched] = useState<boolean>(false);
  const [usagesAllowedInput, setUsagesAllowedInput] = useState<string>('');
  const [usagesAllowedPerUserTouched, setUsagesAllowedPerUserTouched] = useState<boolean>(false);
  const [usagesAllowedPerUserInput, setUsagesAllowedPerUserInput] = useState<string>('');
  const [expirationDateTouched, setExpirationDateTouched] = useState<boolean>(false);

  // Coupon name validation
  const validateCouponName = (): string | null => {
    if (!couponName.trim()) {
      return dictionary.validationErrors.nameRequired;
    }
    if (!COUPON_NAME_REGEX.test(couponName)) {
      return 'Coupon name can only contain letters and numbers (no spaces or special characters)';
    }
    return null;
  };

  // Usages allowed validation
  const validateUsagesAllowed = (): string | null => {
    if (usagesAllowedInput && /[^0-9]/.test(usagesAllowedInput)) {
      return 'Only numbers are allowed';
    }
    return null;
  };

  // Usages allowed per user validation
  const validateUsagesAllowedPerUser = (): string | null => {
    if (usagesAllowedPerUserInput && /[^0-9]/.test(usagesAllowedPerUserInput)) {
      return 'Only numbers are allowed';
    }
    return null;
  };

  // Expiration date validation
  const validateExpirationDate = (): string | null => {
    if (!expirationDate) return null;

    const selectedDate = new Date(expirationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day for fair comparison

    if (selectedDate < today) {
      return 'Expiration date cannot be in the past';
    }
    return null;
  };

  // Validation function
  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!couponName.trim()) {
      errors.push(dictionary.validationErrors.nameRequired);
    } else if (!COUPON_NAME_REGEX.test(couponName)) {
      errors.push('Coupon name can only contain letters and numbers (no spaces or special characters)');
    }

    if (usagesAllowedInput && /[^0-9]/.test(usagesAllowedInput)) {
      errors.push('Only numbers are allowed for usages');
    }

    if (usagesAllowedPerUserInput && /[^0-9]/.test(usagesAllowedPerUserInput)) {
      errors.push('Only numbers are allowed for usages per user');
    }

    const expirationError = validateExpirationDate();
    if (expirationError) {
      errors.push(expirationError);
    }

    if (!selectedType) {
      errors.push(dictionary.validationErrors.typeRequired);
    }

    switch (selectedType) {
      case 'freeCourses':
        if (selectedCourses.length === 0) {
          errors.push(dictionary.validationErrors.courseRequired);
        }
        break;
      case 'freeBundles':
        if (selectedPackages.length === 0) {
          errors.push(dictionary.validationErrors.packagesRequired);
        }
        break;
      case 'freeCoachingSession':
        if (!coachingDuration) {
          errors.push(dictionary.validationErrors.durationRequired);
        }
        if (!selectedCoachingOffering) {
          errors.push(dictionary.validationErrors.coachingRequired);
        }
        break;
      case 'discountOnEverything':
        if (!discountPercentage || discountPercentage < 1 || discountPercentage > 100) {
          errors.push(dictionary.validationErrors.percentageInvalid);
        }
        break;
      case 'groupCourse':
        if (!selectedGroupCourse) {
          errors.push(dictionary.validationErrors.courseRequired);
        }
        if (!groupName.trim()) {
          errors.push(dictionary.validationErrors.groupNameRequired);
        }
        break;
    }

    return errors;
  };

  const displayedValidationErrors = showValidationErrors ? validateForm() : [];
  const isFormValid = validateForm().length === 0;

  const handleCreateCoupon = async () => {
    setShowValidationErrors(true);
    const errors = validateForm();
    
    if (errors.length > 0) return;

    // Build coupon content based on selected type
    let couponContent: any = {};

    switch (selectedType) {
      case 'freeCourses':
        if (selectedCourses.length === 0) {
          throw new Error('At least one course is required for free course coupon');
        }
        couponContent = {
          type: 'freeCourses',
          courseIds: selectedCourses.map(course => ({
            id: course.id,
            withCoaching: course.withCoaching
          }))
        };
        break;
      case 'freeBundles':
        couponContent = {
          type: 'freeBundles',
          packages: selectedPackages.map(pkg => ({
            id: pkg.id,
            withCoaching: pkg.withCoaching
          }))
        };
        break;
      case 'freeCoachingSession':
        if (!selectedCoachingOffering) {
          throw new Error('Coaching offering ID is required for free coaching session coupon');
        }
        couponContent = {
          type: 'freeCoachingSession',
          coachingOfferingId: selectedCoachingOffering,
          courseId: isCoachingPartOfCourse ? selectedCourseForCoaching : null
        };
        break;
      case 'discountOnEverything':
        if (!discountPercentage) {
          throw new Error('Discount percentage is required for discount on everything coupon');
        }
        couponContent = {
          type: 'discountOnEverything',
          percentage: discountPercentage
        };
        break;
      case 'groupCourse':
        if (!selectedGroupCourse) {
          throw new Error('Course ID is required for group course coupon');
        }
        couponContent = {
          type: 'groupCourse',
          courseId: selectedGroupCourse,
          groupName: groupName
        };
        break;
    }

    const mutationData = {
      name: couponName,
      usagesAllowed: usagesAllowed,
      usagesAllowedPerUser: usagesAllowedPerUser,
      expirationDate: expirationDate,
      couponContent: couponContent
    };

    onCreateCoupon(mutationData);
  };

  const handleCopyCouponCode = () => {
    navigator.clipboard.writeText(propCreatedCouponName || '');
    // TODO: Show toast notification
  };

  const handleCourseToggle = (courseId: number, courseTitle: string, courseSlug: string) => {
    setSelectedCourses(prev => {
      const exists = prev.find(c => c.id === courseId);
      if (exists) {
        // Remove course
        return prev.filter(c => c.id !== courseId);
      } else {
        // Add course
        return [...prev, { id: courseId, title: courseTitle, withCoaching: false }];
      }
    });
  };

  const handlePackageSelection = (packageIds: string[]) => {
    if (!packagesQuery?.data?.data?.packages) return;
    
    const packages = packagesQuery.data.data.packages.filter((pkg: any) => 
      packageIds.includes(pkg.id.toString())
    );
    
    const newSelectedPackages = packages.map((pkg: any) => ({
      id: pkg.id,
      title: pkg.title,
      withCoaching: false
    }));
    
    setSelectedPackages(newSelectedPackages);
  };

  const toggleCourseCoaching = (courseId: number) => {
    setSelectedCourses(prev =>
      prev.map(course =>
        course.id === courseId
          ? { ...course, withCoaching: !course.withCoaching }
          : course
      )
    );
  };

  const togglePackageCoaching = (packageId: number) => {
    setSelectedPackages(prev => 
      prev.map(pkg => 
        pkg.id === packageId 
          ? { ...pkg, withCoaching: !pkg.withCoaching }
          : pkg
      )
    );
  };

  const renderFormContent = () => {
    return (
      <div className="flex flex-col gap-4">
        {/* Common Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <TextInput
              label={dictionary.couponName}
              inputField={{
                value: couponName,
                setValue: (value) => {
                  setCouponName(value);
                  setCouponNameTouched(true);
                },
                inputText: "Ex: FREECOURSE",
              }}
            />
            {couponNameTouched && validateCouponName() && (
              <p className="text-red-600 text-sm">{validateCouponName()}</p>
            )}
          </div>
          
          <div className="flex flex-col gap-1">
            <TextInput
              label={dictionary.usagesAllowed}
              inputField={{
                value: usagesAllowedInput,
                setValue: (value) => {
                  setUsagesAllowedTouched(true);
                  setUsagesAllowedInput(value);
                  // Only set the actual number if it's valid
                  if (value === '' || value === null) {
                    setUsagesAllowed(null);
                  } else if (/^[0-9]+$/.test(value)) {
                    setUsagesAllowed(parseInt(value));
                  }
                },
                inputText: dictionary.usagesAllowedPlaceholder,
                type: 'text',
              }}
            />
            {usagesAllowedTouched && validateUsagesAllowed() && (
              <p className="text-red-600 text-sm">{validateUsagesAllowed()}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <TextInput
              label={dictionary.usagesAllowedPerUser}
              inputField={{
                value: usagesAllowedPerUserInput,
                setValue: (value) => {
                  setUsagesAllowedPerUserTouched(true);
                  setUsagesAllowedPerUserInput(value);
                  // Only set the actual number if it's valid
                  if (value === '' || value === null) {
                    setUsagesAllowedPerUser(null);
                  } else if (/^[0-9]+$/.test(value)) {
                    setUsagesAllowedPerUser(parseInt(value));
                  }
                },
                inputText: dictionary.usagesAllowedPerUserPlaceholder,
                type: 'text',
              }}
            />
            {usagesAllowedPerUserTouched && validateUsagesAllowedPerUser() && (
              <p className="text-red-600 text-sm">{validateUsagesAllowedPerUser()}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <DateInput
              label={dictionary.expirationDate}
              value={expirationDate || ''}
              onChange={(value) => {
                setExpirationDateTouched(true);
                setExpirationDate(value || null);
              }}
              locale={locale}
            />
            {expirationDateTouched && validateExpirationDate() && (
              <p className="text-red-600 text-sm">{validateExpirationDate()}</p>
            )}
          </div>
        </div>

        {/* Coupon Type Selection */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">{dictionary.couponType}</h3>
          
          <div className="flex flex-col gap-2">
            <RadioButton
              name="couponType"
              value="freeCourses"
              label={dictionary.freeCourse}
              checked={selectedType === 'freeCourses'}
              onChange={() => setSelectedType('freeCourses')}
              withText
            />
            
            <RadioButton
              name="couponType"
              value="freeBundles"
              label={dictionary.freeBundles}
              checked={selectedType === 'freeBundles'}
              onChange={() => setSelectedType('freeBundles')}
              withText
            />
            
            <RadioButton
              name="couponType"
              value="freeCoachingSession"
              label={dictionary.freeCoachingSessions}
              checked={selectedType === 'freeCoachingSession'}
              onChange={() => setSelectedType('freeCoachingSession')}
              withText
            />
            
            <RadioButton
              name="couponType"
              value="discountOnEverything"
              label={dictionary.discountOnEverything}
              checked={selectedType === 'discountOnEverything'}
              onChange={() => setSelectedType('discountOnEverything')}
              withText
            />
            
            <RadioButton
              name="couponType"
              value="groupCourse"
              label={dictionary.groupCourse}
              checked={selectedType === 'groupCourse'}
              onChange={() => setSelectedType('groupCourse')}
              withText
            />
          </div>
        </div>

        {/* Dynamic Fields Based on Selected Type */}
        {selectedType && (
          <div className="flex flex-col gap-4">
            {/* Free Course */}
            {selectedType === 'freeCourses' && (
              <div className="flex flex-col gap-3">
                <h4 className="font-medium">{dictionary.selectCourse}</h4>
                {coursesQuery?.isLoading ? (
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">Loading courses...</p>
                  </div>
                ) : coursesQuery?.data?.data?.courses ? (
                  <div className="flex flex-col gap-3">
                    {/* Search Input */}
                    <TextInput
                      label=""
                      inputField={{
                        value: courseSearchQuery,
                        setValue: setCourseSearchQuery,
                        inputText: "Search courses...",
                      }}
                    />

                    {/* Course Selection List */}
                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto border border-divider rounded-md p-2">
                      {coursesQuery.data.data.courses
                        .filter((course: any) => {
                          const searchLower = courseSearchQuery.toLowerCase();
                          return (
                            course.title.toLowerCase().includes(searchLower) ||
                            course.slug.toLowerCase().includes(searchLower)
                          );
                        })
                        .sort((a: any, b: any) => a.title.localeCompare(b.title))
                        .map((course: any) => {
                          const isSelected = selectedCourses.some(c => c.id === course.id);
                          return (
                            <div key={course.id} className="flex flex-col gap-2">
                              <CheckBox
                                name={`course-select-${course.id}`}
                                value={`course-select-${course.id}`}
                                label={`${course.title} (${course.slug})`}
                                checked={isSelected}
                                onChange={() => handleCourseToggle(course.id, course.title, course.slug)}
                                withText
                              />
                            </div>
                          );
                        })}
                    </div>

                    {/* Selected Courses with Coaching Toggles */}
                    {selectedCourses.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h5 className="font-medium text-sm">{dictionary.withCoaching}</h5>
                        {selectedCourses.map(course => (
                          <CheckBox
                            key={`coaching-${course.id}`}
                            name={`course-coaching-${course.id}`}
                            value={`course-coaching-${course.id}`}
                            label={course.title}
                            checked={course.withCoaching}
                            onChange={() => toggleCourseCoaching(course.id)}
                            withText
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 rounded-md">
                    <p className="text-sm text-red-600">Failed to load courses</p>
                  </div>
                )}
              </div>
            )}

            {/* Free Bundles */}
            {selectedType === 'freeBundles' && (
              <div className="flex flex-col gap-3">
                <h4 className="font-medium">{dictionary.selectPackages}</h4>
                {packagesQuery?.isLoading ? (
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">Loading packages...</p>
                  </div>
                ) : packagesQuery?.data?.data?.packages ? (
                  <>
                    <Dropdown
                      type="multiple-choice-and-search"
                      options={packagesQuery.data.data.packages.map((pkg: any) => ({
                        label: pkg.title,
                        value: pkg.id.toString()
                      }))}
                      onSelectionChange={(selected) => handlePackageSelection(selected as string[])}
                      text={{ multiText: dictionary.selectPackages }}
                      defaultValue={selectedPackages.map(p => p.id.toString())}
                      className="[&_div.truncate]:max-w-none [&_div.truncate]:whitespace-normal"
                    />
                    
                    {/* Selected Packages with Coaching Checkboxes */}
                    {selectedPackages.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h5 className="font-medium text-sm">{dictionary.withCoaching}</h5>
                        {selectedPackages.map(pkg => (
                          <CheckBox
                            key={pkg.id}
                            name={`package-${pkg.id}`}
                            value={`package-${pkg.id}`}
                            label={pkg.title}
                            checked={pkg.withCoaching}
                            onChange={() => togglePackageCoaching(pkg.id)}
                            withText
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-red-50 rounded-md">
                    <p className="text-sm text-red-600">Failed to load packages</p>
                  </div>
                )}
              </div>
            )}

            {/* Free Coaching Sessions */}
            {selectedType === 'freeCoachingSession' && (
              <div className="flex flex-col gap-3">
                {coachingQuery?.isLoading ? (
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">Loading coaching offerings...</p>
                  </div>
                ) : coachingQuery?.data?.data?.coachingOfferings ? (
                  <>
                    <h4 className="font-medium">{dictionary.selectCoachingOffering}</h4>
                    <Dropdown
                      type="simple"
                      options={coachingQuery.data.data.coachingOfferings.map((offering: any) => ({
                        label: `${offering.title} (${offering.duration} ${dictionary.minutes})`,
                        value: offering.id.toString()
                      }))}
                      onSelectionChange={(selected) => {
                        if (selected && typeof selected === 'string') {
                          const offeringId = parseInt(selected);
                          setSelectedCoachingOffering(offeringId);
                          // Set duration from the selected offering
                          const offering = coachingQuery.data.data.coachingOfferings.find((o: any) => o.id === offeringId);
                          if (offering) {
                            setCoachingDuration(offering.duration);
                          }
                        } else {
                          setSelectedCoachingOffering(null);
                          setCoachingDuration(null);
                        }
                      }}
                      text={{ simpleText: dictionary.selectCoachingOffering }}
                      defaultValue={selectedCoachingOffering?.toString()}
                      className="[&_div.truncate]:max-w-none [&_div.truncate]:whitespace-normal"
                    />

                    <CheckBox
                      name="isPartOfCourse"
                      value="isPartOfCourse"
                      label={dictionary.isPartOfCourse}
                      checked={isCoachingPartOfCourse}
                      onChange={() => setIsCoachingPartOfCourse(!isCoachingPartOfCourse)}
                      withText
                    />

                    {isCoachingPartOfCourse && coursesQuery?.data?.data?.courses && (
                      <div className="flex flex-col gap-2">
                        <h4 className="font-medium">{dictionary.selectCourse}</h4>
                        <Dropdown
                          type="simple"
                          options={coursesQuery.data.data.courses.map((course: any) => ({
                            label: course.title,
                            value: course.id.toString()
                          }))}
                          onSelectionChange={(selected) => setSelectedCourseForCoaching(selected && typeof selected === 'string' ? parseInt(selected) : null)}
                          text={{ simpleText: dictionary.selectCourse }}
                          defaultValue={selectedCourseForCoaching?.toString()}
                          className="[&_div.truncate]:max-w-none [&_div.truncate]:whitespace-normal"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-red-50 rounded-md">
                    <p className="text-sm text-red-600">Failed to load coaching offerings</p>
                  </div>
                )}
              </div>
            )}

            {/* Discount on Everything */}
            {selectedType === 'discountOnEverything' && (
              <div className="flex flex-col gap-3">
                <TextInput
                  label={dictionary.percentage}
                  inputField={{
                    value: discountPercentage?.toString() || '',
                    setValue: (value) => setDiscountPercentage(value ? parseInt(value) : null),
                    inputText: "1-100",
                    type: 'number',
                    min: 1,
                    max: 100,
                  }}
                />
              </div>
            )}

            {/* Group Course */}
            {selectedType === 'groupCourse' && (
              <div className="flex flex-col gap-3">
                {coursesQuery?.data?.data?.courses && (
                  <div className="flex flex-col gap-2">
                    <h4 className="font-medium">{dictionary.selectCourse}</h4>
                    <Dropdown
                      type="simple"
                      options={coursesQuery.data.data.courses.map((course: any) => ({
                        label: course.title,
                        value: course.id.toString()
                      }))}
                      onSelectionChange={(selected) => setSelectedGroupCourse(selected && typeof selected === 'string' ? parseInt(selected) : null)}
                      text={{ simpleText: dictionary.selectCourse }}
                      defaultValue={selectedGroupCourse?.toString()}
                      className="[&_div.truncate]:max-w-none [&_div.truncate]:whitespace-normal"
                    />
                  </div>
                )}
                
                <TextInput
                  label={dictionary.groupName}
                  inputField={{
                    value: groupName,
                    setValue: setGroupName,
                    inputText: dictionary.groupNamePlaceholder,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Error Messages */}
        {displayedValidationErrors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <ul className="text-red-800 text-sm">
              {displayedValidationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{errorMessage}</p>
          </div>
        )}
      </div>
    );
  };

  const renderSuccessContent = () => {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <h3 className="text-2xl font-bold text-center">{dictionary.successTitle}</h3>
        
        {/* Coupon Code Display */}
        <div className="w-full max-w-sm bg-gray-100 rounded-lg p-4 border border-gray-200">
          <p className="text-center text-gray-700 text-lg font-mono">
            {propCreatedCouponName}
          </p>
        </div>
        
        {/* Copy Code Button */}
        <Button
          variant="primary"
          size="medium"
          text={dictionary.copyCouponCode}
          hasIconLeft
          iconLeft={<IconSave size="4" />}
          onClick={handleCopyCouponCode}
          className="w-full max-w-sm"
        />
        
        {/* Close Button */}
        <Button
          variant="secondary"
          size="medium"
          text={dictionary.close}
          onClick={onClose}
        />
      </div>
    );
  };

  const renderNameConflictContent = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
            <span className="text-yellow-600 text-sm">⚠</span>
          </div>
          <h3 className="text-lg font-semibold">{dictionary.nameConflictTitle}</h3>
        </div>
        
        <p className="text-text-primary">
          {dictionary.nameConflictMessage.replace('{couponName}', couponName)}
        </p>

        <div className="flex flex-col gap-1">
          <TextInput
            label={dictionary.couponName}
            inputField={{
              value: couponName,
              setValue: (value) => {
                setCouponName(value);
                setCouponNameTouched(true);
              },
              inputText: dictionary.couponNamePlaceholder,
            }}
          />
          {couponNameTouched && validateCouponName() && (
            <p className="text-red-600 text-sm">{validateCouponName()}</p>
          )}
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{errorMessage}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50 pt-16" onClick={onClose}>
      <div className="flex flex-col gap-4 p-6 bg-card-fill border border-card-stroke text-text-primary w-full max-w-[600px] max-h-[85vh] overflow-hidden rounded-md mx-4 my-8" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{isSuccess ? dictionary.successTitle : dictionary.title}</h2>
          <Button 
            variant="text" 
            size="small" 
            hasIconLeft 
            iconLeft={<IconClose size="6" />} 
            onClick={onClose}
            disabled={isCreating}
          />
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-divider"></div>

        {/* Content */}
        <div className="flex flex-col gap-4 overflow-y-auto flex-1 min-h-0">
          {isSuccess ? (
            renderSuccessContent()
          ) : errorMessage?.includes('name_already_exists') ? (
            renderNameConflictContent()
          ) : (
            renderFormContent()
          )}
        </div>

        {/* Buttons */}
        {!isSuccess && !errorMessage?.includes('name_already_exists') && (
          <>
            <div className="h-px w-full bg-divider"></div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="medium"
                onClick={onClose}
                className="flex-1"
                text={dictionary.goBack}
                disabled={isCreating}
              />
              <Button
                variant="primary"
                size="medium"
                onClick={handleCreateCoupon}
                className="flex-1"
                text={isCreating ? dictionary.creating : dictionary.createCoupon}
                disabled={!isFormValid || isCreating}
              />
            </div>
          </>
        )}

        {errorMessage?.includes('name_already_exists') && (
          <>
            <div className="h-px w-full bg-divider"></div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="medium"
                onClick={onClose}
                className="flex-1"
                text={dictionary.goBack}
                disabled={isCreating}
              />
              <Button
                variant="primary"
                size="medium"
                onClick={handleCreateCoupon}
                className="flex-1"
                text={isCreating ? dictionary.creating : dictionary.createCoupon}
                disabled={!!validateCouponName() || isCreating}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
