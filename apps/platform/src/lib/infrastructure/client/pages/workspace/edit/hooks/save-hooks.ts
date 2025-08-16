import { useState, useEffect } from 'react';
import { trpc } from '../../../../trpc/client';
import { viewModels } from '@maany_shr/e-class-models';
import { useSaveCourseStructurePresenter } from '../../../../hooks/use-save-course-structure-presenter';
import { getModulesFromResponse } from '../utils/transform-modules';
import { CourseModule } from '../types';

interface SaveStructureProps {
    slug: string;
    courseVersion: number | null;
    setCourseVersion: (version: number | null) => void;
    errorMessage: string | null;
    setErrorMessage: (message: string | null) => void;
}

// TODO: Translate error messages
export function useSaveStructure({
    slug,
    courseVersion,
    setCourseVersion,
    errorMessage,
    setErrorMessage,
}: SaveStructureProps) {
    const [modules, setModules] = useState<CourseModule[]>([]);
    const saveCourseStructureMutation = trpc.saveCourseStructure.useMutation();
    const [saveCourseStructureViewModel, setSaveCourseStructureViewModel] =
        useState<viewModels.TSaveCourseStructureViewModel | undefined>(
            undefined,
        );

    const { presenter: saveCourseStructurePresenter } =
        useSaveCourseStructurePresenter(setSaveCourseStructureViewModel);

    useEffect(() => {
        if (saveCourseStructureMutation.isSuccess) {
            saveCourseStructurePresenter.present(
                saveCourseStructureMutation.data,
                saveCourseStructureViewModel,
            );
        }
    }, [saveCourseStructureMutation]);

    useEffect(() => {
        if (
            saveCourseStructureMutation.isSuccess &&
            saveCourseStructureViewModel?.mode === 'default'
        ) {
            const transformedModules = getModulesFromResponse(
                saveCourseStructureViewModel.data,
            );
            setModules(transformedModules);
            setCourseVersion(saveCourseStructureViewModel.data.courseVersion);
            setErrorMessage(null);
        }
        // TODO: Handle error modes properly
    }, [saveCourseStructureViewModel, saveCourseStructureMutation.isSuccess]);

    useEffect(() => {
        if (saveCourseStructureMutation.isError) {
            setErrorMessage(
                saveCourseStructureMutation.error?.message ||
                    'Failed to save course',
            );
        }
    }, [
        saveCourseStructureMutation.isError,
        saveCourseStructureMutation.error,
    ]);

    const saveCourseStructure = async () => {
        if (courseVersion === null) {
            setErrorMessage('Course slug or version is not set');
            return;
        }

        setErrorMessage(null);

        try {
            const result = await saveCourseStructureMutation.mutateAsync({
                courseSlug: slug,
                courseVersion: courseVersion,
                modules: [], // Transform moduleData as needed
            });

            return result;
        } catch (error) {
            setErrorMessage('Unknown error occurred while saving the course');
            throw error;
        }
    };

    return {
        modules,
        setModules,
        saveCourseStructure,
        isSavingCourseStructure: saveCourseStructureMutation.isPending,
    };
}
