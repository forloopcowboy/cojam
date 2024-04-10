// Docs: https://tailwindcss.com/docs/configuration
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
        riot: ['Protest Riot', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        green: {
          DEFAULT: '#8CBB13',
          contrasted: '#FFF',

          lightest: {
            DEFAULT: '#F1F6E2',
            contrasted: '#8CBB13',
          },
          lighter: {
            DEFAULT: '#D4E5A7',
            contrasted: '#0A3B00',
          },
          light: {
            DEFAULT: '#B7D46C',
            contrasted: '#0A3B00',
          },
          dark: {
            DEFAULT: '#70A100',
            contrasted: '#FFF',
          },
          darker: {
            DEFAULT: '#0A3B00',
            contrasted: '#F1F6E2',
          },
        },

        blue: {
          DEFAULT: '#00ACC2',
          contrasted: '#FFF',

          lightest: {
            DEFAULT: '#DFF5F7',
            contrasted: '#00ACC2',
          },
          lighter: {
            DEFAULT: '#9FE0E8',
            contrasted: '#002A41',
          },
          light: {
            DEFAULT: '#40C1D1',
            contrasted: '#002A41',
          },
          dark: {
            DEFAULT: '#0090A7',
            contrasted: '#FFF',
          },
          darker: {
            DEFAULT: '#002A41',
            contrasted: '#DFF5F7',
          },
        },

        orange: {
          DEFAULT: '#F4A74F',
          contrasted: '#FFF',

          lightest: {
            DEFAULT: '#FEF4E9',
            contrasted: '#F4A74F',
          },
          lighter: {
            DEFAULT: '#FBDEBD',
            contrasted: '#752800',
          },
          light: {
            DEFAULT: '#F7BD7B',
            contrasted: '#752800',
          },
          dark: {
            DEFAULT: '#D48C37',
            contrasted: '#FFF',
          },
          darker: {
            DEFAULT: '#752800',
            contrasted: '#FEF4E9',
          },
        },

        gray: {
          50: '#FAFCFE',
          100: '#F8F9FA',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#868E96',
          700: '#495057',
          800: '#343A40',
          900: '#212529',

          DEFAULT: '#535F6B',
          contrasted: '#FFF',

          lightest: {
            DEFAULT: '#EAEBEC',
            contrasted: '#07131F',
          },
          lighter: {
            DEFAULT: '#BFC3C7',
            contrasted: '#07131F',
          },
          light: {
            DEFAULT: '#7E8790',
            contrasted: '#07131F',
          },
          dark: {
            DEFAULT: '#3B4854',
            contrasted: '#FFF',
          },
          darker: {
            DEFAULT: '#07131F',
            contrasted: '#EAEBEC',
          },
        },

        secondary: {
          pink: {
            DEFAULT: '#D63487',
            contrasted: '#FFF',

            lightest: {
              DEFAULT: '#FAE6F0',
              contrasted: '#D63487',
            },
            lighter: {
              DEFAULT: '#F0B3D2',
              contrasted: '#570008',
            },
            light: {
              DEFAULT: '#E067A5',
              contrasted: '#570008',
            },
            dark: {
              DEFAULT: '#B80870',
              contrasted: '#FFF',
            },
            darker: {
              DEFAULT: '#570008',
              contrasted: '#FFF',
            },
          },

          purple: {
            DEFAULT: '#A83A8D',
            contrasted: '#FFF',

            lightest: {
              DEFAULT: '#F4E6F1',
              contrasted: '#A83A8D',
            },
            lighter: {
              DEFAULT: '#DEB5D4',
              contrasted: '#BE6BAA',
            },
            light: {
              DEFAULT: '#BE6BAA',
              contrasted: '#BE6BAA',
            },
            dark: {
              DEFAULT: '#8A1B73',
              contrasted: '#FFF',
            },
            darker: {
              DEFAULT: '#BE6BAA',
              contrasted: '#FFF',
            },
          },

          orange: {
            DEFAULT: '#E85F25',
            contrasted: '#FFF',

            lightest: {
              DEFAULT: '#FCEBE4',
              contrasted: '#E85F25',
            },
            lighter: {
              DEFAULT: '#F6C3AD',
              contrasted: '#820000',
            },
            light: {
              DEFAULT: '#EE875C',
              contrasted: '#820000',
            },
            dark: {
              DEFAULT: '#C7430A',
              contrasted: '#FFF',
            },
            darker: {
              DEFAULT: '#820000',
              contrasted: '#FFF',
            },
          },

          red: {
            DEFAULT: '#C6243D',
            contrasted: '#FFF',

            lightest: {
              DEFAULT: '#F8E4E7',
              contrasted: '#C6243D',
            },
            lighter: {
              DEFAULT: '#EAADB6',
              contrasted: '#600000',
            },
            light: {
              DEFAULT: '#D45B6E',
              contrasted: '#600000',
            },
            dark: {
              DEFAULT: '#A50027',
              contrasted: '#FFF',
            },
            darker: {
              DEFAULT: '#600000',
              contrasted: '#FFF',
            },
          },

          green: {
            DEFAULT: '#4BB24B',
            contrasted: '#004C00',

            lightest: {
              DEFAULT: '#E9F5E9',
              contrasted: '#4BB24B',
            },
            lighter: {
              DEFAULT: '#BCE2BC',
              contrasted: '#004C00',
            },
            light: {
              DEFAULT: '#78C578',
              contrasted: '#004C00',
            },
            dark: {
              DEFAULT: '#299732',
              contrasted: '#FFF',
            },
            darker: {
              DEFAULT: '#004C00',
              contrasted: '#FFF',
            },
          },

          teal: {
            DEFAULT: '#009780',
            contrasted: '#00311A',

            lightest: {
              DEFAULT: '#DFF2EF',
              contrasted: '#009780',
            },
            lighter: {
              DEFAULT: '#9FD8CF',
              contrasted: '#00311A',
            },
            light: {
              DEFAULT: '#40B1A0',
              contrasted: '#00311A',
            },
            dark: {
              DEFAULT: '#007D68',
              contrasted: '#FFF',
            },
            darker: {
              DEFAULT: '#00311A',
              contrasted: '#FFF',
            },
          },

          blue: {
            DEFAULT: '#3384D0',
            contrasted: '#FFF',

            lightest: {
              DEFAULT: '#E5F0F9',
              contrasted: '#3384D0',
            },
            lighter: {
              DEFAULT: '#B3D1ED',
              contrasted: '#001E6A',
            },
            light: {
              DEFAULT: '#66A3DC',
              contrasted: '#001E6A',
            },
            dark: {
              DEFAULT: '#006AB3',
              contrasted: '#FFF',
            },
            darker: {
              DEFAULT: '#001E6A',
              contrasted: '#FFF',
            },
          },

          navy: {
            DEFAULT: '#344CAF',
            contrasted: '#FFF',

            lightest: {
              DEFAULT: '#E6E9F5',
              contrasted: '#344CAF',
            },
            lighter: {
              DEFAULT: '#B3BCE1',
              contrasted: '#000049',
            },
            light: {
              DEFAULT: '#6779C3',
              contrasted: '#000049',
            },
            dark: {
              DEFAULT: '#003694',
              contrasted: '#FFF',
            },
            darker: {
              DEFAULT: '#000049',
              contrasted: '#FFF',
            },
          },

          gray: {
            DEFAULT: '#868E96',
            contrasted: '#FFF',

            lightest: {
              DEFAULT: '#E9ECEF',
              contrasted: '#868E96',
            },
            lighter: {
              DEFAULT: '#CED4DA',
              contrasted: '#07131F',
            },
            light: {
              DEFAULT: '#7E8790',
              contrasted: '#07131F',
            },
            dark: {
              DEFAULT: '#3B4854',
              contrasted: '#FFF',
            },
            darker: {
              DEFAULT: '#07131F',
              contrasted: '#FFF',
            },
          },
        },

        severity: {
          important: {
            DEFAULT: '#00ACC2',
            contrasted: '#FFF',

            light: {
              DEFAULT: '#DFF5F7',
              contrasted: '#002A41',
            },

            dark: {
              DEFAULT: '#0090A7',
              contrasted: '#FFF',
            },
          },

          success: {
            DEFAULT: '#8CBB13',
            contrasted: '#FFF',

            light: {
              DEFAULT: '#F1F6E2',
              contrasted: '#0A3B00',
            },

            dark: {
              DEFAULT: '#70A100',
              contrasted: '#FFF',
            },
          },

          warning: {
            DEFAULT: '#F4A74F',
            contrasted: '#FFF',

            light: {
              DEFAULT: '#FEF4E9',
              contrasted: '#752800',
            },

            dark: {
              DEFAULT: '#D48C37',
              contrasted: '#FFF',
            },
          },

          danger: {
            DEFAULT: '#C6243D',
            contrasted: '#FFF',

            light: {
              DEFAULT: '#F8E4E7',
              contrasted: '#600000',
            },

            dark: {
              DEFAULT: '#A50027',
              contrasted: '#FFF',
            },
          },

          neutral: {
            DEFAULT: '#868E96',
            contrasted: '#FFF',

            light: {
              DEFAULT: '#7E8790',
              contrasted: '#07131F',
            },

            dark: {
              DEFAULT: '#3B4854',
              contrasted: '#FFF',
            },
          },
        },
      },
      fontSize: {
        '2xs': '0.6rem',
      },
      screens: {
        sm: '30rem',
        md: '40rem',
        lg: '64rem',
        xl: '80rem',
        '3xl': '90rem',
        '4xl': '100rem',
        '5xl': '120rem',
        tall: { raw: '(min-height: 50rem)' }, // => @media (min-height: 50rem) { ... }
      },
      maxWidth: {
        '2xs': '15rem',
        xs: '20rem',
        sm: '30rem',
        md: '40rem',
        lg: '64rem',
        xl: '80rem',
        '2xl': '90rem',
        '3xl': '100rem',
      },
      backgroundImage: {
        'border-dashed':
          "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23ADB5BD' stroke-width='2' stroke-dasharray='12%2c 12' stroke-dashoffset='6' stroke-linecap='butt'/%3e%3c/svg%3e\")",
        'border-dashed-blue':
          "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%2300ACC2' stroke-width='2' stroke-dasharray='12%2c 12' stroke-dashoffset='6' stroke-linecap='butt'/%3e%3c/svg%3e\")",
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@headlessui/tailwindcss')],
  safelist: [
    'h-screen',
    'overflow-hidden',
    'grid-rows-[0_auto_1fr]',
    {
      pattern: /((max-w)-(sm|md|lg|xl|2xl))/,
      variants: ['md'],
    },
    {
      pattern: /((rounded)-(none|sm|DEFAULT|md|lg|xl|2xl|3xl|full))/,
      variants: ['after'],
    },
  ],
};
