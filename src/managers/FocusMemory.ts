import { Elemental } from '../domain/interfaces'

/**
 * Stores any element-like DOM object for later
 */
export default class FocusMemory {
  savedElement?: Elemental | null

  /**
   * Stores a provided element or the currently focused one
   */
  set(element: Elemental | null = document.activeElement) {
    this.savedElement = element
  }

  /**
   * Returns the stored element
   */
  get() {
    return this.savedElement
  }

  /**
   * Removes the element from storage
   */
  clear() {
    this.savedElement = null
  }
}