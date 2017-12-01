class Data {
  constructor(content) {
    this.stat = toCamel(content.label);
    this.value = content.value;
  }
}

const toCamel = str => str.split(' ').map((w, i) => i === 0
  ? w.toLowerCase()
  : w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');

module.exports = Data;
