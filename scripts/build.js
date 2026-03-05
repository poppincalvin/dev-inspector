#!/usr/bin/env node
const { minify } = require("terser");
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "src", "dev-inspector.js");
const DIST = path.join(__dirname, "..", "dist");
const OUT_MIN = path.join(DIST, "dev-inspector.min.js");
const OUT_BM = path.join(DIST, "bookmarklet.txt");

async function build() {
  // Ensure dist directory exists
  fs.mkdirSync(DIST, { recursive: true });

  const source = fs.readFileSync(SRC, "utf-8");
  const srcSize = Buffer.byteLength(source, "utf-8");

  // Minify
  const result = await minify(source, {
    compress: {
      passes: 2,
      drop_console: false,
      pure_getters: true,
    },
    mangle: {
      reserved: ["__devInspector"],
    },
    output: {
      comments: false,
    },
  });

  if (result.error) {
    console.error("Minification failed:", result.error);
    process.exit(1);
  }

  const minified = result.code;
  const minSize = Buffer.byteLength(minified, "utf-8");

  // Write minified file
  fs.writeFileSync(OUT_MIN, minified, "utf-8");

  // Generate bookmarklet URL
  const bookmarklet = "javascript:" + encodeURIComponent(minified);
  const bmSize = Buffer.byteLength(bookmarklet, "utf-8");
  fs.writeFileSync(OUT_BM, bookmarklet, "utf-8");

  // Print stats
  console.log("\n  DevInspector Build\n");
  console.log(`  Source:      ${(srcSize / 1024).toFixed(1)} KB`);
  console.log(
    `  Minified:    ${(minSize / 1024).toFixed(1)} KB  (${((1 - minSize / srcSize) * 100).toFixed(0)}% smaller)`,
  );
  console.log(`  Bookmarklet: ${(bmSize / 1024).toFixed(1)} KB`);
  console.log(`\n  dist/dev-inspector.min.js`);
  console.log(`  dist/bookmarklet.txt\n`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
