import { Elemental } from '../domain/interfaces'

export default class FocusMemory {
  savedElement?: Elemental | null

  set(element: Elemental | null = document.activeElement) {
    this.savedElement = element
  }

  get() {
    return this.savedElement
  }
}