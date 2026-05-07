// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      { source: '/our-dentists', destination: '/find-a-dentist', permanent: true },
      { source: '/searchbytownorcity', destination: '/find-a-dentist', permanent: true },
      { source: '/dentist-list-2/:slug*', destination: '/dentist/:slug*', permanent: true },
      { source: '/availmentprocedure', destination: '/how-it-works', permanent: true },
      { source: '/copy-of-nominate-your-dentist', destination: '/book-appointment', permanent: true },
      { source: '/memberfaqs', destination: '/faqs', permanent: true },
      { source: '/nominate-your-dentist', destination: '/nominate', permanent: true },
      { source: '/non-members', destination: '/partner-with-us', permanent: true },
      { source: '/copy-of-dental-provider-s-faqs', destination: '/join-our-network', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/generatedigitalid', destination: '/digital-id', permanent: true },
      { source: '/copy-of-members', destination: '/', permanent: true },
      { source: '/copy-of-dental-care-tips', destination: '/', permanent: true },
    ];
  },
};

module.exports = nextConfig;
