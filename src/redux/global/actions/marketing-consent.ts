import { TOGGLE_MARKETING_CONSENT_NEEDED } from './';

export default function toggleMarketingConsentNeeded(
  needsMarketingConsent: boolean
) {
  return {
    type: TOGGLE_MARKETING_CONSENT_NEEDED,
    payload: needsMarketingConsent,
  };
}
