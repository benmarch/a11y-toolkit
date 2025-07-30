import { Elemental } from "./interfaces";

export default class ElementList extends Set<Elemental> {
  elements: Elemental[]

  constructor(elements?: Iterable<Elemental> | null) {
    super()
    this.elements = []

    if (elements) {
      for (const element of elements) {
        this.add(element)        
      }
    }
  }

  get(index: number) {
    return this.elements[index]
  }

  add(element: Elemental) {
    if (!this.has(element)) {
      super.add(element)
      this.elements.push(element)
    }

    return this
  }

  delete(element: Elemental) {
    if (super.delete(element)) {
      const index = this.elements.indexOf(element)

      if (index > -1) {
        this.elements.splice(index, 1)
      }

      return true
    }

    return false
  }

  clear() {
    super.clear()
    this.elements = []
  }

  asArray() {
    return [...this.elements]
  }
}