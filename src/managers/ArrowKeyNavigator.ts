import ElementList from "../domain/ElementList";
import RovingFocus from "./RovingFocus";

export interface ArrowKeyNavigatorOptions {
  horizontal?: boolean
  vertical?: boolean
  loop?: boolean
}

export default class ArrowKeyNavigator {
  container: HTMLElement
  // elements is shared by the rover so be careful modifying it directly
  elements: ElementList
  rover: RovingFocus
  options: ArrowKeyNavigatorOptions
  isActive = false

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
  }

  activate() {
    this.isActive = true
    this.rover.focus()

    this.container.addEventListener('keydown', this.handleKeyDown)
  }

  deactivate() {
    this.isActive = false
    this.rover.reset()

    this.container.removeEventListener('keydown', this.handleKeyDown)
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.isActive) {
      return
    }

    switch (event.key) {
      case 'ArrowRight': {
        if (this.options.horizontal) {
          this.next()
        }
        break
      }
      case 'ArrowDown': {
        if (this.options.vertical) {
          this.next()
        }
        break
      }
      case 'ArrowLeft': {
        if (this.options.horizontal) {
          this.prev()
        }
        break
      }
      case 'ArrowUp': {
        if (this.options.vertical) {
          this.prev()
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