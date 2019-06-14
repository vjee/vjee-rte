import { version } from "./package.json";
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

const isProduction = process.env.NODE_ENV === "production";

const input = "src/index.js";

const name = "vjeeRTE";

const banner = `/**
 * @vjee/rte v${version}
 * (c) 2019-${new Date().getFullYear()} vjee
 * Released under the MIT License.
 */`;

const terserOptions = {
  output: {
    comments: function(node, comment) {
      return /@vjee/i.test(comment.value);
    }
  }
};

export default (async () => {
  const config = [];

  config.push({
    input,
    output: {
      banner,
      name,
      file: "dist/rte.esm.js",
      format: "esm"
    },
    plugins: [resolve()]
  });

  if (isProduction) {
    config.push({
      input,
      output: {
        banner,
        name,
        file: "dist/rte.esm.min.js",
        format: "esm"
      },
      plugins: [resolve(), terser(terserOptions)]
    });
  }

  config.push({
    input,
    output: {
      banner,
      name,
      file: "dist/rte.umd.js",
      format: "umd"
    },
    plugins: [resolve()]
  });

  if (isProduction) {
    config.push({
      input,
      output: {
        banner,
        name,
        file: "dist/rte.umd.min.js",
        format: "umd"
      },
      plugins: [resolve(), terser(terserOptions)]
    });
  }

  config.push({
    input: "src/index.css",
    output: {
      format: "esm",
      file: "dist/rte.js"
    },
    plugins: [
      postcss({
        extract: true,
        plugins: [autoprefixer(), cssnano()]
      })
    ]
  });

  return config;
})();
