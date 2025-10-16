#!/usr/bin/env python3
"""
Deterministic Presenter Scaffold Generator

Generates complete presenter layer (view-model, presenter, hook) for DAD E-Class projects.
Accepts any case format for feature names and handles imports from cms-rest properly.

Setup:
    cd tools
    python3 -m venv .venv
    .venv/bin/pip install -r requirements.txt

Usage:
    tools/.venv/bin/python3 tools/generate-presenter-scaffold.py <project> <feature-name>

    Or use the wrapper:
    ./tools/scaffold-presenter <project> <feature-name>

Arguments:
    project: 'platform' or 'cms'
    feature-name: Any casing (e.g., 'SaveHomePage', 'save-home-page', 'save_home_page')

Example:
    ./tools/scaffold-presenter cms save-home-page
    ./tools/scaffold-presenter platform GetCourseDetails
"""

import os
import sys
import re
from pathlib import Path
from typing import Tuple

# Try to use humps library for better case conversion, fallback to built-in
try:
    import humps
    HAS_HUMPS = True
except ImportError:
    HAS_HUMPS = False


def to_kebab_case(s: str) -> str:
    """Convert any case format to kebab-case using humps if available."""
    if HAS_HUMPS:
        return humps.kebabize(s)

    # Fallback: built-in conversion
    # Handle acronyms and special patterns
    s = re.sub('(.)([A-Z][a-z]+)', r'\1-\2', s)
    s = re.sub('([a-z0-9])([A-Z])', r'\1-\2', s)
    s = s.replace('_', '-')
    return s.lower()


def to_pascal_case(s: str) -> str:
    """Convert kebab-case to PascalCase using humps if available."""
    if HAS_HUMPS:
        return humps.pascalize(s)

    # Fallback: built-in conversion
    return ''.join(word.capitalize() for word in s.split('-'))


def to_camel_case(s: str) -> str:
    """Convert kebab-case to camelCase using humps if available."""
    if HAS_HUMPS:
        return humps.camelize(s)

    # Fallback: built-in conversion
    words = s.split('-')
    return words[0].lower() + ''.join(word.capitalize() for word in words[1:])


def generate_view_model(feature_kebab: str, feature_pascal: str, output_dir: Path) -> None:
    """Generate view model file with cms-rest import."""
    content = f'''import {{ z }} from 'zod';
import {{
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
}} from '@dream-aim-deliver/dad-cats';
import {{ {feature_pascal}SuccessResponseSchema }} from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const {feature_pascal}SuccessSchema = {feature_pascal}SuccessResponseSchema.shape.data;
export type T{feature_pascal}Success = z.infer<typeof {feature_pascal}SuccessSchema>;

// Define view mode schemas
const {feature_pascal}DefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    {feature_pascal}SuccessSchema
);

const {feature_pascal}KaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const {feature_pascal}NotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const {feature_pascal}ViewModelSchemaMap = {{
    default: {feature_pascal}DefaultViewModelSchema,
    kaboom: {feature_pascal}KaboomViewModelSchema,
    notFound: {feature_pascal}NotFoundViewModelSchema,
}};
export type T{feature_pascal}ViewModelSchemaMap = typeof {feature_pascal}ViewModelSchemaMap;

// Create discriminated union of all view modes
export const {feature_pascal}ViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory({feature_pascal}ViewModelSchemaMap);
export type T{feature_pascal}ViewModel = z.infer<typeof {feature_pascal}ViewModelSchema>;
'''

    file_path = output_dir / f"{feature_kebab}-view-model.ts"
    file_path.write_text(content)
    print(f"✓ Generated: {file_path}")


def generate_presenter(feature_kebab: str, feature_pascal: str, output_dir: Path) -> None:
    """Generate presenter file with cms-rest imports."""
    content = f'''import {{ viewModels }} from '@maany_shr/e-class-models';
import {{
    {feature_pascal}UseCaseResponseSchema,
    T{feature_pascal}UseCaseResponse,
    T{feature_pascal}ErrorResponse,
}} from '@dream-aim-deliver/e-class-cms-rest';
import {{
    BasePresenter,
    TBaseResponseResponseMiddleware,
    UnhandledErrorResponse
}} from '@dream-aim-deliver/dad-cats';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type T{feature_pascal}PresenterUtilities = {{}};

export const {feature_pascal}ResponseMiddleware =
    {{}} satisfies TBaseResponseResponseMiddleware<
        T{feature_pascal}UseCaseResponse,
        viewModels.T{feature_pascal}ViewModel,
        T{feature_pascal}PresenterUtilities
    >;

type T{feature_pascal}ResponseMiddleware = typeof {feature_pascal}ResponseMiddleware;

export default class {feature_pascal}Presenter extends BasePresenter<
    T{feature_pascal}UseCaseResponse,
    viewModels.T{feature_pascal}ViewModel,
    T{feature_pascal}PresenterUtilities,
    T{feature_pascal}ResponseMiddleware
> {{
    constructor(
        setViewModel: (viewModel: viewModels.T{feature_pascal}ViewModel) => void,
        viewUtilities: T{feature_pascal}PresenterUtilities,
    ) {{
        super({{
            schemas: {{
                responseModel: {feature_pascal}UseCaseResponseSchema,
                viewModel: viewModels.{feature_pascal}ViewModelSchema
            }},
            middleware: {feature_pascal}ResponseMiddleware,
            viewUtilities: viewUtilities,
            setViewModel: setViewModel
        }});
    }}

    presentSuccess(
        response: Extract<
            T{feature_pascal}UseCaseResponse,
            {{ success: true }}
        >,
    ): viewModels.T{feature_pascal}ViewModel {{
        return {{
            mode: 'default',
            data: {{
                ...response.data
            }}
        }};
    }}

    presentError(
        response: UnhandledErrorResponse<
            T{feature_pascal}ErrorResponse,
            T{feature_pascal}ResponseMiddleware
        >,
    ): viewModels.T{feature_pascal}ViewModel {{
        if (response.data.errorType === 'NotFoundError') {{
            return {{
                mode: 'not-found',
                data: {{
                    message: response.data.message,
                    operation: response.data.operation,
                    context: response.data.context
                }}
            }};
        }}
        return {{
            mode: 'kaboom',
            data: {{
                message: response.data.message,
                operation: response.data.operation,
                context: response.data.context
            }}
        }};
    }}
}}
'''

    file_path = output_dir / f"{feature_kebab}-presenter.ts"
    file_path.write_text(content)
    print(f"✓ Generated: {file_path}")


def generate_hook(feature_kebab: str, feature_pascal: str, feature_camel: str, output_dir: Path) -> None:
    """Generate React hook file."""
    content = f'''import {{ viewModels }} from '@maany_shr/e-class-models';
import {{ useMemo }} from 'react';
import {feature_pascal}Presenter, {{
    T{feature_pascal}PresenterUtilities,
}} from '../../common/presenters/{feature_kebab}-presenter';

export function use{feature_pascal}Presenter(
    setViewModel: (viewModel: viewModels.T{feature_pascal}ViewModel) => void,
) {{
    const presenterUtilities: T{feature_pascal}PresenterUtilities = {{}};
    const presenter = useMemo(
        () => new {feature_pascal}Presenter(setViewModel, presenterUtilities),
        [setViewModel],
    );
    return {{ presenter }};
}}
'''

    file_path = output_dir / f"use-{feature_kebab}-presenter.ts"
    file_path.write_text(content)
    print(f"✓ Generated: {file_path}")


def update_view_models_index(feature_kebab: str, index_path: Path) -> None:
    """Update view models index.ts with new export."""
    if not index_path.exists():
        print(f"✗ Warning: Index file not found: {index_path}")
        return

    content = index_path.read_text()
    export_line = f"export * from './{feature_kebab}-view-model';"

    # Check if already exists
    if export_line in content:
        print(f"✓ Export already exists in {index_path}")
        return

    # Append at the end
    if not content.endswith('\n'):
        content += '\n'
    content += export_line + '\n'

    index_path.write_text(content)
    print(f"✓ Updated: {index_path}")


def main():
    if len(sys.argv) < 3:
        print("Error: Missing required arguments")
        print("\nUsage:")
        print("  python3 tools/generate-presenter-scaffold.py <project> <feature-name>")
        print("\nArguments:")
        print("  project:      'platform' or 'cms'")
        print("  feature-name: Any casing (e.g., 'SaveHomePage', 'save-home-page')")
        print("\nExample:")
        print("  python3 tools/generate-presenter-scaffold.py cms save-home-page")
        sys.exit(1)

    project = sys.argv[1].lower()
    feature_input = sys.argv[2]

    # Validate project
    if project not in ['platform', 'cms']:
        print(f"Error: Invalid project '{project}'. Must be 'platform' or 'cms'")
        sys.exit(1)

    # Convert to different cases
    feature_kebab = to_kebab_case(feature_input)
    feature_pascal = to_pascal_case(feature_kebab)
    feature_camel = to_camel_case(feature_kebab)

    print(f"\n{'='*60}")
    print(f"Presenter Scaffold Generator")
    print(f"{'='*60}")
    print(f"Project:      {project}")
    print(f"Feature:      {feature_kebab}")
    print(f"PascalCase:   {feature_pascal}")
    print(f"camelCase:    {feature_camel}")
    if HAS_HUMPS:
        print(f"Converter:    humps (smart case conversion)")
    else:
        print(f"Converter:    built-in (install 'humps' for better conversion)")
    print(f"{'='*60}\n")

    # Define paths
    repo_root = Path(__file__).parent.parent
    view_models_dir = repo_root / "packages/models/src/view-models"
    presenters_dir = repo_root / f"apps/{project}/src/lib/infrastructure/common/presenters"
    hooks_dir = repo_root / f"apps/{project}/src/lib/infrastructure/client/hooks"
    view_models_index = view_models_dir / "index.ts"

    # Validate directories exist
    for dir_path, name in [(view_models_dir, "View models"),
                            (presenters_dir, "Presenters"),
                            (hooks_dir, "Hooks")]:
        if not dir_path.exists():
            print(f"✗ Error: {name} directory not found: {dir_path}")
            sys.exit(1)

    print("Generating files...\n")

    # Generate files
    try:
        generate_view_model(feature_kebab, feature_pascal, view_models_dir)
        generate_presenter(feature_kebab, feature_pascal, presenters_dir)
        generate_hook(feature_kebab, feature_pascal, feature_camel, hooks_dir)
        update_view_models_index(feature_kebab, view_models_index)

        print(f"\n{'='*60}")
        print("✓ Generation complete!")
        print(f"{'='*60}")
        print("\nGenerated files:")
        print(f"  1. View Model:  {view_models_dir}/{feature_kebab}-view-model.ts")
        print(f"  2. Presenter:   {presenters_dir}/{feature_kebab}-presenter.ts")
        print(f"  3. Hook:        {hooks_dir}/use-{feature_kebab}-presenter.ts")
        print(f"  4. Index:       {view_models_index} (updated)")

        print("\nImports:")
        print(f"  - View models from: @dream-aim-deliver/e-class-cms-rest")
        print(f"  - Usecase models from: @dream-aim-deliver/e-class-cms-rest")
        print(f"  - Presenter utilities from: @dream-aim-deliver/dad-cats")

        print("\nView modes:")
        print("  - default:   Success state with full data")
        print("  - kaboom:    General unhandled error")
        print("  - not-found: Resource not found (404)")

        print(f"\n{'='*60}\n")

    except Exception as e:
        print(f"\n✗ Error during generation: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
