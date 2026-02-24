export interface ComparisonItem {
  id: string;
  image: string; // URL or Base64
  imageAlt: string; // Alt text for the image
  title: string;
  link: string;
  price: string;
  material: string;
  lightSource: string;
  base: string;
  [key: string]: string; // Allow dynamic custom fields
}

export interface MainImage {
  link: string; // backlink URL (click target)
  url: string; // URL or Base64
  alt: string; // Alt text for the image
  title?: string; // Optional title/caption for this image
  details?: string; // Optional description/details for this image
  bullets?: string[]; // Optional bullet list specific to this image
}

export interface ListingData {
  title: string;
  accountId: string; // For internal use - not exported to eBay HTML
  mainImages: MainImage[]; // Array of images with alt text
  featureImages?: MainImage[]; // Optional 4-up feature section (e.g., Hall/Kitchen/Office/Cafe)
  featureImagesFooter?: string; // Optional HTML/text to render under the feature images block
  comparisonItems: ComparisonItem[];
  comparisonRows?: Array<{ label: string; key: string }>; // Custom comparison table rows
  comparisonDescription?: string; // Description text above comparison table
  comparisonBrandBar?: string; // Brand name text in black bar above comparison table
  description: string;
  specifications: string[]; // Array of strings for bullet points
  packageIncludes: string[];
  aboutItems: string[]; // Array of strings for bullet points
  shippingInfo: {
    freeShipping: string;
    firstClass: string;
    international: string;
  };
  aboutUs: string;
  logoUrl: string;
  logoAlt: string; // Alt text for logo
  ebayStoreUrl: string;
}

export enum TabView {
  EDITOR = 'EDITOR',
  PREVIEW = 'PREVIEW',
  CODE = 'CODE',
}