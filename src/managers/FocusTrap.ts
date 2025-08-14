import { createFocusTrap, type FocusTrap as TFocusTrap } from 'focus-trap'
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
  trap: TFocusTrap

  /**
   * @param container The element to trap focus within
   * @param options Options to provide to the FocusTrap
   */
  constructor(container: Elemental, { isActive = false }: FocusTrapOptions = {}) {
    if (!container) {
      throw new Error('Container Element not provided')
    }
    this.container = container

    this.trap = createFocusTrap(container as HTMLElement, {
      escapeDeactivates: false,
      clickOutsideDeactivates: false,
      returnFocusOnDeactivate: false,
    })

    if (isActive) {
      this.activate()
    }
  }

  /**
   * Enables the FocusTrap
   */
  activate() {
    this.isActive = true
    this.trap.activate()
  }

  /**
   * Disables the FocusTrap
   */
  deactivate() {
    this.isActive = false
    this.trap.deactivate()
  }  
}
