import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  from: 'src/index.css',
  to: 'src/out.css',
  plugins: [
    tailwindcss,
    autoprefixer
  ],
}
