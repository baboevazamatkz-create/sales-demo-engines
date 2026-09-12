export function ProductImage({
  src,
  alt,
  className = '',
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  if (src) {
    return <img src={src} alt={alt} className={`object-cover ${className}`} />;
  }
  return <div className={`bg-gradient-to-br from-img-from to-img-to ${className}`} />;
}
