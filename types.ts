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
}

export interface MainImage {
  url: string; // URL or Base64
  alt: string; // Alt text for the image
}

export interface ListingData {
  title: string;
  mainImages: MainImage[]; // Array of images with alt text
  comparisonItems: ComparisonItem[];
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