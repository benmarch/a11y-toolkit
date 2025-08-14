import ElementList from '../domain/ElementList'
import RovingFocus from './RovingFocus'

export interface ArrowKeyNavigatorOptions {
  /** If true, enables left and right arrow keys */
  horizontal?: boolean

  /** If true, enables up and down arrow keys */
  vertical?: boolean

  /** If true, pressing the Home key navigates to the first element, and pressing the End key navigates to the last element */
  homeEnd?: boolean

  /** If true, focus will loop back around when navigating past the first or last element */
  loop?: boolean

  /** If true, enables the ArrowKeyNavigator on creation */
  isActive?: boolean
}

/**
 * Manages a list of elements inside a specific container to navigate through using
 * arrow keys. This can be done using the left and right arrows, the up and down arrows,
 * or both. Under the hood, it uses a RovingFocus to prevent tab navigation among items.
 *
 * This can be used to implement various menu-like patterns.
 *
 * Be sure to disable when done to prevent memory leaks.
 */
export default class ArrowKeyNavigator {
  container: HTMLElement
  // elements is shared by the rover so be careful modifying it directly
  elements: ElementList
  rover: RovingFocus
  options: ArrowKeyNavigatorOptions
  isActive = false

  /**
   *
   * @param container An ancestor element that contains all of the navigable elements
   * @param elements A list of elements that will be navigable via arrow keys
   * @param options
   */
  constructor(container: HTMLElement, elements: ElementList, options: ArrowKeyNavigatorOptions = {}) {
    this.container = container
    this.elements = elements
    this.rover = new RovingFocus(this.elements)

    this.options = {
      horizontal: false,
      vertical: false,
      loop: false,
      ...options,
    }

    this.handleKeyDown = this.handleKeyDown.bind(this)

    if (options.isActive) {
      this.activate()
    }
  }

  /**
   * Enables the ArrowKeyNavigator
   */
  activate() {
    this.isActive = true
    this.rover.activate()

    this.container.addEventListener('keydown', this.handleKeyDown)
  }

  /**
   * Disables and cleans up the ArrowKeyNavigator
   */
  deactivate() {
    this.isActive = false
    this.rover.deactivate()

    this.container.removeEventListener('keydown', this.handleKeyDown)
  }

  /**
   * Focuses the current element
   */
  focus() {
    this.rover.focus()
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.isActive) {
      return
    }

    switch (event.key) {
      case 'ArrowRight': {
        if (this.options.horizontal) {
          event.preventDefault()
          this.next()
        }
        break
      }
      case 'ArrowDown': {
        if (this.options.vertical) {
          event.preventDefault()
          this.next()
        }
        break
      }
      case 'ArrowLeft': {
        if (this.options.horizontal) {
          event.preventDefault()
          this.prev()
        }
        break
      }
      case 'ArrowUp': {
        if (this.options.vertical) {
          event.preventDefault()
          this.prev()
        }
        break
      }
      case 'Home': {
        if (this.options.homeEnd) {
          event.preventDefault()
          this.rover.first()
        }
        break
      }
      case 'End': {
        if (this.options.homeEnd) {
          event.preventDefault()
          this.rover.last()
        }
        break
      }
    }
  }

  private next() {
    const isLast = this.rover.index === this.elements.size - 1

    if (isLast && this.options.loop) {
      this.rover.first()
    } else {
      this.rover.next()
    }
  }

  private prev() {
    const isFirst = this.rover.index === 0

    if (isFirst && this.options.loop) {
      this.rover.last()
    } else {
      this.rover.prev()
    }
  }
}
