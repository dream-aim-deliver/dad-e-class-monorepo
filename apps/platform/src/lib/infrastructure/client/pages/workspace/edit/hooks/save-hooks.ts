import { useState, useEffect, useCallback } from 'react';
import { trpc } from '../../../../trpc/cms-client';
import { viewModels } from '@maany_shr/e-class-models';
import { useSaveCourseStructurePresenter } from '../../../../hooks/use-save-course-structure-presenter';
import {
    getModulesFromResponse,
    getRequestFromModules,
} from '../utils/transform-modules';
import { CourseModule } from '../types';
import { useSaveLessonComponentsPresenter } from '../../../../hooks/use-save-lesson-components-presenter';
import { LessonElement } from '@maany_shr/e-class-ui-kit';
import { transformLessonComponents } from '../../../../utils/transform-lesson-components';
import { transformLessonToRequest } from '../utils/lesson-to-request';
import { useTranslations } from 'next-intl';

interface SaveStructureProps {
    slug: string;
    courseVersion: number | null;
    setCourseVersion: (version: number | null) => void;
    errorMessage: string | null;
    setErrorMessage: (message: string | null) => void;
}

export function useSaveStructure({
    slug,
    courseVersion,
    setCourseVersion,
    errorMessage,
    setErrorMessage,
}: SaveStructureProps) {
    const saveTranslations = useTranslations('components.saveHooks');

    const [modules, setModules] = useState<CourseModule[]>([]);

    const utils = trpc.useUtils();

    const saveCourseStructureMutation = trpc.saveCourseStructure.useMutation({
        onSuccess: () => {
            // Invalidate related queries to refetch fresh data
            utils.getCourseStructure.invalidate({ courseSlug: slug });
            utils.listUserCourses.invalidate();
        },
    });
    const [saveCourseStructureViewModel, setSaveCourseStructureViewModel] =
        useState<viewModels.TSaveCourseStructureViewModel | undefined>(
            undefined,
        );

    const { presenter: saveCourseStructurePresenter } =
        useSaveCourseStructurePresenter(setSaveCourseStructureViewModel);

    useEffect(() => {
        if (saveCourseStructureMutation.isSuccess) {
            saveCourseStructurePresenter.present(
                // @ts-ignore
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
        if (
            saveCourseStructureMutation.isSuccess &&
            saveCourseStructureViewModel?.mode === 'conflict'
        ) {
            setErrorMessage(
                saveTranslations('courseUpdateError'),
            );
            setCourseVersion(saveCourseStructureViewModel.data.courseVersion);
        }
    }, [saveCourseStructureViewModel, saveCourseStructureMutation.isSuccess]);

    useEffect(() => {
        if (saveCourseStructureMutation.isError) {
            setErrorMessage(
                saveCourseStructureMutation.error?.message ||
                saveTranslations('failToSaveCourseError'),
            );
        }
    }, [
        saveCourseStructureMutation.isError,
        saveCourseStructureMutation.error,
    ]);

    const saveCourseStructure = useCallback(async () => {
        if (courseVersion === null) {
            setErrorMessage(saveTranslations('courseSlugOrVersionError'));
            return;
        }

        setErrorMessage(null);

        try {
            const result = await saveCourseStructureMutation.mutateAsync({
                courseSlug: slug,
                courseVersion: courseVersion,
                modules: getRequestFromModules(modules),
            });

            return result.success;
        } catch (error) {
            // TODO: Handle custom error types with localization
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : saveTranslations('unknownCourseError');
            setErrorMessage(errorMessage);
            throw error;
        }
    }, [courseVersion, modules, saveCourseStructureMutation, slug]);

    return {
        modules,
        setModules,
        saveCourseStructure,
        isSavingCourseStructure: saveCourseStructureMutation.isPending,
    };
}

interface SaveLessonProps {
    lessonId: number;
    courseVersion: number | null;
    setCourseVersion: (version: number | null) => void;
    errorMessage: string | null;
    setErrorMessage: (message: string | null) => void;
}

export function useSaveLesson({
    lessonId,
    courseVersion,
    setCourseVersion,
    errorMessage,
    setErrorMessage,
}: SaveLessonProps) {
    const saveTranslations = useTranslations('components.saveHooks');

    const [components, setComponents] = useState<LessonElement[]>([]);

    const utils = trpc.useUtils();

    const saveLessonMutation = trpc.saveLessonComponents.useMutation({
        onSuccess: () => {
            // Invalidate lesson components query to refetch fresh data
            utils.listLessonComponents.invalidate({ lessonId });
            // Invalidate course-level queries (partial invalidation without courseSlug)
            // Note: This invalidates all course structures - less precise but works without courseSlug
            utils.getCourseStructure.invalidate();
        },
    });
    const [saveLessonViewModel, setSaveLessonViewModel] = useState<
        viewModels.TSaveLessonComponentsViewModel | undefined
    >(undefined);

    const { presenter: saveLessonPresenter } = useSaveLessonComponentsPresenter(
        setSaveLessonViewModel,
    );

    useEffect(() => {
        if (saveLessonMutation.isSuccess) {
            saveLessonPresenter.present(
                // @ts-ignore
                saveLessonMutation.data,
                saveLessonViewModel,
            );
        }
    }, [saveLessonMutation]);

    useEffect(() => {
        if (
            saveLessonMutation.isSuccess &&
            saveLessonViewModel?.mode === 'default'
        ) {
            const transformedComponents = transformLessonComponents(
                saveLessonViewModel.data.components,
            );
            setComponents(transformedComponents);
            setCourseVersion(saveLessonViewModel.data.courseVersion);
            setErrorMessage(null);
        }
        if (
            saveLessonMutation.isSuccess &&
            saveLessonViewModel?.mode === 'conflict'
        ) {
            setErrorMessage(
                saveTranslations('courseLessonUpdateError'),
            );
            setCourseVersion(saveLessonViewModel.data.courseVersion);
        }
    }, [saveLessonViewModel, saveLessonMutation.isSuccess]);

    useEffect(() => {
        if (saveLessonMutation.isError) {
            setErrorMessage(
                saveLessonMutation.error?.message || saveTranslations('failToSaveLessonError'),
            );
        }
    }, [saveLessonMutation.isError, saveLessonMutation.error]);

    const saveLesson = useCallback(async () => {
        if (courseVersion === null) {
            setErrorMessage(saveTranslations('courseSlugOrVersionError'));
            return;
        }

        setErrorMessage(null);

        try {
            const requestComponents = transformLessonToRequest(components);
            const request = {
                lessonId: lessonId,
                courseVersion: courseVersion,
                components: requestComponents,
            }
            const result = await saveLessonMutation.mutateAsync(request);

            return result.success;
        } catch (error) {
            // TODO: Handle custom error types with localization
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : saveTranslations('unknownLessonError');
            setErrorMessage(errorMessage);
            throw error;
        }
    }, [courseVersion, components, saveLessonMutation, lessonId]);

    return {
        components,
        setComponents,
        saveLesson,
        isSaving: saveLessonMutation.isPending,
    };
}
