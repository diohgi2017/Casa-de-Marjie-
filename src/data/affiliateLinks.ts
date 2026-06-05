export interface AffiliateLink {
  amazon: string;
  ulta: string;
}

// The owner's tracking IDs (to be filled after approval)
export const OWNER_IDS = {
  amazon: "casademarjie-20",  // Updated branding
  ulta: "CASADEMARJIE123",    // Updated branding
};

// Map product slugs to affiliate product IDs
export const affiliateLinks: Record<string, AffiliateLink> = {
  "cerave-foaming-facial-cleanser": {
    amazon: `https://www.amazon.com/dp/B0C1V7YQXN?tag=${OWNER_IDS.amazon}`,
    ulta: `https://www.ulta.com/p/cerave-foaming-facial-cleanser?utm_source=casademarjie&utm_medium=affiliate`,
  },
  "innisfree-super-volcanic-pore-clay-mask": {
    amazon: `https://www.amazon.com/dp/B00V27Y7V0?tag=${OWNER_IDS.amazon}`,
    ulta: `https://www.ulta.com/p/innisfree-super-volcanic-clay-mask?utm_source=casademarjie`,
  },
  "the-ordinary-niacinamide-10-zinc-1": {
    amazon: `https://www.amazon.com/dp/B01N0P6Z0B?tag=${OWNER_IDS.amazon}`,
    ulta: `https://www.ulta.com/p/the-ordinary-niacinamide?utm_source=casademarjie`,
  },
};
