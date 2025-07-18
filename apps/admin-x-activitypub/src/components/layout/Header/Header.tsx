import BackButton from '@src/components/global/BackButton';
import React from 'react';
import useActiveRoute from '@src/hooks/use-active-route';
import {H1} from '@tryghost/shade';
import {useBaseRoute, useNavigationStack, useRouteHasParams} from '@tryghost/admin-x-framework';

interface HeaderTitleProps {
    title: string;
    backIcon: boolean;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({title, backIcon}) => {
    if (backIcon) {
        return <BackButton className='-ml-2' />;
    }
    return (
        <H1>{title}</H1>
    );
};

const Header: React.FC = () => {
    const {canGoBack} = useNavigationStack();
    const baseRoute = useBaseRoute();
    const routeHasParams = useRouteHasParams();
    const activeRoute = useActiveRoute();

    // Logic for special pages
    let onlyBackButton = false;
    if (baseRoute === 'profile') {
        onlyBackButton = true;
    }

    if (baseRoute === 'notes' && canGoBack) {
        onlyBackButton = true;
    }

    // Avoid back button on main routes
    const backActive = (canGoBack && routeHasParams) || activeRoute?.showBackButton === true;

    return (
        <>
            {onlyBackButton ?
                <div className='sticky left-0 top-8 z-50 inline-block'>
                    {backActive && <BackButton className='ml-6' />}
                </div>
                :
                <div className='sticky top-0 z-50 bg-white/85 backdrop-blur-md dark:bg-black'>
                    <div className='relative flex h-[102px] items-center justify-between gap-5 px-8 before:absolute before:inset-x-8 before:bottom-0 before:block before:border-b before:border-gray-200 before:content-[""] before:dark:border-gray-950'>
                        <HeaderTitle
                            backIcon={backActive}
                            title={activeRoute?.pageTitle || ''}
                        />
                    </div>
                </div>
            }
        </>
    );
};

export default Header;
