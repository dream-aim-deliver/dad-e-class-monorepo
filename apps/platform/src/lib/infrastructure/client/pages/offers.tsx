'use client';

import {
    DefaultError,
    DefaultLoading,
    FilterSwitch,
    Outline,
    SectionHeading,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../trpc/client';
import { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetOffersPageOutlinePresenter } from '../hooks/use-offers-page-outline-presenter';
import { Tabs } from '../../../../../../../packages/ui-kit/lib/components/tabs/tab';
import { IconAccountInformation } from '../../../../../../../packages/ui-kit/lib/components/icons/icon-account-information';
import { IconAssignment } from '../../../../../../../packages/ui-kit/lib/components/icons/icon-assignment';
import { IconCertification } from '../../../../../../../packages/ui-kit/lib/components/icons/icon-certification';

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
        <div className="flex flex-col space-y-5">
            <Outline title={outline.title} description={outline.description} />
            <SectionHeading text="What's your goal?" />
            <Tabs.Root defaultTab="all">
                <Tabs.List>
                    <Tabs.Trigger value="all">All</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="all" className="mt-8">
                    <FilterSwitch
                        title="Filter by Topic"
                        list={[
                            { name: 'Branding', url: '' },
                            { name: 'Motion Graphics', url: '' },
                        ]}
                    />
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}
