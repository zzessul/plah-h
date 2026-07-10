export default function Card({ children, className = '', onClick }) {
  return (
    <section className={`card ${className}`} onClick={onClick}>
      {children}
    </section>
  );
}
