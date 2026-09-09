import { useEffect, useState } from 'react';

import './HeroBanner.css';

interface HeroBannerProps {
  onVerPromociones: () => void;
}

interface Slide {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

const slides: Slide[] = [
  {
    id: 1,
    eyebrow: 'JennCoffee',
    title: 'Disfruta lo mejor de nuestro menú',
    description:
      'Descubre nuestros sabores y disfruta un momento especial.',
    image: '/images/banners/hero-menu.jpg',
    alt: 'Bebida especial de fresa JennCoffee'
  },
  {
    id: 2,
    eyebrow: 'Postres',
    title: 'Un toque dulce para tu momento',
    description:
      'Disfruta nuestro cheesecake coreano y acompáñalo con tu bebida favorita.',
    image: '/images/banners/cheesecake-coreano.jpg',
    alt: 'Cheesecake coreano de JennCoffee'
  },
  {
    id: 3,
    eyebrow: 'Combos',
    title: 'Combos especiales JennCoffee',
    description:
      'Encuentra combinaciones deliciosas para disfrutar durante cualquier momento del día.',
    image: '/images/banners/combo-jenncoffee.jpg',
    alt: 'Combo especial JennCoffee'
  },
  {
    id: 4,
    eyebrow: 'K-Drama',
    title: 'Sabores inspirados en Corea',
    description:
      'Descubre nuestro combo K-Drama con sabores intensos y una experiencia diferente.',
    image: '/images/banners/combo-k-drama.jpg',
    alt: 'Combo K-Drama de JennCoffee'
  },
  {
    id: 5,
    eyebrow: 'Para compartir',
    title: 'Momentos especiales con amigos',
    description:
      'Disfruta nuestro combo K-Friends y comparte una experiencia llena de sabor.',
    image: '/images/banners/combo-k-friends.jpg',
    alt: 'Combo K-Friends de JennCoffee'
  }
];

function HeroBanner({
  onVerPromociones
}: HeroBannerProps) {
  const [indiceActivo, setIndiceActivo] =
    useState(0);

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setIndiceActivo((indiceAnterior) =>
        indiceAnterior === slides.length - 1
          ? 0
          : indiceAnterior + 1
      );
    }, 3500);

    return () => {
      window.clearInterval(intervalo);
    };
  }, []);

  const irAlAnterior = () => {
    setIndiceActivo((indiceAnterior) =>
      indiceAnterior === 0
        ? slides.length - 1
        : indiceAnterior - 1
    );
  };

  const irAlSiguiente = () => {
    setIndiceActivo((indiceAnterior) =>
      indiceAnterior === slides.length - 1
        ? 0
        : indiceAnterior + 1
    );
  };

  const irASlide = (
    indice: number
  ) => {
    setIndiceActivo(indice);
  };

  const slideActivo =
    slides[indiceActivo];

  return (
    <section
      className="hero-banner"
      aria-label="Carrusel de promociones de JennCoffee"
    >
      <button
        type="button"
        className="hero-banner__control hero-banner__control--left"
        onClick={irAlAnterior}
        aria-label="Ver imagen anterior"
      >
        ‹
      </button>

      <div className="hero-banner__content">
        <p className="hero-banner__eyebrow">
          {slideActivo.eyebrow}
        </p>

        <h2 className="hero-banner__title">
          {slideActivo.title}
        </h2>

        <p className="hero-banner__description">
          {slideActivo.description}
        </p>

        <button
          type="button"
          className="hero-banner__action"
          onClick={onVerPromociones}
        >
          Ver promociones
        </button>

        <div
          className="hero-banner__dots"
          aria-label="Indicadores del carrusel"
        >
          {slides.map(
            (slide, indice) => (
              <button
                key={slide.id}
                type="button"
                className={
                  indice === indiceActivo
                    ? 'hero-banner__dot hero-banner__dot--active'
                    : 'hero-banner__dot'
                }
                onClick={() =>
                  irASlide(indice)
                }
                aria-label={`Ir a la imagen ${indice + 1}`}
              />
            )
          )}
        </div>
      </div>

      <div className="hero-banner__visual">
        <img
          className="hero-banner__image"
          src={slideActivo.image}
          alt={slideActivo.alt}
        />
      </div>

      <button
        type="button"
        className="hero-banner__control hero-banner__control--right"
        onClick={irAlSiguiente}
        aria-label="Ver siguiente imagen"
      >
        ›
      </button>
    </section>
  );
}

export default HeroBanner;