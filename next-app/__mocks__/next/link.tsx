/**
 *Mock of the Next.js Link component for unit testing with Jest.
 *
 * This mock replaces the Next.js Link component with a simple anchor element.
 * This is useful in the context of testing, as the Next.js Link component can introduce
 * complex behaviors related to navigation and routing that are not necessary to test.
 *
 * @param {string} href - The URL of the link.
 * @param {object} props - Any additional props are passed to the anchor element.
 *
 * @returns {JSX.Element} <a> element with the specified href and additional props.
 */
const NextLink = ({ href, ...props }: { href: string; [key: string]: any }) => {
  return <a href={href} {...props} />;
};

export default NextLink;
