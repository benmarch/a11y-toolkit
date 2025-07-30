import { BasicElement } from '../domain/interfaces'

export default class FocusMemory {
  savedElement?: BasicElement | null

  set(element: BasicElement | null = document.activeElement) {
    this.savedElement = element
  }

  get() {
    return this.savedElement
  }
}