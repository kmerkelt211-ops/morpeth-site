// lib/galleryQueries.ts
import { groq } from 'next-sanity';

export const currentExhibitionsQuery = groq`
  *[_type == "galleryExhibition" && isCurrent == true]
  | order(orderRank asc, startDate desc)[0...3]{
    _id,
    title,
    subtitle,
    slug,
    locationType,
    exhibitorType,
    startDate,
    endDate,
    bgColor,
    heroImages[]{
      asset->{url, metadata}
    },
    description
  }
`;

export const allExhibitionsQuery = groq`
  *[_type == "galleryExhibition"]
  | order(startDate desc){
    _id,
    title,
    subtitle,
    slug,
    locationType,
    exhibitorType,
    startDate,
    endDate,
    isCurrent,
    bgColor,
    heroImages[]{
      asset->{url, metadata}
    },
    description
  }
`;