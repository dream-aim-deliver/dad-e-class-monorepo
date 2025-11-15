/**
 * Course Notes PDF Generator Utility
 *
 * Generates professional A4 course notes PDFs from student notes data.
 * Can be used across the application for consistent notes PDF generation.
 */

import type { TLocale } from '@maany_shr/e-class-translations';

export interface CourseNotesLesson {
  title: string;
  position: number;
  notes: string;
  id: string;
}

export interface CourseNotesModule {
  title: string;
  position: number;
  lessonCount: number;
  lessons: CourseNotesLesson[];
  id: string;
}

export interface CourseNotesData {
  modules: CourseNotesModule[];
  moduleCount: number;
}

export interface GenerateCourseNotesPdfOptions {
  courseSlug: string;
  courseTitle?: string;
  data: CourseNotesData;
  locale: TLocale;
  translations: {
    yourNotes: string;
    module: string;
    lesson: string;
    noNotesAvailable: string;
  };
  platformData?: {
    name?: string;
    logoUrl?: string | null;
  };
}

/**
 * Validates the structure of parsed notes to ensure it's safe
 */
function validateNotesStructure(notes: unknown): notes is Array<any> {
  if (!Array.isArray(notes)) {
    return false;
  }

  // Basic validation - ensure all elements are objects with a type property
  return notes.every(node =>
    typeof node === 'object' &&
    node !== null &&
    'type' in node
  );
}

/**
 * Sanitizes URLs to prevent XSS attacks
 */
function sanitizeUrl(url: string | undefined): string {
  if (!url) return '#';

  try {
    const parsed = new URL(url);
    // Only allow http, https, and mailto protocols
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol) ? url : '#';
  } catch {
    // If URL parsing fails, return safe default
    return '#';
  }
}

/**
 * Parses rich text JSON notes and renders them with proper formatting
 */
function renderRichTextContent(notes: string, contentDiv: HTMLElement): void {
  try {
    const parsedNotes = JSON.parse(notes);

    if (!validateNotesStructure(parsedNotes)) {
      contentDiv.textContent = notes;
      return;
    }

    parsedNotes.forEach((node: any) => {
      if (node.type === 'paragraph' && node.children) {
        const p = document.createElement('p');
        p.style.margin = '0 0 8px 0';
        p.style.padding = '0';
        p.style.color = '#000000';
        p.style.lineHeight = '1.6';

        node.children.forEach((child: any) => {
          if (child.text !== undefined) {
            const span = document.createElement('span');
            span.textContent = child.text;
            span.style.color = '#000000';
            if (child.bold) span.style.fontWeight = '700';
            if (child.italic) span.style.fontStyle = 'italic';
            if (child.underline) span.style.textDecoration = 'underline';
            if (child.code) {
              span.style.fontFamily = 'Monaco, Courier, monospace';
              span.style.backgroundColor = '#f3f4f6';
              span.style.padding = '2px 6px';
              span.style.borderRadius = '3px';
              span.style.fontSize = '0.9em';
            }
            p.appendChild(span);
          }
        });
        contentDiv.appendChild(p);
      } else if (node.type === 'bulleted-list' || node.type === 'unordered-list') {
        const ul = document.createElement('ul');
        ul.style.listStyleType = 'disc';
        ul.style.listStylePosition = 'outside';
        ul.style.paddingLeft = '20px';
        ul.style.marginLeft = '0';
        ul.style.margin = '8px 0';
        ul.style.color = '#000000';

        if (node.children) {
          node.children.forEach((listItem: any) => {
            if (listItem.type === 'list-item') {
              const li = document.createElement('li');
              li.style.margin = '2px 0';
              li.style.paddingLeft = '4px';
              li.style.color = '#000000';
              li.style.lineHeight = '1.6';

              if (listItem.children) {
                listItem.children.forEach((child: any) => {
                  if (child.text !== undefined) {
                    const span = document.createElement('span');
                    span.textContent = child.text;
                    span.style.color = '#000000';
                    if (child.bold) span.style.fontWeight = '700';
                    if (child.italic) span.style.fontStyle = 'italic';
                    li.appendChild(span);
                  }
                });
              }
              ul.appendChild(li);
            }
          });
        }
        contentDiv.appendChild(ul);
      } else if (node.type === 'numbered-list' || node.type === 'ordered-list') {
        const ol = document.createElement('ol');
        ol.style.listStyleType = 'decimal';
        ol.style.listStylePosition = 'outside';
        ol.style.paddingLeft = '20px';
        ol.style.marginLeft = '0';
        ol.style.margin = '8px 0';
        ol.style.color = '#000000';

        if (node.children) {
          node.children.forEach((listItem: any) => {
            if (listItem.type === 'list-item') {
              const li = document.createElement('li');
              li.style.margin = '2px 0';
              li.style.paddingLeft = '4px';
              li.style.color = '#000000';
              li.style.lineHeight = '1.6';

              if (listItem.children) {
                listItem.children.forEach((child: any) => {
                  if (child.text !== undefined) {
                    const span = document.createElement('span');
                    span.textContent = child.text;
                    span.style.color = '#000000';
                    if (child.bold) span.style.fontWeight = '700';
                    if (child.italic) span.style.fontStyle = 'italic';
                    li.appendChild(span);
                  }
                });
              }
              ol.appendChild(li);
            }
          });
        }
        contentDiv.appendChild(ol);
      } else if (node.type === 'link') {
        const a = document.createElement('a');
        // Sanitize URL to prevent XSS attacks
        a.href = sanitizeUrl(node.url);
        a.textContent = node.children?.[0]?.text || sanitizeUrl(node.url);
        a.style.color = '#2563eb';
        a.style.textDecoration = 'underline';
        a.style.margin = '0 0 8px 0';
        a.style.display = 'block';
        contentDiv.appendChild(a);
      } else if (node.type === 'block-quote') {
        const blockquote = document.createElement('blockquote');
        blockquote.style.borderLeft = '4px solid #d1d5db';
        blockquote.style.paddingLeft = '16px';
        blockquote.style.fontStyle = 'italic';
        blockquote.style.margin = '0 0 8px 0';
        blockquote.style.color = '#374151';

        if (node.children) {
          node.children.forEach((child: any) => {
            if (child.text !== undefined) {
              blockquote.textContent += child.text;
            }
          });
        }
        contentDiv.appendChild(blockquote);
      } else if (node.type?.startsWith('h') && /^h[1-6]$/.test(node.type)) {
        const heading = document.createElement(node.type);
        heading.style.fontWeight = '700';
        heading.style.margin = '12px 0 8px 0';
        heading.style.color = '#000000';

        const fontSizeMap: Record<string, string> = {
          h1: '20px',
          h2: '18px',
          h3: '16px',
          h4: '14px',
          h5: '12px',
          h6: '11px',
        };
        heading.style.fontSize = fontSizeMap[node.type] || '14px';

        if (node.children) {
          node.children.forEach((child: any) => {
            if (child.text !== undefined) {
              heading.textContent += child.text;
            }
          });
        }
        contentDiv.appendChild(heading);
      }
    });
  } catch (error) {
    // If parsing fails, show as plain text
    contentDiv.textContent = notes;
    contentDiv.style.color = '#000000';
  }
}

/**
 * Generates and downloads a course notes PDF
 */
export async function generateCourseNotesPdf(options: GenerateCourseNotesPdfOptions): Promise<void> {
  const { courseSlug, courseTitle, data, locale, translations: t, platformData } = options;

  // Dynamically import html2pdf only when needed (client-side only)
  const html2pdf = (await import('html2pdf.js')).default;

  // Wait for rendering to complete
  await new Promise(resolve => setTimeout(resolve, 100));

  // Create wrapper with A4 dimensions and professional styling
  const wrapper = document.createElement('div');
  wrapper.style.width = '210mm';
  wrapper.style.margin = '0';
  wrapper.style.padding = '20mm';
  wrapper.style.backgroundColor = '#ffffff';
  wrapper.style.color = '#000000';
  wrapper.style.fontFamily = '"Figtree", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  wrapper.style.lineHeight = '1.6';
  wrapper.style.boxSizing = 'border-box';

  // Header with logo and title
  const headerSection = document.createElement('div');
  headerSection.style.display = 'flex';
  headerSection.style.alignItems = 'center';
  headerSection.style.justifyContent = 'space-between';
  headerSection.style.marginBottom = '15mm';
  headerSection.style.paddingBottom = '8mm';
  headerSection.style.borderBottom = '2px solid #f59e0b';

  const headerLeft = document.createElement('div');
  headerLeft.style.display = 'flex';
  headerLeft.style.alignItems = 'center';
  headerLeft.style.gap = '10px';

  if (platformData?.logoUrl) {
    const logo = document.createElement('img');
    logo.src = platformData.logoUrl;
    logo.style.width = '40px';
    logo.style.height = '40px';
    logo.style.objectFit = 'contain';
    headerLeft.appendChild(logo);
  }

  const header = document.createElement('h1');
  header.textContent = t.yourNotes;
  header.style.fontSize = '24px';
  header.style.fontWeight = '700';
  header.style.margin = '0';
  header.style.color = '#000000';
  headerLeft.appendChild(header);

  headerSection.appendChild(headerLeft);

  if (courseTitle) {
    const courseTitleDiv = document.createElement('div');
    courseTitleDiv.textContent = courseTitle;
    courseTitleDiv.style.fontSize = '12px';
    courseTitleDiv.style.color = '#6b7280';
    courseTitleDiv.style.fontWeight = '500';
    courseTitleDiv.style.maxWidth = '40%';
    courseTitleDiv.style.textAlign = 'right';
    headerSection.appendChild(courseTitleDiv);
  }

  wrapper.appendChild(headerSection);

  // Process modules and lessons
  const modulesContainer = document.createElement('div');
  modulesContainer.style.display = 'flex';
  modulesContainer.style.flexDirection = 'column';
  modulesContainer.style.gap = '8mm';

  const modules = data.modules;
  modules.forEach((module, moduleIndex) => {
    const moduleDiv = document.createElement('div');
    moduleDiv.style.pageBreakInside = 'avoid';
    moduleDiv.style.breakInside = 'avoid';

    // Module title with accent
    const moduleTitle = document.createElement('h2');
    moduleTitle.textContent = `${t.module} ${module.position} - ${module.title}`;
    moduleTitle.style.fontSize = '18px';
    moduleTitle.style.fontWeight = '700';
    moduleTitle.style.color = '#000000';
    moduleTitle.style.margin = '0 0 6mm 0';
    moduleTitle.style.paddingLeft = '12px';
    moduleTitle.style.paddingBottom = '4mm';
    moduleTitle.style.borderLeft = '4px solid #f59e0b';
    moduleTitle.style.borderBottom = '1px solid #e5e7eb';
    moduleDiv.appendChild(moduleTitle);

    // Process lessons
    module.lessons.forEach((lesson, lessonIndex) => {
      const lessonDiv = document.createElement('div');
      lessonDiv.style.marginBottom = '6mm';
      lessonDiv.style.marginLeft = '0';
      lessonDiv.style.paddingLeft = '12px';
      lessonDiv.style.pageBreakInside = 'avoid';
      lessonDiv.style.breakInside = 'avoid';

      // Calculate lesson number
      const lessonNumber = modules
        .slice(0, moduleIndex)
        .reduce((sum, mod) => sum + mod.lessonCount, 0) + lesson.position;

      // Lesson title
      const lessonTitle = document.createElement('h3');
      lessonTitle.textContent = `${t.lesson} ${lessonNumber} - ${lesson.title}`;
      lessonTitle.style.fontSize = '14px';
      lessonTitle.style.fontWeight = '600';
      lessonTitle.style.color = '#111827';
      lessonTitle.style.marginBottom = '3mm';
      lessonTitle.style.marginTop = '0';
      lessonDiv.appendChild(lessonTitle);

      // Lesson content
      const contentDiv = document.createElement('div');
      contentDiv.style.fontSize = '11px';
      contentDiv.style.color = '#1f2937';
      contentDiv.style.lineHeight = '1.7';
      contentDiv.style.marginLeft = '0';
      contentDiv.style.paddingLeft = '0';
      contentDiv.style.borderLeft = 'none';

      if (lesson.notes && lesson.notes.trim()) {
        // Parse and render rich text content
        renderRichTextContent(lesson.notes, contentDiv);
      } else {
        const noNotesText = document.createElement('p');
        noNotesText.textContent = t.noNotesAvailable;
        noNotesText.style.fontStyle = 'italic';
        noNotesText.style.color = '#9ca3af';
        noNotesText.style.margin = '0';
        contentDiv.appendChild(noNotesText);
      }

      lessonDiv.appendChild(contentDiv);
      moduleDiv.appendChild(lessonDiv);
    });

    modulesContainer.appendChild(moduleDiv);
  });

  wrapper.appendChild(modulesContainer);

  // Generate PDF with optimized settings for performance and quality
  const pdfOptions = {
    margin: 0,
    filename: `course-notes-${courseSlug}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      // Use adaptive scaling based on device pixel ratio to reduce memory usage
      scale: window.devicePixelRatio || 1,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff',
      logging: false,
      // Optimize for PDF rendering
      onclone: (clonedDoc: Document) => {
        // Ensure all elements are visible for PDF rendering
        const clonedWrapper = clonedDoc.querySelector('[style*="width: 210mm"]');
        if (clonedWrapper instanceof HTMLElement) {
          clonedWrapper.style.display = 'block';
        }
      }
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4' as const,
      orientation: 'portrait' as const,
    },
    pagebreak: {
      mode: ['css', 'legacy'] as any,
      // Avoid breaking headings and maintain readability
      avoid: ['h2', 'h3']
    }
  };

  await html2pdf().set(pdfOptions).from(wrapper).save();
}
