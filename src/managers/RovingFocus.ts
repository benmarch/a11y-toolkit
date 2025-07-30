import ElementList from '../domain/ElementList'

export default class RovingFocus {
  elements: ElementList
  index = 0

  constructor(elements: ElementList) {
    this.elements = elements
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
        element.focus()
      } else {
        // unfocus the other elements
        element.tabIndex = -1
      }
    }
  }

  reset() {
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
