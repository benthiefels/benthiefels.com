const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("logos");
  eleventyConfig.addPassthroughCopy("photos");
  eleventyConfig.addPassthroughCopy("Headshot.jpg");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("admin");

  // Read individual content section files
  eleventyConfig.addGlobalData("general", () => readJson("content/general.json"));
  eleventyConfig.addGlobalData("hero", () => readJson("content/hero.json"));
  eleventyConfig.addGlobalData("about", () => readJson("content/about.json"));
  eleventyConfig.addGlobalData("icp", () => readJson("content/icp.json"));
  eleventyConfig.addGlobalData("services", () => readJson("content/services.json"));
  eleventyConfig.addGlobalData("engagementsHeader", () => readJson("content/engagements-header.json"));
  eleventyConfig.addGlobalData("testimonialsHeader", () => readJson("content/testimonials-header.json"));
  eleventyConfig.addGlobalData("workHeader", () => readJson("content/work-header.json"));
  eleventyConfig.addGlobalData("cta", () => readJson("content/cta.json"));
  eleventyConfig.addGlobalData("footerData", () => readJson("content/footer.json"));
  eleventyConfig.addGlobalData("logos", () => {
    const data = readJson("content/logos.json");
    return data.items || data;
  });

  // Read collections from folders
  eleventyConfig.addGlobalData("testimonials", () => readJsonFolder("content/testimonials"));
  eleventyConfig.addGlobalData("workItems", () => readJsonFolder("content/work"));
  eleventyConfig.addGlobalData("engagementCards", () => readJsonFolder("content/engagements"));

  // Nunjucks filter: split string by separator
  eleventyConfig.addNunjucksFilter("split", (str, sep) => {
    if (!str) return [];
    return str.split(sep || "\n").filter(s => s.trim());
  });

  // Strip markdown paragraph tags for inline use
  eleventyConfig.addNunjucksFilter("stripP", (str) => {
    if (!str) return '';
    return str.replace(/<\/?p>/g, '');
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes" },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk"
  };
};

function readJson(filepath) {
  const full = path.join(__dirname, filepath);
  if (!fs.existsSync(full)) return {};
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}

function readJsonFolder(folder) {
  const dir = path.join(__dirname, folder);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}
