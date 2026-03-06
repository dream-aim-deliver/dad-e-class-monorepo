import type { ModuleSummary } from '../components/course-certificate';

/**
 * Estimates the number of visual lines a module occupies in the
 * certificate right column (40% of A4 landscape).
 */
function estimateModuleLines(mod: ModuleSummary, charsPerLine: number): number {
  // Use fixed char overhead for translated prefixes (e.g. "Modul 1: ", "Lektionen: ")
  // instead of hardcoding any language
  const titleChars = 10 + mod.moduleTitle.length;
  const titleLines = Math.ceil(titleChars / charsPerLine);
  const lessonChars = 12 + mod.lessonTitles.join(' · ').length;
  const lessonLines = Math.max(1, Math.ceil(lessonChars / charsPerLine));
  return titleLines + lessonLines + 2; // +2 for spacing/divider overhead
}

interface PaginateOptions {
  maxLinesFirstPage?: number;
  maxLinesPerPage?: number;
  charsPerLine?: number;
}

/**
 * Splits course modules into pages for the certificate PDF.
 *
 * Uses content-aware estimation: each module's visual height is estimated
 * based on the length of its title and joined lesson titles. Pages are
 * filled until the estimated content exceeds the available space.
 *
 * If a single module has so many lessons that it overflows a full page,
 * the module is split across pages with "(cont.)" in the title.
 */
export function paginateModules(
  modules: ModuleSummary[],
  options?: PaginateOptions
): ModuleSummary[][] {
  const {
    maxLinesFirstPage = 16,
    maxLinesPerPage = 24,
    charsPerLine = 55,
  } = options ?? {};

  if (!modules.length) return [[]];

  const pages: ModuleSummary[][] = [];
  let currentPage: ModuleSummary[] = [];
  let currentLines = 0;
  let isFirstPage = true;
  const maxLines = () => (isFirstPage ? maxLinesFirstPage : maxLinesPerPage);

  for (const mod of modules) {
    const moduleLines = estimateModuleLines(mod, charsPerLine);

    // Edge case: single module too big for one page → split its lessons
    if (moduleLines > maxLines()) {
      // Flush current page first
      if (currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
        currentLines = 0;
        isFirstPage = false;
      }

      const titleCharsForSplit = 10 + mod.moduleTitle.length;
      const titleLines = Math.ceil(titleCharsForSplit / charsPerLine);
      const maxLessonLines = maxLines() - titleLines - 2;
      const remaining = [...mod.lessonTitles];
      let isCont = false;

      while (remaining.length > 0) {
        let charCount = 0;
        let count = 0;
        for (const lesson of remaining) {
          const sep = count > 0 ? 3 : 0; // " · " separator
          const next = charCount + sep + lesson.length;
          if (Math.ceil(next / charsPerLine) > maxLessonLines && count > 0)
            break;
          charCount = next;
          count++;
        }
        count = Math.max(1, count);
        const chunk = remaining.splice(0, count);
        pages.push([
          {
            moduleNumber: mod.moduleNumber,
            moduleTitle: isCont
              ? `${mod.moduleTitle} (cont.)`
              : mod.moduleTitle,
            lessonTitles: chunk,
          },
        ]);
        isFirstPage = false;
        isCont = true;
      }
      continue;
    }

    // Normal case: does this module fit on the current page?
    if (currentLines + moduleLines > maxLines() && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      currentLines = 0;
      isFirstPage = false;
    }

    currentPage.push(mod);
    currentLines += moduleLines;
  }

  if (currentPage.length > 0) pages.push(currentPage);
  return pages;
}
