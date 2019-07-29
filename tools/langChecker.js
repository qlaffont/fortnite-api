const LangChecker = function(lang, options) {
  if (options.ignoreCheck) {
    return lang;
  } else {
    if (!lang || lang === '') {
      lang = 'en';
    }

    const languages = ['fr', 'de', 'es', 'zh', 'it', 'ja', 'en'];

    if (languages.indexOf(lang) >= 0) {
      if (options && options.langFormat && options.langFormat[lang]) {
        return options.langFormat[lang];
      } else {
        return lang;
      }
    } else {
      return false;
    }
  }
};

module.exports = LangChecker;
