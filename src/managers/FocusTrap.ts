import FocusMemory from './FocusMemory'
import { getFirstFocusableChild, getLastFocusableChild } from '../primitives/selectors'
import { Elemental } from '../domain/interfaces'

export interface FocusTrapOptions {
  /** If true, enables the FocusTrap immediately upon creation */
  isActive?: boolean
}

/**
 * Ensures that the user can only focus on elements within a specified container ("trap").
 * 
 * When enabled, the user will not be able to interact with elements outside the trap.
 * 
 * Be sure to disable when done to prevent memory leaks.
 */
export default class FocusTrap {
  container: Elemental
  isActive: boolean = false
  focusMemory = new FocusMemory()
  direction: 1 | -1 = 1

  /**
   * @param container The element to trap focus within
   * @param options Options to provide to the FocusTrap 
   */
  constructor(container: Elemental, { isActive = false }: FocusTrapOptions = {}) {
    if (!container) {
      throw new Error('Container Element not provided')
    }
    this.container = container

    this.handleFocus = this.handleFocus.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)

    if (isActive) {
      this.activate()
    }
  }

  /**
   * Enables the FocusTrap
   */
  activate() {
    this.isActive = true
    this.focusNext()

    window.addEventListener('focus', this.handleFocus, true)
    window.addEventListener('keydown', this.handleKeyDown, true)
  }

  /**
   * Disables the FocusTrap
   */
  deactivate() {
    this.isActive = false

    window.removeEventListener('focus', this.handleFocus, true)
    window.removeEventListener('keydown', this.handleKeyDown, true)
  }

  private handleFocus(event: Event) {
    if (event.target && this.container instanceof HTMLElement) {
      if (this.container?.contains(event.target as Node)) {
        this.focusMemory.set(event.target)
      } else {
        this.focusNext()
      }
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      this.direction = event.shiftKey ? -1 : 1
    }
  }

  private focusNext() {
    if (this.direction === 1) {
      getFirstFocusableChild(this.container)?.focus()
    } else {
      getLastFocusableChild(this.container)?.focus()
    }
  }
}
