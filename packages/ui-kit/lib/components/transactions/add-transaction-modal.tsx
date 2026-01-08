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

  // Payment item type
  type PaymentItem = {
    description: string;
    unitPrice: string;
    quantity: string;
  };

  // Form state
  const [selectedCoachId, setSelectedCoachId] = useState<number | null>(null);
  const [paymentDate, setPaymentDate] = useState<string>('');
  const [paymentItems, setPaymentItems] = useState<PaymentItem[]>([
    { description: '', unitPrice: '', quantity: '1' }
  ]);
  const [invoiceUrl, setInvoiceUrl] = useState<string>('');
  const [selectedTagIds, setSelectedTagIds] = useState<(string | number)[]>([]);
  const [coachSearch, setCoachSearch] = useState<string>('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);

  // Validation
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (!selectedCoachId) errors.push(dictionary.validationErrors.coachRequired);
    if (!paymentDate) errors.push(dictionary.validationErrors.paymentDateRequired);

    // Validate payment items
    if (paymentItems.length === 0) {
      errors.push(dictionary.validationErrors.itemsRequired || 'At least one payment item is required');
    } else {
      paymentItems.forEach((item, index) => {
        if (!item.description?.trim()) {
          errors.push(`Item ${index + 1}: Description is required`);
        }
        if (!item.unitPrice || isNaN(Number(item.unitPrice)) || Number(item.unitPrice) <= 0) {
          errors.push(`Item ${index + 1}: Valid unit price is required`);
        }
        if (!item.quantity || isNaN(Number(item.quantity)) || Number(item.quantity) < 1) {
          errors.push(`Item ${index + 1}: Quantity must be at least 1`);
        }
      });
    }

    return errors;
  }, [selectedCoachId, paymentDate, paymentItems, dictionary.validationErrors]);

  const isFormValid = validationErrors.length === 0;

  const coachesOptions = (coachesQuery?.data?.data?.coaches ?? []).map((c) => {
    const hasNameAndSurname = c.name?.trim() && c.surname?.trim();
    const displayName = hasNameAndSurname ? `${c.name} ${c.surname}` : c.username;
    return {
      label: displayName,
      value: String(c.id),
      avatarUrl: c.avatarUrl ?? undefined,
      searchText: displayName,
    };
  });

  const tagsOptions = (tagsQuery?.data?.data?.tags ?? []).map((t: TTag) => ({
    label: t.name ?? t.label ?? '',
    value: String(t.id),
    searchText: t.name ?? t.label ?? '',
  }));

  const handleAddItem = () => {
    setPaymentItems([...paymentItems, { description: '', unitPrice: '', quantity: '1' }]);
  };

  const handleRemoveItem = (index: number) => {
    if (paymentItems.length === 1) return; // Keep at least one
    setPaymentItems(paymentItems.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof PaymentItem, value: string) => {
    const updated = [...paymentItems];
    updated[index] = { ...updated[index], [field]: value };
    setPaymentItems(updated);
  };

  const handleSubmit = () => {
    setHasAttemptedSubmit(true);
    if (!isFormValid || !selectedCoachId) return;

    const items = paymentItems.map(item => ({
      description: item.description.trim(),
      unitPrice: Number(item.unitPrice),
      quantity: Number(item.quantity),
    }));

    onCreateTransaction({
      coachId: selectedCoachId,
      paidAt: paymentDate,
      items,
      invoiceUrl: invoiceUrl?.trim() || undefined,
      tagIds: selectedTagIds,
    } as any);
  };

  const renderForm = () => (
    <div className="flex flex-col gap-4">
      {/* Coach selector */}
      <div className="flex flex-col gap-1">
        {selectedCoachId ? (
          (() => {
            const selected = (coachesQuery?.data?.data?.coaches ?? []).find((c) => String(c.id) === String(selectedCoachId));
            const hasNameAndSurname = selected?.name?.trim() && selected?.surname?.trim();
            const displayName = selected ? (hasNameAndSurname ? `${selected.name} ${selected.surname}` : selected.username) : '';
            const avatarUrl = selected?.avatarUrl ?? undefined;
            return (
              <div className="flex flex-col gap-3 rounded-lg border border-card-stroke bg-card-fill p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar fullName={displayName} size="medium" imageUrl={avatarUrl} />
                    <div className="flex flex-col">
                      <h6 className="text-text-primary text-base font-semibold">{displayName}</h6>
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

      {/* Payment Items */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-primary">
            {dictionary.paymentItemsLabel || 'Payment Items'}
          </label>
          <Button
            variant="text"
            size="small"
            text={`+ ${dictionary.addItem || 'Add Item'}`}
            onClick={handleAddItem}
          />
        </div>

        {paymentItems.map((item, index) => (
          <div key={index} className="flex flex-col gap-2 p-3 border border-card-stroke rounded-md bg-card-fill">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">Item {index + 1}</span>
              {paymentItems.length > 1 && (
                <Button
                  variant="text"
                  size="small"
                  hasIconLeft
                  iconLeft={<IconTrashAlt width={14} height={14} />}
                  onClick={() => handleRemoveItem(index)}
                />
              )}
            </div>

            {/* Description field */}
            <TextInput
              label={dictionary.itemDescriptionLabel || 'Description'}
              inputField={{
                value: item.description,
                setValue: (value) => handleUpdateItem(index, 'description', value),
                inputText: dictionary.itemDescriptionPlaceholder || 'e.g. Coaching Session 1',
                type: 'text',
              }}
            />

            {/* Unit Price and Quantity in same row */}
            <div className="grid grid-cols-2 gap-2">
              <TextInput
                label={dictionary.unitPriceLabel || 'Unit Price'}
                inputField={{
                  value: item.unitPrice,
                  setValue: (value) => handleUpdateItem(index, 'unitPrice', value),
                  inputText: '0.00',
                  type: 'number',
                }}
              />
              <TextInput
                label={dictionary.quantityLabel || 'Quantity'}
                inputField={{
                  value: item.quantity,
                  setValue: (value) => handleUpdateItem(index, 'quantity', value),
                  inputText: '1',
                  type: 'number',
                }}
              />
            </div>

            {/* Show subtotal */}
            {item.unitPrice && item.quantity && !isNaN(Number(item.unitPrice)) && !isNaN(Number(item.quantity)) && (
              <div className="text-xs text-text-secondary">
                Subtotal: {(Number(item.unitPrice) * Number(item.quantity)).toFixed(2)}
              </div>
            )}
          </div>
        ))}

        {/* Total */}
        {paymentItems.length > 0 && (
          <div className="flex justify-between items-center p-2 bg-card-stroke rounded-md">
            <span className="font-semibold text-text-primary">Total</span>
            <span className="font-semibold text-text-primary">
              {paymentItems.reduce((sum, item) => {
                const unitPrice = Number(item.unitPrice) || 0;
                const quantity = Number(item.quantity) || 0;
                return sum + (unitPrice * quantity);
              }, 0).toFixed(2)}
            </span>
          </div>
        )}
      </div>

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
    <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-[1100]" onClick={onClose}>
      <div className="flex flex-col gap-4 p-6 bg-card-fill border border-card-stroke text-text-primary w-full max-w-[600px] max-h-[80vh] overflow-y-auto rounded-md mx-4 my-8" onClick={(e) => e.stopPropagation()}>
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


