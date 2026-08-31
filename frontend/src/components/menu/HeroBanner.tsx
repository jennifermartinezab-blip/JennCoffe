import './HeroBanner.css';

function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-banner__content">
        <p className="hero-banner__eyebrow">
          JennCoffee
        </p>

        <h2 className="hero-banner__title">
          Disfruta lo mejor de nuestro menú
        </h2>

        <p className="hero-banner__description">
          Descubre nuestros sabores y disfruta un momento especial.
        </p>

        <span className="hero-banner__action">
          Ver promociones
        </span>
      </div>

      <div className="hero-banner__visual">
        <img
          className="hero-banner__image"
          src="/images/banners/hero-menu.jpg"
          alt="Bebida de fresa JennCoffee"
        />
      </div>
    </section>
  );
}

export default HeroBanner;