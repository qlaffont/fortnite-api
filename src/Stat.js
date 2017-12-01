class Stat {
  constructor(content) {
    this.stat = toCamel(content.Key);
    this.value = content.Value;
  }
}

const toCamel = str => str.split(' ').map((w, i) => i === 0
  ? w.toLowerCase()
  : w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');

module.exports = Stat;
