'use client';

import {
    DefaultError,
    DefaultLoading,
    Outline,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../trpc/client';
import { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetOffersPageOutlinePresenter } from '../hooks/use-offers-page-outline-presenter';

export default function Offers() {
    const [outlineResponse] = trpc.getOffersPageOutline.useSuspenseQuery({});
    const [outlineViewModel, setOutlineViewModel] = useState<
        viewModels.TOffersPageOutlineViewModel | undefined
    >(undefined);
    const { presenter } = useGetOffersPageOutlinePresenter(setOutlineViewModel);
    presenter.present(outlineResponse, outlineViewModel);

    if (!outlineViewModel) {
        return <DefaultLoading />;
    }

    if (outlineViewModel.mode === 'kaboom') {
        return <DefaultError errorMessage={outlineViewModel.data.message} />;
    }

    const outline = outlineViewModel.data;

    return (
        <div className="flex flex-col">
            <Outline title={outline.title} description={outline.description} />
        </div>
    );
}
