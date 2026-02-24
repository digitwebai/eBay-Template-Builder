import { ListingData } from './types';

// Account mapping for internal use
export const ACCOUNTS = [
  { id: "1", name: "ledsone" },
  { id: "2", name: "retroled" },
  { id: "3", name: "bestbringer" },
  { id: "4", name: "sunsone" },
  { id: "21", name: "dctransformer" },
  { id: "22", name: "electricalsone" },
  { id: "23", name: "lightingsone" },
  { id: "24", name: "coventrylights" },
  { id: "25", name: "electro_shine" },
  { id: "27", name: "ledsonede" },
  { id: "28", name: "huettenlampen" },
  { id: "41", name: "vintageinterior" },
  { id: "211", name: "urigal" },
  { id: "222", name: "homin_gmbh" },
  { id: "238", name: "neighbourmarket" }
];

export const INITIAL_DATA: ListingData = {
  title: "Modern Ceiling Light Shade Lampshade Easy Fit Pendant Metal Kitchen Living Room",
  accountId: "1", // Default to ledsone
  logoUrl: "https://ledsone.co.uk/cdn/shop/files/logo.gif?v=1689066753&width=165",
  logoAlt: "Ledsone - Quality Lighting Store",
  ebayStoreUrl: "https://www.ebay.co.uk/str/ledsone",
  mainImages: [
    {
      url: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/180b67cf-f79d-46e8-9df8-db620af7ce1f.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
      alt: "Modern Ceiling Light Shade - Front View"
    },
    {
      url: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/0a6db1f2-2ef2-4943-b10f-ad5cd250b222.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
      alt: "Modern Ceiling Light Shade - Side View"
    },
    {
      url: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/07ab86be-7e53-4f92-8b38-750a5bf2f181.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
      alt: "Modern Ceiling Light Shade - Installation Details"
    },
    {
      url: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/93b770b4-48fd-47d6-abaa-ca71d1b9e34f.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
      alt: "Modern Ceiling Light Shade - Dimensions"
    },
    {
      url: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/0ebe562b-3967-4df3-890f-fdabc61d7322.__CR0,0,1464,600_PT0_SX1464_V1___.jpg",
      alt: "Modern Ceiling Light Shade - Usage Example"
    }
  ],
  comparisonItems: [
    {
      id: '1',
      image: "https://i.ebayimg.com/images/g/BP8AAeSwo9houUsk/s-l1600.webp",
      imageAlt: "Cone Easy Fit Lampshade - Metal Design",
      title: "Cone Easy Fit Lampshade",
      link: "https://www.ebay.co.uk/itm/164006555006",
      price: "£7.07",
      material: "Metal",
      lightSource: "LED",
      base: "E27 / B22"
    },
    {
      id: '2',
      image: "https://i.ebayimg.com/images/g/eGMAAeSw3KFoqFux/s-l1600.webp",
      imageAlt: "Black Light Shades - Modern Style",
      title: "Black Light Shades",
      link: "https://www.ebay.co.uk/itm/167734616067",
      price: "£8.23",
      material: "Metal",
      lightSource: "LED",
      base: "E27 / B22"
    },
    {
      id: '3',
      image: "https://i.ebayimg.com/images/g/V6kAAeSw1U5ot~vQ/s-l1600.webp",
      imageAlt: "Easy Fit Pendant Shades - Contemporary Design",
      title: "Easy Fit Pendant Shades",
      link: "https://www.ebay.co.uk/itm/167764761833",
      price: "£10.66",
      material: "Metal",
      lightSource: "LED",
      base: "E27 / B22"
    },
    {
      id: '4',
      image: "https://i.ebayimg.com/images/g/eKAAAOSwCf5oBb0M/s-l1600.webp",
      imageAlt: "Easy Fit Semi Curvy Shade - Vintage Style",
      title: "Easy Fit Semi Curvy Shade",
      link: "https://www.ebay.co.uk/itm/164666761396",
      price: "£12.78",
      material: "Metal",
      lightSource: "LED",
      base: "E27 / B22"
    },
    {
      id: '5',
      image: "https://i.ebayimg.com/images/g/TFsAAOSwv5loAOvd/s-l1600.webp",
      imageAlt: "Easy Fit Light Shades - Retro Design",
      title: "Easy Fit Light Shades",
      link: "https://www.ebay.co.uk/itm/164043595851",
      price: "£12.46",
      material: "Metal",
      lightSource: "LED",
      base: "E27 / B22"
    }
  ],
  comparisonRows: [
    { label: 'Price', key: 'price' },
    { label: 'Material', key: 'material' },
    { label: 'Light Source', key: 'lightSource' },
    { label: 'Base', key: 'base' },
  ],
  comparisonDescription: "WITH THIS SHADE, YOU CAN INSTANTLY ADD FLAIR AND STYLE TO YOUR LIVING, DINING, KITCHEN, CORRIDORS, ENTRANCES, CORRIDORS, WALK-IN CLOSETS, STAIRS, AISLES AND OTHER SPACES.",
  comparisonBrandBar: "LEDSONE",
  description: "Give your room an instant update with this stylish Metal easy-fit lampshade. Designed to fit directly onto your existing pendant light, it requires no electrician and no complicated installation.",
  specifications: [
    "Item Type: Lampshade",
    "Style: Vintage/Retro",
    "Material: Metal",
    "Dimensions of the shade: 29cm width x 17cm height",
    "Installation area: indoor",
    "Shade shape: curvy",
    "Features of the shade: no wiring required, Easy to fit, it simply attaches to your existing lights."
  ],
  packageIncludes: ["2 x Lamp shades Only"],
  aboutItems: [
    "DESIGN: Retro Style black dome light shade with sleek lines suits ceiling, pendant, or wall lights. Includes a reducer plate for easy fit on various lamp holders, combining style and flexible installation.",
    "MATERIAL & DIMENSION: This beautiful home lamp is made from strong metal with a durable black finish. It features a 29cm diameter, 17cm height, and a 4cm center hole, ideal for easy Ceiling fitting.",
    "INDOOR APPLICATION: Ideal for stairwells, reading nooks, art studios, loft apartments, breakfast bars, boutique stores, gallery spaces, or home offices—adds rustic charm to creative modern interiors.",
    "INSTALLATION: Designed for quick, tool-free setup, this easy-fit lampshade includes a reducer plate for B22 bayonet caps and can be used without it for E27 screw sockets—ideal for ceiling, pendant, or wall lights.",
    "PACKAGE INCLUDED: You’ll receive 2 x black dome lampshades and 2 x white reducer plates. Please note: bulbs are not included—this package contains the lampshades and reducer ring only, ready for easy fitting."
  ],
  shippingInfo: {
    freeShipping: "This can take anywhere between 2-5 working days, sometimes longer.",
    firstClass: "24-hour service. Service cost is £4.99, and this is a 1-3 working days service.",
    international: "7-10 working days and sometimes longer depending on the destination of the order."
  },
  aboutUs: "We are a UK-based company providing high-quality lighting solutions. Our goal is to deliver stylish and modern products with excellent service. For any queries, contact us via eBay messaging – replies within 24 hours."
};
