// תצורת מערכת הבנייה (Eleventy):
// התוכן שעמית עורכת יושב בקבצי JSON בתיקיית content,
// והתבניות (njk) מזריקות אותו לתוך ה-HTML — כך העיצוב נשאר קבוע
// והטקסטים והתמונות ניתנים לעריכה מהפאנל.
module.exports = function (eleventyConfig) {
  // קבצים סטטיים שמועתקים כמו שהם לאתר הבנוי
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("print");

  // עריכת תוכן מפעילה בנייה מחדש בזמן פיתוח
  eleventyConfig.addWatchTarget("content/");

  // שורות מרובות בשדה טקסט הופכות לירידת שורה בעמוד
  eleventyConfig.addFilter("nl2br", (value) =>
    String(value ?? "").replace(/\n/g, "<br>")
  );

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "content",
    },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
};
