export default function useGobMxLinks() {
  const links = () => {
    return [
      {
        label: 'Participa',
        href: 'https://participa.gob.mx/'
      },
      {
        label: 'Publicaciones Oficiales',
        href: 'https://www.gob.mx/publicaciones'
      },
      {
        label: 'Marco Jurídico',
        href: 'http://www.ordenjuridico.gob.mx/'
      },
      {
        label: 'Plataforma Nacional de Transparencia',
        href: 'https://consultapublicamx.inai.org.mx/vut-web/'
      },
      {
        label: 'Alerta',
        href: 'https://alertadores.funcionpublica.gob.mx/'
      },
      {
        label: 'Denuncia',
        href: 'https://sidec.funcionpublica.gob.mx/'
      }
    ];
  };
  const gobmx = () => {
    return [
      {
        label: 'Portal de datos abiertos',
        href: 'https://datos.gob.mx/'
      },
      {
        label: 'Declaración de accesibilidad',
        href: 'https://www.gob.mx/accesibilidad'
      },
      {
        label: 'Aviso de privacidad integral',
        href: 'https://www.gob.mx/privacidadintegral'
      },
      {
        label: 'Términos y Condiciones',
        href: 'https://www.gob.mx/terminos'
      },
      {
        label: 'Política de seguridad',
        href: 'https://www.gob.mx/terminos#medidas-seguridad-informacion'
      },
      {
        label: 'Mapa del sitio',
        href: 'https://www.gob.mx/sitemap'
      }
    ];
  };

  return {
    links,
    gobmx
  };
}
