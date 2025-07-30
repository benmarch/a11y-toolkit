import ElementList from '../domain/ElementList'
import { Elemental } from '../domain/interfaces'
import { getFirstFocusable, getFirstInteractive, getInteractiveChildren } from './selectors'

export const focusFirstFocusableChild = (container: Elemental) => {
  getFirstFocusable(container)?.focus()
}

export const focusFirstInteractiveChild = (container: Elemental) => {
  getFirstInteractive(container)?.focus()
}

export const deactivateInteractiveElements = (elements: ElementList) => {
  for (const element of elements) {
    if (element instanceof HTMLElement) {
      element.tabIndex = -1
    }
  }
}

export const deactivateInteractiveChildren = (container: Elemental) => {
  deactivateInteractiveElements(new ElementList(getInteractiveChildren(container)))
}
