module.exports = {
  purge: ['src/pages/**/*.{js,ts,jsx,tsx}', 'src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontSize: {
      'xs': '.75rem',
      'sm': '.875rem',
      'tiny': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
      'xs-asset': '0.6rem',
      'sm-asset': '0.8rem'
    },
    minWidth: {
      'img-small': '2rem',
    },
    maxWidth: {
      'img-small': '2rem',
      'td': '6rem',
    },
    maxHeight: {
      'img-small': '2rem',
    },
    extend: {
      top: {
        '15': '3.75rem'
      },
      width: {
        'asset': '13.5rem',
        'sharepopup': '42rem',
      },
      height: {
        'tab':'1.625rem',
        'asset': '23rem',
      },
      lineHeight: {
        'tab': '1.625rem',
      },
      zIndex: {
        '-10': '-10',
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
        'spacing': 'margin, padding',
      },
      backgroundImage: theme => ({
        'collection-card': "url('/collection_card/Main.svg')"
      })
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
