export default class FilterService {
  static matchesFilter(caseCheck, line, filterText) {
    return caseCheck ?
      line.text.match(filterText) || line.text === filterText :
      line.text.toLowerCase().match(filterText.toLowerCase())
      || line.text.toLowerCase() === filterText.toLowerCase();
  }
}