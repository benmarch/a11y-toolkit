import FocusMemory from './FocusMemory'
import { getFirstFocusable, getLastFocusable } from '../primitives/selectors'

export default class FocusTrap {
  containerElement: Element
  isActive: boolean = false
  focusMemory = new FocusMemory()
  direction: 1 | -1 = 1

  constructor(containerElement: Element, isActive: boolean = false) {
    if (!containerElement) {
      throw new Error('Container Element not provided')
    }
    this.containerElement = containerElement

    this.handleFocus = this.handleFocus.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)

    if (isActive) {
      this.activate()
    }
  }

  activate() {
    this.isActive = true
    this.focusNext()
    
    window.addEventListener('focus', this.handleFocus, true)
    window.addEventListener('keydown', this.handleKeyDown, true)
  }

  deactivate() {
    this.isActive = false

    window.removeEventListener('focus', this.handleFocus, true)
    window.removeEventListener('keydown', this.handleKeyDown, true)
  }

  private handleFocus(event: Event) {
    if (event.target) {
      if (this.containerElement?.contains(event.target as Node)) {
        this.focusMemory.set(event.target)
      } else {
        this.focusNext()
      }
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      this.direction = event.shiftKey ? -1 : 1

      if (this.direction === 1 && this.focusMemory.get() === getLastFocusable(this.containerElement)) {
        getFirstFocusable(this.containerElement)?.focus()
        event.preventDefault()
      } else if (this.direction === -1 && this.focusMemory.get() === getFirstFocusable(this.containerElement)) {
        getLastFocusable(this.containerElement)?.focus()
        event.preventDefault()
      }
    }
  }

  private focusNext() {
    if (this.direction === 1) {
      getFirstFocusable(this.containerElement)?.focus()
    } else {
      getLastFocusable(this.containerElement)?.focus()
    }
  }
}
