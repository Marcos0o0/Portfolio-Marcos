import { useRef, useEffect, useState } from 'react';

const FadeContent = ({
  children,
  blur = false,
  duration = 1000,
  easing = 'ease-out',
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  className = '',
  wait = false
}) => {
  const [inView, setInView] = useState(false);
  const [loaderDone, setLoaderDone] = useState(() => {
    if (!wait) return true;
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('loader-finished');
    }
    return false;
  });
  const ref = useRef(null);

  useEffect(() => {
    if (!wait) return;

    // Check if loader is already done (class on html)
    if (document.documentElement.classList.contains('loader-finished')) {
      setLoaderDone(true);
      return;
    }

    const handleLoader = () => setLoaderDone(true);
    document.addEventListener('loader-finished', handleLoader);
    return () => document.removeEventListener('loader-finished', handleLoader);
  }, [wait]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Capture el locally — safe even if ref.current changes later
          observer.unobserve(el);
          setTimeout(() => {
            setInView(true);
          }, delay);
        }
      },
      { threshold }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold, delay]);

  const isVisible = inView && loaderDone;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : initialOpacity,
        transition: `opacity ${duration}ms ${easing}, filter ${duration}ms ${easing}`,
        filter: blur ? (isVisible ? 'blur(0px)' : 'blur(10px)') : 'none'
      }}
    >
      {children}
    </div>
  );
};

export function FadeContentJSX(props) {
  return <FadeContent {...props} />;
}

export { FadeContent };