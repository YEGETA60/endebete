export type LegalSection = {
  id: string;
  title: { en: string; am: string };
  content: { en: string; am: string }; // Plain text with \n for paragraphs
};

export type LegalDocument = {
  title: { en: string; am: string };
  lastUpdated: string;
  sections: LegalSection[];
};

// Types only — import documents directly from their helpers:
// helpers/legalTerms, helpers/legalPrivacy, helpers/legalRentalGuidelines