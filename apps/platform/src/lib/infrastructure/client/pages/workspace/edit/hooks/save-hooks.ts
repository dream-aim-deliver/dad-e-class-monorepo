import { useState, useEffect, useCallback } from 'react';
import { trpc } from '../../../../trpc/client';
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
import { set } from 'zod';

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
        if (
            saveCourseStructureMutation.isSuccess &&
            saveCourseStructureViewModel?.mode === 'conflict'
        ) {
            setErrorMessage(
                `The course has been updated by another user. Please refresh the page to see the latest changes or click save to overwrite them.`,
            );
            // @ts-expect-error The factory doesn't provide proper typing for custom errors
            setCourseVersion(saveCourseStructureViewModel.data.courseVersion);
        }
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

    const saveCourseStructure = useCallback(async () => {
        if (courseVersion === null) {
            setErrorMessage('Course slug or version is not set');
            return;
        }

        setErrorMessage(null);

        try {
            const result = await saveCourseStructureMutation.mutateAsync({
                courseSlug: slug,
                courseVersion: courseVersion,
                modules: getRequestFromModules(modules),
            });

            return result;
        } catch (error) {
            // TODO: Handle custom error types with localization
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred while saving the course';
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

// TODO: Translate error messages
export function useSaveLesson({
    lessonId,
    courseVersion,
    setCourseVersion,
    errorMessage,
    setErrorMessage,
}: SaveLessonProps) {
    const [components, setComponents] = useState<LessonElement[]>([]);

    const saveLessonMutation = trpc.saveLessonComponents.useMutation();
    const [saveLessonViewModel, setSaveLessonViewModel] =
        useState<viewModels.TSaveLessonComponentsViewModel | undefined>(
            undefined,
        );

    const { presenter: saveLessonPresenter } =
        useSaveLessonComponentsPresenter(setSaveLessonViewModel);

    useEffect(() => {
        if (saveLessonMutation.isSuccess) {
            saveLessonPresenter.present(
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
                saveLessonViewModel.data.components
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
                `The courselesson has been updated by another user. Please refresh the page to see the latest changes or click save to overwrite them.`,
            );
            // @ts-expect-error The factory doesn't provide proper typing for custom errors
            setCourseVersion(saveLessonViewModel.data.courseVersion);
        }
    }, [saveLessonViewModel, saveLessonMutation.isSuccess]);

    useEffect(() => {
        if (saveLessonMutation.isError) {
            setErrorMessage(
                saveLessonMutation.error?.message ||
                'Failed to save lesson',
            );
        }
    }, [
        saveLessonMutation.isError,
        saveLessonMutation.error,
    ]);

    const saveLesson = useCallback(async () => {
        if (courseVersion === null) {
            setErrorMessage('Course slug or version is not set');
            return;
        }

        setErrorMessage(null);

        try {
            const result = await saveLessonMutation.mutateAsync({
                lessonId: lessonId,
                courseVersion: courseVersion,
                components: [],
            });

            return result;
        } catch (error) {
            // TODO: Handle custom error types with localization
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred while saving the lesson';
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