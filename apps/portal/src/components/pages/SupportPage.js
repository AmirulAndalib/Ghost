import {useEffect, useState, useContext} from 'react';
import SupportError from './SupportError';
import LoadingPage from './LoadingPage';
import setupGhostApi from '../../utils/api';
import AppContext from '../../AppContext';

const SupportPage = () => {
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [disabledFeatureError, setDisabledFeatureError] = useState(null);
    const {member, t, site} = useContext(AppContext);

    useEffect(() => {
        async function checkoutDonation() {
            const siteUrl = site.url;
            const currentUrl = window.location.origin + window.location.pathname;
            const successUrl = member ? `${currentUrl}?action=support&success=true` : `${currentUrl}#/portal/support/success`;
            const cancelUrl = currentUrl;
            const api = setupGhostApi({siteUrl});

            try {
                const response = await api.member.checkoutDonation({successUrl, cancelUrl, personalNote: t('Add a personal note')});

                if (response.url) {
                    window.location.replace(response.url);
                }
            } catch (err) {
                if (err.type && err.type === 'DisabledFeatureError') {
                    setDisabledFeatureError(t('This site is not accepting payments at the moment.'));
                } else {
                    setError(t('Something went wrong, please try again later.'));
                }

                setLoading(false);
            }
        }

        if (site && site.donations_enabled === false) {
            setDisabledFeatureError(t('This site is not accepting donations at the moment.'));
            setLoading(false);
        } else {
            checkoutDonation();
        }

    // Do it once
    // eslint-disable-next-line
    }, []);

    if (isLoading) {
        return (
            <div>
                <LoadingPage />
            </div>
        );
    }

    if (error) {
        return <SupportError error={error} />;
    }

    if (disabledFeatureError) {
        // TODO: use a different layout for this error
        return <SupportError error={disabledFeatureError} />;
    }

    return null;
};

export default SupportPage;
