import fs, { readdirSync } from "node:fs";
import prettyBytes from "pretty-bytes";
import { resolve, dirname } from "pathe";
import UglifyJS from "uglify-js";

// Prepare
const pkgDir = resolve(__dirname);
const libDir = resolve(pkgDir, "./lib");
try {
  fs.rmSync(libDir, { recursive: true });
} catch {
  // Ignore
}
fs.mkdirSync(libDir, { recursive: true });

// TS package info
const tsPkgPath = require.resolve("typescript/package.json");
const tsPkgDir = dirname(tsPkgPath);

// Copy license
for (const licenseFile of ["LICENSE.txt", "ThirdPartyNoticeText.txt"]) {
  console.log(`Copying ${licenseFile}...`);
  fs.copyFileSync(resolve(tsPkgDir, licenseFile), resolve(pkgDir, licenseFile));
}

// Copy lib
const libFiles = readdirSync(resolve(tsPkgDir, "./lib"), {
  withFileTypes: true,
})
  .filter((f) => !f.isDirectory())
  .map((f) => f.name);

for (const file of libFiles) {
  const filePath = resolve(tsPkgDir, "lib", file);
  const fileSize = fs.statSync(filePath).size;

  if (
    fileSize > 250_000 &&
    !file.startsWith("lib.") &&
    !file.endsWith(".d.ts")
  ) {
    console.log(`-  Minifying lib/${file} (${prettyBytes(fileSize)})`);
    const source = fs.readFileSync(filePath, "utf8");
    // https://github.com/mishoo/UglifyJS#minify-options
    const minified = UglifyJS.minify(source, {
      // mangle: false,
      // warnings: true,
      // keep_fnames: true,
      // output: {
      //   beautify: true,
      // },
    });
    if (minified.error) {
      throw minified.error;
    }
    if (minified.warnings) {
      console.log("⚠️  UglifyJS warnings:", minified.warnings.join("\n"));
    }
    console.log(
      `\u001B[1A-  Copied lib/${file} (Minified from ${prettyBytes(
        fileSize,
      )} to ${prettyBytes(minified.code.length)} 💾)`,
    );
    fs.writeFileSync(resolve(libDir, file), minified.code);
  } else {
    console.log(
      `-  Copying lib/${file} (${prettyBytes(fileSize)}${
        fileSize > 250_000 ? " 🤯" : ""
      })`,
    );
    fs.copyFileSync(filePath, resolve(libDir, file));
  }
}
