/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'Primario' : '#002252',
        'Secundario' : '#49DEB2',
        'Destacado' : '#CCD600',
        'TextoNegro' : '#3B3D40',
        'TextoGris' : '#666666',
        'TextoBlanco' : '#ffffff'
      },
      screens: {
        'lg':'1023px',
        'tablet' : '769px',
        'sm':'1250px',
        'telefono' : '320px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animated')
  ],
}

