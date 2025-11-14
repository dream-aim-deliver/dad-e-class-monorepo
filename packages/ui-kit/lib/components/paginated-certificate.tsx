'use client';

import { useRef, forwardRef, useImperativeHandle } from 'react';
import {
  CourseCertificate,
  CourseCertificateProps,
} from '../components/course-certificate';
import { paginateModules } from '../utils/paginate-modules';

export interface PaginatedCertificateHandle {
  getElement: () => HTMLDivElement | null;
}

type PaginatedCertificateProps = CourseCertificateProps;

export const PaginatedCertificate = forwardRef<
  PaginatedCertificateHandle,
  PaginatedCertificateProps
>((props, ref) => {
  const { courseSummary, courseDescription, ...rest } = props;
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const pages = paginateModules(courseSummary, 4); // 4 modules per page
  const totalPages = pages.length || 1;

  // Expose DOM reference to parent
  useImperativeHandle(ref, () => ({
    getElement: () => wrapperRef.current,
  }));

  return (
    <div ref={wrapperRef} id="certificate-multipage">
      {pages.map((pageModules, index) => (
        <div
          key={index}
          className="page-break flex flex-col items-center"
        >
          <CourseCertificate
            {...rest}
            courseDescription={courseDescription}
            courseSummary={pageModules}
            paginationLabel={`Pag. ${index + 1}/${totalPages}`}
            showCourseDescription={index === 0}
          />
        </div>
      ))}
    </div>
  );
});

PaginatedCertificate.displayName = 'PaginatedCertificate';
