import ElementList from '../domain/ElementList'

export interface RovingFocusOptions {
  /** If true, enables the RovingFocus immediately upon creation */
  isActive?: boolean
}

/**
 * Implements a Roving Focus or Roving Tab Index pattern: https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Keyboard-navigable_JavaScript_widgets#technique_1_roving_tabindex
 * 
 * Ensures the only one of the provided elements can be tab-focused at any given time.
 * The other elements will be deactivated from tabbing by setting tabindex="-1".
 * 
 * The focused element can be changed by calling the `focus()` method with the index of the element
 * to focus, or by calling `next()` or `prev()` to cycle.
 * 
 * This is useful for implementing group-like patterns where only one element in a group should be focusable at a time.
 */
export default class RovingFocus {
  elements: ElementList
  isActive: boolean = false
  index = 0

  constructor(elements: ElementList, { isActive = false }: RovingFocusOptions = {}) {
    this.elements = elements

    if (isActive) {
      this.activate()
    }
  }

  next() {
    if (this.index < this.elements.size) {
      this.focus(this.index + 1)
    }
  }

  prev() {
    if (this.index > 0) {
      this.focus(this.index - 1)
    }
  }

  first() {
    this.focus(0)
  }

  last() {
    this.focus(this.elements.size - 1)
  }

  focus(index?: number) {
    if (typeof index === 'number') {
      // if index out of bounds then bail
      if (index < 0 || index >= this.elements.size) {
        return
      }

      // update stored index
      this.index = index
    }

    this.activate(true)
  }

  activate(shouldFocusActive: boolean = false) {
    this.isActive = true

    // iterate through each element
    let i = -1
    for (const element of this.elements) {
      // increment
      i++

      // if the elemental is not focusable then continue
      if (!('tabIndex' in element)) {
        continue
      }

      // find the active element and focus it
      if (this.index === i) {
        element.tabIndex = 0
        if (shouldFocusActive) {
          element.focus()
        }
      } else {
        // unfocus the other elements
        element.tabIndex = -1
      }
    }
  }

  deactivate() {
    this.isActive = false
    this.index = 0

    for (const element of this.elements) {
      // if the elemental is not focusable then continue
      if (!('tabIndex' in element)) {
        continue
      }

      element.removeAttribute('tabindex')
    }
  }
}
