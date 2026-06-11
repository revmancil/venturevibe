/** Homepage social proof stats — update values here. */
export const SOCIAL_PROOF = {
  ideasValidated: "2,400+",
  averageRating: "4.8",
  countryCount: 38,
} as const;

export const SOCIAL_PROOF_ITEMS = [
  {
    id: "ideas-validated",
    label: `${SOCIAL_PROOF.ideasValidated} ideas validated`,
  },
  {
    id: "average-rating",
    label: `${SOCIAL_PROOF.averageRating}★ average rating`,
  },
  {
    id: "countries",
    label: `Trusted by founders in ${SOCIAL_PROOF.countryCount} countries`,
  },
] as const;
