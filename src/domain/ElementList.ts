import { Elemental } from './interfaces'

/**
 * Represents a list of element-like objects. This can be used as a shared memory
 * among Managers so that the consumer has full control at all times.
 *
 * It is essentially a Set with an O(1) lookup for elements.
 */
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
      this.elements.splice(this.elements.indexOf(element), 1)

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
