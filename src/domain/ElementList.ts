import { Elemental } from './interfaces'

/**
 * Represents a list of element-like objects. This can be used as a shared memory
 * among Managers so that the consumer has full control at all times.
 *
 * It is essentially a Set with an O(1) lookup for elements.
 */
export default class ElementList extends Set<Elemental> {
  elements: Elemental[]

  /**
   * @param elements An optional list of Elemental to initialize the list with
   */
  constructor(elements?: Iterable<Elemental> | null) {
    super()
    this.elements = []

    if (elements) {
      for (const element of elements) {
        this.add(element)
      }
    }
  }

  /**
   * Gets an element at the specified index.
   *
   * @param index The index of the element to retrieve.
   * @returns The element at the specified index, or undefined if the index is out of bounds.
   */
  get(index: number) {
    return this.elements[index]
  }

  /**
   * Adds an Elemental to the ElementList.
   *
   * @param element The Elemental to add.
   * @returns The ElementList instance.
   */
  add(element: Elemental) {
    if (!this.has(element)) {
      super.add(element)
      this.elements.push(element)
    }

    return this
  }

  /**
   * Deletes an Elemental from the ElementList.
   *
   * @param element The Elemental to delete.
   * @returns True if the element was deleted, false otherwise.
   */
  delete(element: Elemental) {
    if (super.delete(element)) {
      this.elements.splice(this.elements.indexOf(element), 1)

      return true
    }

    return false
  }

  /**
   * Clears all elements from the ElementList.
   */
  clear() {
    super.clear()
    this.elements = []
  }

  /**
   * Converts the ElementList to an array.
   *
   * @returns An array of the elements in the ElementList.
   */
  asArray() {
    return [...this.elements]
  }
}
