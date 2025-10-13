# DAD E-Class Tools

Python tools for generating presenter scaffolds in the DAD E-Class project.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Presenter Scaffold Generator](#presenter-scaffold-generator)
- [Setup](#setup)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### First Time Setup

```bash
cd tools
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

### Generate Presenter Files

```bash
# Use any casing format:
./tools/scaffold-presenter cms SaveHomePage
./tools/scaffold-presenter cms save-home-page
./tools/scaffold-presenter platform GetCourseDetails
```

---

## Presenter Scaffold Generator

A deterministic script that generates complete presenter layer files (view-model, presenter, and React hook).

### Features

✅ **Smart Case Conversion** - Accepts PascalCase, camelCase, kebab-case, snake_case
✅ **Automatic Imports** - Correctly imports from `@dream-aim-deliver/e-class-cms-rest`
✅ **Complete Layer** - Generates view-model, presenter, and React hook
✅ **Index Updates** - Automatically updates `index.ts` exports
✅ **Type-Safe** - Fully typed TypeScript files

### Usage

```bash
./tools/scaffold-presenter <project> <feature-name>
```

**Arguments:**
- `project`: Either `'cms'` or `'platform'`
- `feature-name`: Any casing format (auto-converted to kebab-case)

### Generated Files

For feature `save-home-page` in project `cms`:

1. **View Model**: `packages/models/src/view-models/save-home-page-view-model.ts`
   - Imports from `@dream-aim-deliver/e-class-cms-rest`
   - Three view modes: `default`, `kaboom`, `not-found`

2. **Presenter**: `apps/cms/src/lib/infrastructure/common/presenters/save-home-page-presenter.ts`
   - Imports usecase models from cms-rest
   - Implements `presentSuccess()` and `presentError()`

3. **React Hook**: `apps/cms/src/lib/infrastructure/client/hooks/use-save-home-page-presenter.ts`
   - Memoized presenter instance
   - Ready to use in components

4. **Index**: Updates `packages/models/src/view-models/index.ts` with new export

### Case Conversion Examples

The script uses **pyhumps** for smart case conversion:

```bash
# All produce the same output:
./tools/scaffold-presenter cms SaveHomePage     # PascalCase
./tools/scaffold-presenter cms save-home-page   # kebab-case
./tools/scaffold-presenter cms save_home_page   # snake_case
./tools/scaffold-presenter cms saveHomePage     # camelCase

# Result: save-home-page (kebab-case files, PascalCase types)
```

### Integration Example

```typescript
import { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useSaveHomePagePresenter } from '@/hooks/use-save-home-page-presenter';

function SaveHomePageComponent() {
  const [viewModel, setViewModel] = useState<viewModels.TSaveHomePageViewModel>();
  const { presenter } = useSaveHomePagePresenter(setViewModel);

  // Execute usecase and present
  const handleSave = async (data: any) => {
    const response = await controller.execute({ data }, {});
    presenter.present(response);
  };

  // Render based on view mode
  if (viewModel?.mode === 'default') return <SuccessView data={viewModel.data} />;
  if (viewModel?.mode === 'not-found') return <NotFoundView />;
  if (viewModel?.mode === 'kaboom') return <ErrorView error={viewModel.data} />;

  return null;
}
```

---

## Setup

### Virtual Environment

The scripts use a Python virtual environment with isolated dependencies.

**Create (first time only):**
```bash
cd tools
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

**Verify:**
```bash
tools/.venv/bin/python3 -c "import humps; print('✓ Ready!')"
```

### Dependencies

Current dependencies (from `requirements.txt`):
- **pyhumps** (3.8.0): Smart case conversion

**Add dependency:**
```bash
cd tools
echo "package-name==version" >> requirements.txt
.venv/bin/pip install -r requirements.txt
```

### Files

```
tools/
├── .venv/                           # Virtual environment (gitignored)
├── .gitignore                       # Excludes .venv and cache
├── requirements.txt                 # Python dependencies
├── scaffold-presenter               # Bash wrapper (uses .venv)
├── generate-presenter-scaffold.py   # Main generator script
└── README.md                        # This file
```

---

## Usage Examples

### Basic Examples

```bash
# CMS project
./tools/scaffold-presenter cms save-home-page
./tools/scaffold-presenter cms create-topic
./tools/scaffold-presenter cms delete-category

# Platform project
./tools/scaffold-presenter platform get-course-details
./tools/scaffold-presenter platform save-personal-profile
./tools/scaffold-presenter platform schedule-coaching-session
```

### Different Casing Formats

```bash
# PascalCase input
./tools/scaffold-presenter cms CreateTopic
# Output: create-topic (files), CreateTopic (types)

# camelCase input
./tools/scaffold-presenter cms createTopic
# Output: create-topic (files), CreateTopic (types)

# snake_case input
./tools/scaffold-presenter cms create_topic
# Output: create-topic (files), CreateTopic (types)

# kebab-case input
./tools/scaffold-presenter cms create-topic
# Output: create-topic (files), CreateTopic (types)
```

### CRUD Operations

```bash
# Create
./tools/scaffold-presenter cms create-topic
./tools/scaffold-presenter cms create-category

# Read/Get
./tools/scaffold-presenter cms get-topic-details
./tools/scaffold-presenter cms list-topics

# Update/Save
./tools/scaffold-presenter cms update-topic
./tools/scaffold-presenter cms save-topic

# Delete
./tools/scaffold-presenter cms delete-topic
```

### Complex Names

```bash
# Multi-word features
./tools/scaffold-presenter cms list-student-coaching-sessions
./tools/scaffold-presenter platform get-course-certificate-data
./tools/scaffold-presenter cms list-coach-student-courses
```

### Sample Output

```
============================================================
Presenter Scaffold Generator
============================================================
Project:      cms
Feature:      save-home-page
PascalCase:   SaveHomePage
camelCase:    saveHomePage
Converter:    humps (smart case conversion)
============================================================

Generating files...

✓ Generated: packages/models/src/view-models/save-home-page-view-model.ts
✓ Generated: apps/cms/src/lib/infrastructure/common/presenters/save-home-page-presenter.ts
✓ Generated: apps/cms/src/lib/infrastructure/client/hooks/use-save-home-page-presenter.ts
✓ Updated: packages/models/src/view-models/index.ts

============================================================
✓ Generation complete!
============================================================
```

---

## Troubleshooting

### Virtual Environment Not Found

```bash
Error: Virtual environment not found at tools/.venv
```

**Fix:**
```bash
cd tools
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

### Permission Denied

```bash
./tools/scaffold-presenter: Permission denied
```

**Fix:**
```bash
chmod +x tools/scaffold-presenter
```

### Import Errors in Generated Files

If TypeScript complains about imports:

1. Verify usecase models exist in `@dream-aim-deliver/e-class-cms-rest`
2. Check feature name matches usecase name exactly
3. Run lint to verify:
   ```bash
   pnpm nx run models:lint
   pnpm nx run cms:lint
   ```

### View Model Types Not Found

Check that export was added to `packages/models/src/view-models/index.ts`:

```typescript
export * from './your-feature-view-model';
```

### Python Version Issues

**Check version:**
```bash
python3 --version  # Requires 3.6+
```

**Use specific version:**
```bash
cd tools
python3.11 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

### Testing the Generator

```bash
# Test with sample feature
./tools/scaffold-presenter cms test-feature

# Verify files created
ls packages/models/src/view-models/test-feature-view-model.ts
ls apps/cms/src/lib/infrastructure/common/presenters/test-feature-presenter.ts

# Clean up test files
rm packages/models/src/view-models/test-feature-view-model.ts
rm apps/cms/src/lib/infrastructure/common/presenters/test-feature-presenter.ts
rm apps/cms/src/lib/infrastructure/client/hooks/use-test-feature-presenter.ts
# Remove from index.ts manually
```

---

## Generated Code Structure

### View Model Template

```typescript
import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { FeatureSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const FeatureViewModelSchemaMap = {
    default: FeatureDefaultViewModelSchema,
    kaboom: FeatureKaboomViewModelSchema,
    notFound: FeatureNotFoundViewModelSchema,
};

export const FeatureViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(FeatureViewModelSchemaMap);
export type TFeatureViewModel = z.infer<typeof FeatureViewModelSchema>;
```

### Presenter Template

```typescript
import { viewModels } from '@maany_shr/e-class-models';
import {
    FeatureUseCaseResponseSchema,
    TFeatureUseCaseResponse,
    TFeatureErrorResponse,
} from '@dream-aim-deliver/e-class-cms-rest';

export default class FeaturePresenter extends BasePresenter<...> {
    presentSuccess(response: ...) {
        return { mode: 'default', data: { ...response.data } };
    }

    presentError(response: ...) {
        return { mode: 'kaboom', data: { ...response.data } };
    }
}
```

### Hook Template

```typescript
import { viewModels } from '@maany_shr/e-class-models';
import { useMemo } from 'react';
import FeaturePresenter from '../../common/presenters/feature-presenter';

export function useFeaturePresenter(
    setViewModel: (viewModel: viewModels.TFeatureViewModel) => void,
) {
    const presenter = useMemo(
        () => new FeaturePresenter(setViewModel, {}),
        [setViewModel],
    );
    return { presenter };
}
```

---

## Tips

1. **Match usecase names**: Feature name should match your usecase name in cms-rest
2. **Customize presenters**: Edit `presentSuccess()` and `presentError()` methods as needed
3. **Add view modes**: Edit view model to add `loading`, `empty`, or `invalid` modes
4. **Verify imports**: Run lint after generation to catch import issues early

---

## Related

- Based on `/dad:v1:feature:presenter-scaffold` command
- For interactive version with discovery: Use the slash command instead
- Project structure: Standard DAD E-Class monorepo layout

---

## Requirements

- Python 3.6+
- Dependencies: `@dream-aim-deliver/e-class-cms-rest`, `@maany_shr/e-class-models`, `@dream-aim-deliver/dad-cats`
- Standard DAD E-Class directory structure
