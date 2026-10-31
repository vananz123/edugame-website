export type Locale = "vi" | "en";

export type HeroData = {
  badge: string;
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  screenshotAlt: string;
};

export type AboutData = {
  heading: string;
  name: string;
  role: string;
  bio: string;
  motivation: string;
  github: string;
  githubLabel: string;
  contactLabel: string;
  email: string;
};

export type ProductData = {
  heading: string;
  description: string;
  points: string[];
};

export type FeatureItem = { title: string; description: string };
export type FeaturesData = { heading: string; items: FeatureItem[] };

export type GameItem = {
  title: string;
  description: string;
  screenshotUrl?: string | null;
  videoUrl?: string | null;
};
export type GamesData = {
  heading: string;
  description: string;
  screenshotPlaceholder: string;
  items: GameItem[];
};

export type DownloadData = {
  heading: string;
  description: string;
  cardTitle: string;
  button: string;
  versionLabel: string;
  version: string;
  fileSizeLabel: string;
  fileSize: string;
  releaseDateLabel: string;
  releaseDate: string;
  requirementsLabel: string;
  requirements: string;
  releaseNotesLabel: string;
  releaseNotes: string;
  trialLabel: string;
  trial: string;
  trialButton: string;
  windowsUrl: string;
  trialUrl: string;
};

export type PublicData = {
  hero: HeroData;
  about: AboutData;
  product: ProductData;
  features: FeaturesData;
  games: GamesData;
  download: DownloadData;
};