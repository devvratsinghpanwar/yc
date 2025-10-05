import { defineQuery } from "next-sanity";

export const STARTUPS_QUERY =
  defineQuery(`*[_type == "startup" && defined(slug.current) && !defined($search) || title match $search || category match $search || author->name match $search] | order(_createdAt desc) {
  _id,
  title,
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  },
  views,
  description,
  category,
  image,
  imageAsset,
  upvotes,
  "upvotedBy": upvotedBy[]->_id,
}`);

export const STARTUP_BY_ID_QUERY =
  defineQuery(`*[_type == "startup" && _id == $id][0]{
  _id,
  title,
  slug,
  _createdAt,
  author -> {
    _id, name, username, image, bio
  },
  views,
  description,
  category,
  image,
  imageAsset,
  pitch,
  upvotes,
  "upvotedBy": upvotedBy[]->_id,
}`);

export const STARTUP_VIEWS_QUERY = defineQuery(`
    *[_type == "startup" && _id == $id][0]{
        _id, views
    }
`);

export const AUTHOR_BY_GOOGLE_ID_QUERY = defineQuery(`
*[_type == "author" && id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
}
`);

export const AUTHOR_BY_ID_QUERY = defineQuery(`
*[_type == "author" && _id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
}
`);

export const STARTUPS_BY_AUTHOR_QUERY =
  defineQuery(`*[_type == "startup" && author._ref == $id] | order(_createdAt desc) {
  _id,
  title,
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  },
  views,
  description,
  category,
  image,
  imageAsset,
  upvotes,
  "upvotedBy": upvotedBy[]->_id,
}`);

export const PLAYLIST_BY_SLUG_QUERY =
  defineQuery(`*[_type == "playlist" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  select[]->{
    _id,
    _createdAt,
    title,
    slug,
    author->{
      _id,
      name,
      slug,
      image,
      bio
    },
    views,
    description,
    category,
    image,
    imageAsset,
    pitch,
    upvotes,
    "upvotedBy": upvotedBy[]->_id,
  }
}`);

// Query for getting popular startups (for future recommendation system)
export const POPULAR_STARTUPS_QUERY =
  defineQuery(`*[_type == "startup" && defined(slug.current)] | order(upvotes desc, _createdAt desc) [0...10] {
  _id,
  title,
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  },
  views,
  description,
  category,
  image,
  imageAsset,
  upvotes,
  "upvotedBy": upvotedBy[]->_id,
}`);

// Query for getting startups by category (for recommendation system)
export const STARTUPS_BY_CATEGORY_QUERY =
  defineQuery(`*[_type == "startup" && defined(slug.current) && category == $category] | order(upvotes desc, _createdAt desc) {
  _id,
  title,
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  },
  views,
  description,
  category,
  image,
  imageAsset,
  upvotes,
  "upvotedBy": upvotedBy[]->_id,
}`);

// Query for getting all categories with startup counts
export const CATEGORIES_WITH_COUNTS_QUERY =
  defineQuery(`*[_type == "startup" && defined(category) && defined(slug.current)] | {
  "category": category,
  "count": count(*[_type == "startup" && category == ^.category])
} | order(count desc)`);

// Query for getting top startup from each category
export const TOP_STARTUPS_BY_CATEGORY_QUERY =
  defineQuery(`{
  "categories": *[_type == "startup" && defined(category) && defined(slug.current)] | {
    "category": category,
    "count": count(*[_type == "startup" && category == ^.category])
  } | order(count desc) [0...3],
  "startups": *[_type == "startup" && defined(slug.current)] | order(upvotes desc, views desc, _createdAt desc) {
    _id,
    title,
    slug,
    _createdAt,
    author -> {
      _id, name, image, bio
    },
    views,
    description,
    category,
    image,
    imageAsset,
    upvotes,
    "upvotedBy": upvotedBy[]->_id,
  }
}`);