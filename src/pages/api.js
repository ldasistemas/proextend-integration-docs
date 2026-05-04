import React, { useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { DEFAULT_API_BASE_URL } from '../constants/api';

const CDN_URL = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference';

export default function ApiReference() {
  const { siteConfig } = useDocusaurusContext();
  const apiBaseUrl = siteConfig.customFields?.apiBaseUrl || DEFAULT_API_BASE_URL;
  const openApiUrl = `${apiBaseUrl}/proextend-integration-api.json`;
  const containerRef = useRef(null);

  useEffect(() => {
    const init = () => {
      if (!window.Scalar || !containerRef.current) return;
      containerRef.current.innerHTML = '';
      window.Scalar.createApiReference(containerRef.current, {
        url: openApiUrl,
        darkMode: true,
        hideDarkModeToggle: true,
      });
    };

    if (window.Scalar) {
      init();
    } else {
      const script = document.createElement('script');
      script.src = CDN_URL;
      script.onload = init;
      document.head.appendChild(script);
    }

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastY = 0;

    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastY && currentY > 60) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      lastY = currentY;
    };

    navbar.style.transition = 'transform 0.3s ease';
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      navbar.style.transform = '';
      navbar.style.transition = '';
    };
  }, []);

  return (
    <Layout
      title="API Reference"
      description="Referência interativa da API de Integração ProExtend"
      noFooter
      wrapperClassName="api-reference-page"
    >
      <div
        ref={containerRef}
        style={{ height: 'calc(100vh - var(--ifm-navbar-height))' }}
      />
    </Layout>
  );
}
