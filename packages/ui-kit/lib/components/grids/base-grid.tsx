'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/style-utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { GridReadyEvent } from 'ag-grid-community';
import GridSkeleton from '../skeletons/grid-skeleton';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';

export interface BaseTableProps extends AgGridReactProps {
  gridRef: RefObject<AgGridReact | null>;
  shouldDelayRender?: boolean;
  locale: TLocale;
  noRowsMessage?: string;
}

/**
 * A component for flexible and responsive pagination of the table
 */
export const SimplePaginationPanel = (props: {
  currentPageRef: RefObject<HTMLSpanElement | null>;
  totalPagesRef: RefObject<HTMLSpanElement | null>;
  previousPageRef: RefObject<HTMLButtonElement | null>;
  nextPageRef: RefObject<HTMLButtonElement | null>;
  lastPageRef: RefObject<HTMLButtonElement | null>;
  firstPageRef: RefObject<HTMLButtonElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  pageLabel: string;
  ofLabel: string;
}) => {
  const enabledTextClasses = 'text-neutral-50';
  const disabledTextClasses = 'disabled:text-neutral-500';
  const buttonClasses = cn('text-l cursor-pointer', 'px-1', enabledTextClasses, disabledTextClasses);
  const iconClasses = 'h-5 w-5';

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        enabledTextClasses,
        'py-4 !m-0',
        'bg-base-neutral-100',
        'rounded-b-md'
      )}
    >
      <div className="flex justify-center invisible items-center" ref={props.containerRef}>
        <button disabled={true} ref={props.firstPageRef} className={buttonClasses}>
          <ChevronsLeft className={iconClasses} />
        </button>
        <button disabled={true} ref={props.previousPageRef} className={buttonClasses}>
          <ChevronLeft className={iconClasses} />
        </button>
        <span className="px-3 text-sm">
          {props.pageLabel} <span ref={props.currentPageRef}>0</span> {props.ofLabel} <span ref={props.totalPagesRef}>0</span>
        </span>
        <button disabled={true} ref={props.nextPageRef} className={buttonClasses}>
          <ChevronRight className={iconClasses} />
        </button>
        <button disabled={true} ref={props.lastPageRef} className={buttonClasses}>
          <ChevronsRight className={iconClasses} />
        </button>
      </div>
    </div>
  );
};

export const BaseGrid = ({ gridRef, shouldDelayRender, locale, noRowsMessage, ...props }: BaseTableProps) => {
  const currentPageRef = useRef<HTMLSpanElement>(null);
  const totalPagesRef = useRef<HTMLSpanElement>(null);
  const previousPageRef = useRef<HTMLButtonElement>(null);
  const nextPageRef = useRef<HTMLButtonElement>(null);
  const firstPageRef = useRef<HTMLButtonElement>(null);
  const lastPageRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* This is implemented to counteract a bug in ag-grid of flickering with autoHeight.
  https://stackoverflow.com/questions/73560068/ag-grid-autoheight-true-coldef-property-on-cell-renderer-causes-stutter
   */
  const [isRenderDelayed, setIsRenderDelayed] = useState<boolean>(false);
  const isRenderDelayedTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const delayRender = () => {
    if (!shouldDelayRender) return;

    clearTimeout(isRenderDelayedTimeout.current);
    setIsRenderDelayed(true);
    isRenderDelayedTimeout.current = setTimeout(() => {
      setIsRenderDelayed(false);
    }, 500);
  };

  const onNextPage = () => {
    const gridApi = gridRef.current?.api;
    gridApi?.paginationGoToNextPage();
  };

  const onPreviousPage = () => {
    const gridApi = gridRef.current?.api;
    gridApi?.paginationGoToPreviousPage();
  };

  const onFirstPage = () => {
    const gridApi = gridRef.current?.api;
    gridApi?.paginationGoToFirstPage();
  };

  const onLastPage = () => {
    const gridApi = gridRef.current?.api;
    gridApi?.paginationGoToLastPage();
  };

  const onPaginationChanged = () => {
    const gridApi = gridRef.current?.api;
    // Make sure the table is loaded before updating the pagination component to avoid flickering
    if (isTableLoaded && gridApi) {
      const totalPages = gridApi.paginationGetTotalPages();
      totalPagesRef.current!.textContent = totalPages.toString();
      // Ensure visibility of the pagination panel only after some data is loaded
      containerRef.current!.style.visibility = totalPages === 0 ? 'hidden' : 'visible';

      // Pages are zero based, hence the +1
      const currentPage = gridApi.paginationGetCurrentPage() + 1;
      currentPageRef.current!.textContent = currentPage.toString();

      previousPageRef.current!.disabled = currentPage === 1;
      firstPageRef.current!.disabled = currentPage === 1;
      previousPageRef.current!.onclick = onPreviousPage;
      firstPageRef.current!.onclick = onFirstPage;

      nextPageRef.current!.disabled = currentPage === totalPages;
      lastPageRef.current!.disabled = currentPage === totalPages;
      nextPageRef.current!.onclick = onNextPage;
      lastPageRef.current!.onclick = onLastPage;
    }
  };

  const dictionary = getDictionary(locale).components.baseGrid;

  // Whether the table component is ready to be displayed
  const [isTableLoaded, setIsTableLoaded] = useState<boolean>(false);

  const onGridReady = (event: GridReadyEvent) => {
    setIsTableLoaded(true);
    delayRender();
    if (props.onGridReady) {
      props.onGridReady(event);
    }
  };

  useEffect(() => {
    onPaginationChanged();
  }, [isTableLoaded]);

  const isSkeletonVisible = !isTableLoaded || isRenderDelayed;

  /* loadingOverlayComponent is shown when the loading hasn't begun yet,
      whereas noRowsOverlayComponent is shown when the loading has started without data transactions */
  return (
    <>
      <div className={cn('grid grow w-full', 'relative', 'min-h-[300px]')}>
        {isSkeletonVisible && <GridSkeleton />}
        {/*The substitute div is required to supress hydration warning*/}
        <AgGridReact
          {...props}
          ref={gridRef}
          onGridReady={onGridReady}
          onPaginationChanged={onPaginationChanged}
          loadingOverlayComponent={() => <div>{dictionary.loading}</div>}
          noRowsOverlayComponent={() => <div>{noRowsMessage || dictionary.noRows}</div>}
        />
      </div>
      <SimplePaginationPanel
        currentPageRef={currentPageRef}
        totalPagesRef={totalPagesRef}
        nextPageRef={nextPageRef}
        previousPageRef={previousPageRef}
        containerRef={containerRef}
        firstPageRef={firstPageRef}
        lastPageRef={lastPageRef}
        pageLabel={dictionary.page}
        ofLabel={dictionary.of}
      />
    </>
  );
};
