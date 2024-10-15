/**
 * Mock of the Next.js Image component for unit testing with Jest.
 *
 * This mock replaces the Next.js Image component with a simple HTML <img> element.
 * This is useful in the context of testing, as the Next.js Image component can introduce
 * complex behaviors related to image loading that are not necessary to test.
 *
 * @param {string} src - The URL of the image.
 * @param {string} alt - Alternative text for the image.
 * @param {object} props - Any additional props are passed to the <img> element.
 *
 * @returns {JSX.Element} <img> element representing the image.
 */
const NextImage = ({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) => {
  return <img src={src} alt={alt} {...props} />;
};

export default NextImage;
