import Image from 'next/image';
import { img } from '@/content/projects';

type Props = { src: string; alt: string; className?: string; sizes?: string; priority?: boolean; style?: React.CSSProperties; position?: string };

/** A revealable figure with an optimized, responsive image filling its box. */
export function Fig({ src, alt, className = '', sizes = '(max-width: 700px) 100vw, 50vw', priority, style, position }: Props) {
  return (
    <figure className={`rv ${className}`} style={style}>
      <Image src={img(src)} alt={alt} fill sizes={sizes} priority={priority} style={position ? { objectPosition: position } : undefined} />
    </figure>
  );
}
