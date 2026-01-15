/**
 * Invoice PDF Generator Utility
 *
 * Generates professional A4 invoice PDFs from transaction data.
 * Can be used across the application for consistent invoice generation.
 */

import type { TLocale } from '@maany_shr/e-class-translations';

export interface InvoicePlatformData {
  name: string;
  logoUrl?: string | null;
  domainName?: string;
  companyName: string;
  companyAddress: string;
  companyUid: string;
}

export interface InvoiceCustomerData {
  name: string | null;
  surname: string | null;
  email: string | null;
  phone?: string | null;
  companyDetails?: {
    isRepresentingCompany?: boolean;
    companyName?: string | null;
    companyUid?: string | null;
    companyAddress?: string | null;
  } | null;
}

export interface InvoiceTransactionData {
  id: string | number;
  createdAt: string | Date;
  currency: string;
  content: {
    type: 'course' | 'coachingOffers' | 'package';
    unitPrice: number;
    course?: {
      title: string;
      id: string | number;
    };
    items?: Array<{
      title: string;
      duration: string;
      unitPrice: number;
      quantity: number;
    }>;
    package?: {
      title: string;
      id: string | number;
    };
  };
  coupon?: {
    name: string;
    type: string;
    discountPercentage?: number | null;
  } | null;
}

export interface GenerateInvoicePdfOptions {
  transaction: InvoiceTransactionData;
  platformData: InvoicePlatformData;
  customerData: InvoiceCustomerData;
  locale: TLocale;
  translations: {
    invoiceNo: string;
    invoiceDate: string;
    customerDetails: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    companyName: string;
    companyUidVat: string;
    companyEmail: string;
    companyAddress: string;
    orderId: string;
    pricePerUnit: string;
    units: string;
    total: string;
    course: string;
    coachingSession: string;
    package: string;
    totalLabel: string;
    paymentMethod: string;
    type: string;
    description: string;
    coupon: string;
    discount: string;
  };
}

/**
 * Generates and downloads an invoice PDF
 */
export async function generateInvoicePdf(options: GenerateInvoicePdfOptions): Promise<void> {
  const { transaction, platformData, customerData, locale, translations: t } = options;

  // Dynamically import html2pdf only when needed (client-side only)
  const html2pdf = (await import('html2pdf.js')).default;

  // Helper function to format price with 2 decimal places
  const formatPrice = (price: number) => price.toFixed(2);

  // Create invoice content wrapper
  // A4 dimensions: 210mm x 297mm
  const wrapper = document.createElement('div');
  wrapper.style.width = '210mm';
  wrapper.style.margin = '0';
  wrapper.style.padding = '20mm';
  wrapper.style.backgroundColor = '#ffffff';
  wrapper.style.color = '#000000';
  wrapper.style.fontFamily = '"Figtree", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  wrapper.style.lineHeight = '1.4';
  wrapper.style.boxSizing = 'border-box';

  // Top Header: Logo + Platform Name | Invoice Info
  const topHeader = document.createElement('div');
  topHeader.style.display = 'flex';
  topHeader.style.justifyContent = 'space-between';
  topHeader.style.alignItems = 'flex-start';
  topHeader.style.marginBottom = '10mm';

  // Left: Logo and Platform Name
  const brandingContainer = document.createElement('div');
  brandingContainer.style.display = 'flex';
  brandingContainer.style.alignItems = 'center';
  brandingContainer.style.gap = '8px';
  brandingContainer.style.flex = '1';

  if (platformData.logoUrl) {
    const logo = document.createElement('img');
    logo.src = platformData.logoUrl;
    logo.style.width = '40px';
    logo.style.height = '40px';
    logo.style.objectFit = 'contain';
    brandingContainer.appendChild(logo);
  }

  const platformTitle = document.createElement('h1');
  platformTitle.textContent = platformData.name;
  platformTitle.style.fontSize = '18px';
  platformTitle.style.fontWeight = '700';
  platformTitle.style.color = '#000000';
  platformTitle.style.margin = '0';
  brandingContainer.appendChild(platformTitle);

  topHeader.appendChild(brandingContainer);

  // Right: Invoice Info
  const invoiceInfo = document.createElement('div');
  invoiceInfo.style.textAlign = 'right';
  invoiceInfo.style.minWidth = '80mm';

  const invoiceNoLabel = document.createElement('div');
  invoiceNoLabel.style.fontSize = '10px';
  invoiceNoLabel.style.color = '#666666';
  invoiceNoLabel.style.marginBottom = '2px';
  invoiceNoLabel.textContent = t.invoiceNo;
  invoiceInfo.appendChild(invoiceNoLabel);

  const invoiceNo = document.createElement('div');
  invoiceNo.style.fontSize = '12px';
  invoiceNo.style.fontWeight = '600';
  invoiceNo.style.color = '#000000';
  invoiceNo.style.marginBottom = '8px';
  invoiceNo.textContent = String(transaction.id);
  invoiceInfo.appendChild(invoiceNo);

  const invoiceDateLabel = document.createElement('div');
  invoiceDateLabel.style.fontSize = '10px';
  invoiceDateLabel.style.color = '#666666';
  invoiceDateLabel.style.marginBottom = '2px';
  invoiceDateLabel.textContent = t.invoiceDate;
  invoiceInfo.appendChild(invoiceDateLabel);

  const invoiceDate = document.createElement('div');
  invoiceDate.style.fontSize = '12px';
  invoiceDate.style.fontWeight = '600';
  invoiceDate.style.color = '#000000';
  const dateLocale = locale === 'de' ? 'de-DE' : 'en-GB';
  invoiceDate.textContent = new Date(transaction.createdAt).toLocaleDateString(dateLocale);
  invoiceInfo.appendChild(invoiceDate);

  topHeader.appendChild(invoiceInfo);
  wrapper.appendChild(topHeader);

  // Customer Details Section (only if data exists)
  const customerSection = document.createElement('div');
  customerSection.style.marginBottom = '8mm';

  const customerTitle = document.createElement('h2');
  customerTitle.textContent = t.customerDetails;
  customerTitle.style.fontSize = '20px';
  customerTitle.style.fontWeight = '600';
  customerTitle.style.color = '#000000';
  customerTitle.style.marginBottom = '4mm';
  customerTitle.style.marginTop = '0';
  customerSection.appendChild(customerTitle);

  const customerGrid = document.createElement('div');
  customerGrid.style.display = 'grid';
  customerGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
  customerGrid.style.gap = '3mm';
  customerGrid.style.fontSize = '10px';

  // Helper function to create customer detail field - only if value exists
  const createDetailField = (label: string, value: string | null | undefined) => {
    if (!value) return null;

    const field = document.createElement('div');
    const fieldLabel = document.createElement('div');
    fieldLabel.textContent = label;
    fieldLabel.style.color = '#666666';
    fieldLabel.style.marginBottom = '4px';
    field.appendChild(fieldLabel);

    const fieldValue = document.createElement('div');
    fieldValue.textContent = value;
    fieldValue.style.color = '#000000';
    fieldValue.style.fontWeight = '500';
    field.appendChild(fieldValue);

    return field;
  };

  // Build customer details
  const firstName = customerData.name;
  const lastName = customerData.surname;
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName;
  const userEmail = customerData.email;
  const phoneNumber = customerData.phone;

  const companyDetails = customerData.companyDetails;
  const isRepresentingCompany = companyDetails?.isRepresentingCompany === true;
  const companyName = isRepresentingCompany ? companyDetails?.companyName : null;
  const companyVat = isRepresentingCompany ? companyDetails?.companyUid : null;
  const companyAddress = isRepresentingCompany ? companyDetails?.companyAddress : null;
  const companyEmail = isRepresentingCompany ? userEmail : null;

  // Add fields that have data
  const nameField = createDetailField(t.fullName, fullName);
  if (nameField) customerGrid.appendChild(nameField);

  const emailField = createDetailField(t.email, userEmail);
  if (emailField) customerGrid.appendChild(emailField);

  const phoneField = createDetailField(t.phoneNumber, phoneNumber);
  if (phoneField) customerGrid.appendChild(phoneField);

  const companyNameField = createDetailField(t.companyName, companyName);
  if (companyNameField) customerGrid.appendChild(companyNameField);

  const vatField = createDetailField(t.companyUidVat, companyVat);
  if (vatField) customerGrid.appendChild(vatField);

  const companyEmailField = createDetailField(t.companyEmail, companyEmail);
  if (companyEmailField) customerGrid.appendChild(companyEmailField);

  if (companyAddress) {
    const addressField = document.createElement('div');
    addressField.style.gridColumn = 'span 3';
    const addressLabel = document.createElement('div');
    addressLabel.textContent = t.companyAddress;
    addressLabel.style.color = '#666666';
    addressLabel.style.marginBottom = '4px';
    addressField.appendChild(addressLabel);
    const addressValue = document.createElement('div');
    addressValue.textContent = companyAddress;
    addressValue.style.color = '#000000';
    addressValue.style.fontWeight = '500';
    addressField.appendChild(addressValue);
    customerGrid.appendChild(addressField);
  }

  // Only append customer section if there's data
  if (customerGrid.children.length > 0) {
    customerSection.appendChild(customerGrid);
    wrapper.appendChild(customerSection);
  }

  // Order Details Section
  const orderSection = document.createElement('div');
  orderSection.style.marginBottom = '8mm';

  const orderTitle = document.createElement('h2');
  orderTitle.textContent = `${t.orderId}: ${transaction.id}`;
  orderTitle.style.fontSize = '20px';
  orderTitle.style.fontWeight = '600';
  orderTitle.style.color = '#000000';
  orderTitle.style.marginBottom = '2px';
  orderTitle.style.marginTop = '0';
  orderSection.appendChild(orderTitle);

  const orderDate = document.createElement('div');
  orderDate.style.fontSize = '10px';
  orderDate.style.color = '#666666';
  orderDate.style.marginBottom = '4mm';
  const dateTimeLocale = locale === 'de' ? 'de-DE' : 'en-GB';
  const formattedDateTime = new Date(transaction.createdAt).toLocaleString(dateTimeLocale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  orderDate.textContent = formattedDateTime.replace(',', locale === 'de' ? ' um' : ' at');
  orderSection.appendChild(orderDate);

  // Order Items Table
  const orderType = transaction.content.type;
  const tableWrapper = document.createElement('div');
  tableWrapper.style.width = '100%';

  // Helper to create table row
  const createOrderRow = (
    type: string,
    description: string,
    pricePerUnit: string,
    quantity: string,
    total: string,
    isHeader = false
  ) => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.width = '100%';
    row.style.padding = '3mm 0';
    row.style.borderBottom = isHeader ? '0.3px solid #e0e0e0' : '0.3px solid #e0e0e0';

    const createCell = (text: string, width: string, align: 'left' | 'center' | 'right' = 'left') => {
      const cell = document.createElement('div');
      cell.textContent = text;
      cell.style.width = width;
      cell.style.fontSize = isHeader ? '9px' : '9px';
      cell.style.fontWeight = isHeader ? '600' : '400';
      cell.style.color = isHeader ? '#000000' : align === 'left' ? '#000000' : '#666666';
      cell.style.textAlign = align;
      cell.style.paddingRight = '2mm';
      cell.style.lineHeight = '1.3';
      cell.style.overflowWrap = 'break-word';
      return cell;
    };

    row.appendChild(createCell(type, '20%', 'left'));
    row.appendChild(createCell(description, '35%', 'left'));
    row.appendChild(createCell(pricePerUnit, '20%', 'right'));
    row.appendChild(createCell(quantity, '10%', 'center'));
    row.appendChild(createCell(total, '15%', 'right'));

    return row;
  };

  // Add table header
  const headerRow = createOrderRow(t.type, t.description, t.pricePerUnit, t.units, t.total, true);
  tableWrapper.appendChild(headerRow);

  // Add order items based on type
  let grandTotal = 0;

  if (orderType === 'course') {
    const course = transaction.content.course;
    const price = transaction.content.unitPrice;
    if (course) {
      tableWrapper.appendChild(
        createOrderRow(
          t.course,
          course.title,
          `${formatPrice(price)} ${transaction.currency}`,
          '1',
          `${formatPrice(price)} ${transaction.currency}`,
          false
        )
      );
      grandTotal = price;
    }
  } else if (orderType === 'coachingOffers') {
    transaction.content.items?.forEach((item) => {
      const itemTotal = item.unitPrice * item.quantity;
      tableWrapper.appendChild(
        createOrderRow(
          t.coachingSession,
          `${item.title} (${item.duration})`,
          `${formatPrice(item.unitPrice)} ${transaction.currency}`,
          String(item.quantity),
          `${formatPrice(itemTotal)} ${transaction.currency}`,
          false
        )
      );
      grandTotal += itemTotal;
    });
  } else if (orderType === 'package') {
    const pkg = transaction.content.package;
    const price = transaction.content.unitPrice;
    if (pkg) {
      tableWrapper.appendChild(
        createOrderRow(
          t.package,
          pkg.title,
          `${formatPrice(price)} ${transaction.currency}`,
          '1',
          `${formatPrice(price)} ${transaction.currency}`,
          false
        )
      );
      grandTotal = price;
    }
  }

  orderSection.appendChild(tableWrapper);
  wrapper.appendChild(orderSection);

  // Coupon Section (if coupon was applied)
  if (transaction.coupon) {
    const couponSection = document.createElement('div');
    couponSection.style.marginTop = '5mm';
    couponSection.style.padding = '3mm';
    couponSection.style.backgroundColor = '#f5f5f5';
    couponSection.style.borderRadius = '4px';
    couponSection.style.display = 'flex';
    couponSection.style.justifyContent = 'space-between';
    couponSection.style.alignItems = 'center';

    const couponLabel = document.createElement('span');
    couponLabel.textContent = t.coupon;
    couponLabel.style.fontSize = '10px';
    couponLabel.style.color = '#666666';
    couponSection.appendChild(couponLabel);

    const couponValue = document.createElement('span');
    const discountText = transaction.coupon.discountPercentage
      ? `${transaction.coupon.name} (-${transaction.coupon.discountPercentage}%)`
      : transaction.coupon.name;
    couponValue.textContent = discountText;
    couponValue.style.fontSize = '10px';
    couponValue.style.fontWeight = '600';
    couponValue.style.color = '#2e7d32';
    couponSection.appendChild(couponValue);

    wrapper.appendChild(couponSection);
  }

  // Total Section
  const totalSection = document.createElement('div');
  totalSection.style.marginTop = '5mm';
  totalSection.style.paddingTop = '3mm';

  const totalRow = document.createElement('div');
  totalRow.style.display = 'flex';
  totalRow.style.justifyContent = 'flex-end';
  totalRow.style.alignItems = 'center';
  totalRow.style.gap = '5mm';

  const totalLabel = document.createElement('span');
  totalLabel.textContent = t.totalLabel;
  totalLabel.style.fontSize = '12px';
  totalLabel.style.fontWeight = '600';
  totalLabel.style.color = '#000000';

  const totalValue = document.createElement('span');
  totalValue.textContent = `${formatPrice(grandTotal)} ${transaction.currency}`;
  totalValue.style.fontSize = '14px';
  totalValue.style.fontWeight = '700';
  totalValue.style.color = '#000000';

  totalRow.appendChild(totalLabel);
  totalRow.appendChild(totalValue);
  totalSection.appendChild(totalRow);
  wrapper.appendChild(totalSection);

  // Footer with company info
  const footer = document.createElement('div');
  footer.style.display = 'flex';
  footer.style.flexDirection = 'column';
  footer.style.alignItems = 'center';
  footer.style.marginTop = '15mm';
  footer.style.paddingTop = '5mm';

  if (platformData.logoUrl) {
    const footerLogo = document.createElement('img');
    footerLogo.src = platformData.logoUrl;
    footerLogo.style.width = '25px';
    footerLogo.style.height = '25px';
    footerLogo.style.objectFit = 'contain';
    footerLogo.style.marginBottom = '3mm';
    footer.appendChild(footerLogo);
  }

  const footerText = document.createElement('div');
  footerText.textContent = `${platformData.companyName}, ${platformData.companyAddress}, ${platformData.companyUid}`;
  footerText.style.fontSize = '8px';
  footerText.style.color = '#999999';
  footerText.style.textAlign = 'center';
  footerText.style.lineHeight = '1.4';
  footer.appendChild(footerText);

  wrapper.appendChild(footer);

  // Generate PDF
  const pdfOptions = {
    margin: 0,
    filename: `invoice-${transaction.id}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff',
      logging: false,
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4' as const,
      orientation: 'portrait' as const,
    },
  };

  await html2pdf().set(pdfOptions).from(wrapper).save();
}
