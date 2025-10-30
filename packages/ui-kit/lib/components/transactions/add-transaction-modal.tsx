'use client';

import React, { useMemo, useState } from 'react';
import { Button } from '../button';
import { IconClose } from '../icons/icon-close';
import { TextInput } from '../text-input';
import { TextAreaInput } from '../text-areaInput';
import { DateInput } from '../date-input';
import { Dropdown } from '../dropdown';
import { InputField } from '../input-field';
import { IconSearch } from '../icons/icon-search';
import { CheckBox } from '../checkbox';
import { getDictionary, isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { UserAvatar } from '../avatar/user-avatar';
import { IconTrashAlt } from '../icons/icon-trash-alt';

type TCoach = { id: number; name: string; surname: string; username: string; avatarUrl?: string | null };
type TTag = { id: string | number; label?: string; name?: string };

export interface AddTransactionModalProps extends isLocalAware {
  onClose: () => void;
  onCreateTransaction: (data: {
    coachId: number;
    paidAt: string;
    amount: number;
    description?: string | null;
    invoiceUrl?: string | null;
    tagIds?: (string | number)[];
  }) => void;
  isCreating?: boolean;
  isSuccess?: boolean;
  errorMessage?: string | null;
  coachesQuery?: { data?: { data?: { coaches: TCoach[] } }; isLoading: boolean; error?: any };
  tagsQuery?: { data?: { data?: { tags: TTag[] } }; isLoading: boolean; error?: any };
  onCreateTag?: (name: string) => void;
  isCreatingTag?: boolean;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  onClose,
  onCreateTransaction,
  locale,
  isCreating = false,
  isSuccess = false,
  errorMessage = null,
  coachesQuery,
  tagsQuery,
  onCreateTag,
  isCreatingTag = false,
}) => {
  const dictionary = getDictionary(locale).components.addTransactionModal;

  // Form state
  const [selectedCoachId, setSelectedCoachId] = useState<number | null>(null);
  const [paymentDate, setPaymentDate] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [invoiceUrl, setInvoiceUrl] = useState<string>('');
  const [selectedTagIds, setSelectedTagIds] = useState<(string | number)[]>([]);
  const [coachSearch, setCoachSearch] = useState<string>('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);

  // Validation
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (!selectedCoachId) errors.push(dictionary.validationErrors.coachRequired);
    if (!paymentDate) errors.push(dictionary.validationErrors.paymentDateRequired);
    if (!amountInput) {
      errors.push(dictionary.validationErrors.amountRequired);
    } else if (isNaN(Number(amountInput)) || Number(amountInput) <= 0) {
      errors.push(dictionary.validationErrors.amountInvalid);
    }
    return errors;
  }, [selectedCoachId, paymentDate, amountInput, dictionary.validationErrors]);

  const isFormValid = validationErrors.length === 0;

  const coachesOptions = (coachesQuery?.data?.data?.coaches ?? []).map((c) => ({
    label: `${c.name} ${c.surname}`,
    value: String(c.id),
    avatarUrl: c.avatarUrl ?? undefined,
    searchText: `${c.name} ${c.surname}`,
  }));

  const tagsOptions = (tagsQuery?.data?.data?.tags ?? []).map((t: TTag) => ({
    label: t.name ?? t.label ?? '',
    value: String(t.id),
    searchText: t.name ?? t.label ?? '',
  }));

  const handleSubmit = () => {
    setHasAttemptedSubmit(true);
    if (!isFormValid || !selectedCoachId) return;
    onCreateTransaction({
      coachId: selectedCoachId,
      paidAt: paymentDate,
      amount: Number(amountInput),
      description: description?.trim() || undefined,
      invoiceUrl: invoiceUrl?.trim() || undefined,
      tagIds: selectedTagIds,
    });
  };

  const renderForm = () => (
    <div className="flex flex-col gap-4">
      {/* Coach selector */}
      <div className="flex flex-col gap-1">
        {selectedCoachId ? (
          (() => {
            const selected = (coachesQuery?.data?.data?.coaches ?? []).find((c) => String(c.id) === String(selectedCoachId));
            const fullName = selected ? `${selected.name} ${selected.surname}` : '';
            const avatarUrl = selected?.avatarUrl ?? undefined;
            return (
              <div className="flex flex-col gap-3 rounded-lg border border-card-stroke bg-card-fill p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar fullName={fullName} size="medium" imageUrl={avatarUrl} />
                    <div className="flex flex-col">
                      <h6 className="text-text-primary text-base font-semibold">{fullName}</h6>
                    </div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="medium"
                  hasIconLeft
                  iconLeft={<IconTrashAlt width={18} height={18} />}
                  text={dictionary.removeCoach}
                  onClick={() => setSelectedCoachId(null)}
                />
              </div>
            );
          })()
        ) : (
          <Dropdown
            type="single-choice-and-search-avatars"
            options={coachesOptions}
            onSelectionChange={(selected) => {
              if (typeof selected === 'string') setSelectedCoachId(parseInt(selected));
            }}
            text={{ simpleText: dictionary.coachPlaceholder, searchTextPlaceholder: dictionary.coachPlaceholder }}
            defaultValue={undefined}
          />
        )}
      </div>

      {/* Payment date */}
      <DateInput
        label={dictionary.paymentDateLabel}
        value={paymentDate}
        onChange={(v) => setPaymentDate(v || '')}
        locale={locale as TLocale}
      />

      {/* Amount */}
      <TextInput
        label={dictionary.amountLabel}
        inputField={{
          value: amountInput,
          setValue: setAmountInput,
          inputText: dictionary.amountPlaceholder,
          type: 'text',
        }}
      />

      {/* Description */}
      <TextAreaInput
        label={dictionary.descriptionLabel}
        value={description}
        setValue={setDescription}
        placeholder={dictionary.descriptionPlaceholder}
      />

      {/* Invoice URL */}
      <TextInput
        label={dictionary.invoiceUrlLabel}
        inputField={{
          value: invoiceUrl,
          setValue: setInvoiceUrl,
          inputText: dictionary.invoiceUrlPlaceholder,
          type: 'text',
        }}
      />

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <Dropdown
          type="multiple-choice-and-search-with-action"
          options={tagsOptions}
          onSelectionChange={(selected) => setSelectedTagIds((selected as string[]).map((v) => v))}
          text={{ multiText: dictionary.tagsPlaceholder, searchTextPlaceholder: dictionary.tagsPlaceholder }}
          defaultValue={selectedTagIds.map(String)}
          action={onCreateTag ? { label: `+ ${dictionary.addTag}`, onClick: (q) => onCreateTag(q) } : undefined}
        />
        {selectedTagIds.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTagIds.map((id) => (
              <CheckBox
                key={String(id)}
                name={`tag-${id}`}
                value={`tag-${id}`}
                label={tagsOptions.find((o) => o.value === String(id))?.label || String(id)}
                checked={true}
                onChange={() => setSelectedTagIds((prev) => prev.filter((x) => String(x) !== String(id)))}
                withText
              />
            ))}
          </div>
        )}
      </div>

      {/* Errors */}
      {(((hasAttemptedSubmit && validationErrors.length > 0)) || errorMessage) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          {hasAttemptedSubmit && validationErrors.length > 0 && (
            <ul className="text-red-800 text-sm">
              {validationErrors.map((e, i) => (
                <li key={i}>• {e}</li>
              ))}
            </ul>
          )}
          {errorMessage && <p className="text-red-800 text-sm">{errorMessage}</p>}
        </div>
      )}
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center gap-6 py-4">
      <h3 className="text-2xl font-bold text-center">{dictionary.successTitle}</h3>
      <Button variant="secondary" size="medium" text={dictionary.close} onClick={onClose} />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50" onClick={onClose}>
      <div className="flex flex-col gap-4 p-6 bg-card-fill text-text-primary w-full max-w-[600px] max-h-[85vh] overflow-y-auto rounded-md mx-4 my-8" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{dictionary.title}</h2>
          {!isSuccess && (
            <Button variant="text" size="small" hasIconLeft iconLeft={<IconClose size="6" />} onClick={onClose} disabled={isCreating} />
          )}
        </div>

        <div className="h-px w-full bg-divider"></div>

        <div className="flex flex-col gap-4">{isSuccess ? renderSuccess() : renderForm()}</div>

        {!isSuccess && (
          <>
            <div className="h-px w-full bg-divider"></div>
            <div className="flex gap-2">
              <Button variant="secondary" size="medium" onClick={onClose} className="flex-1" text={dictionary.goBack} disabled={isCreating} />
              <Button variant="primary" size="medium" onClick={handleSubmit} className="flex-1" text={isCreating ? dictionary.adding : dictionary.add} disabled={!isFormValid || isCreating} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};


