import type { ModuleSummary } from '../components/course-certificate';

export function paginateModules(
  modules: ModuleSummary[],
  maxModulesPerPage = 3
): ModuleSummary[][] {
  const pages: ModuleSummary[][] = [];
  for (let i = 0; i < modules.length; i += maxModulesPerPage) {
    pages.push(modules.slice(i, i + maxModulesPerPage));
  }
  return pages;
}
