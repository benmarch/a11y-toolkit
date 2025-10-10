import ElementList from '../domain/ElementList'
import { Elemental, FocusableElement } from '../domain/interfaces'
import {
  getFirstFocusableChild,
  getFirstInteractiveChild,
  getInteractiveChildren,
  getLastFocusableChild,
  getLastInteractiveChild,
  getNextInteractiveElement,
  getPreviousInteractiveElement,
} from './selectors'

/**
 * Given a container, this finds the first focusable element and focuses it.
 *
 * @param container Container element to search within
 */
export const focusFirstFocusableChild = (container: Elemental) => {
  getFirstFocusableChild(container)?.focus()
}

/**
 * Given a container, this finds the first interactive element and focuses it.
 *
 * @param container Container element to search within
 */
export const focusFirstInteractiveChild = (container: Elemental) => {
  getFirstInteractiveChild(container)?.focus()
}

/**
 * Given a container, this finds the last focusable element and focuses it.
 *
 * @param container Container element to search within
 */
export const focusLastFocusableChild = (container: Elemental) => {
  getLastFocusableChild(container)?.focus()
}

/**
 * Given a container, this finds the last interactive element and focuses it.
 *
 * @param container Container element to search within
 */
export const focusLastInteractiveChild = (container: Elemental) => {
  getLastInteractiveChild(container)?.focus()
}

/**
 * Given a container and an element within it, this finds the next interactive element and focuses it.
 *
 * @param container Container element to search within
 * @param currentElement Current element to find the next interactive element for
 */
export const focusNextInteractiveElement = (container: Elemental, currentElement: FocusableElement) => {
  getNextInteractiveElement(container, currentElement)?.focus()
}

/**
 * Given a container and an element within it, this finds the previous interactive element and focuses it.
 *
 * @param container Container element to search within
 * @param currentElement Current element to find the previous interactive element for
 */
export const focusPreviousInteractiveElement = (container: Elemental, currentElement: FocusableElement) => {
  getPreviousInteractiveElement(container, currentElement)?.focus()
}

/**
 * Deactivates tab focus of any interactive elements by setting tabindex="-1"
 *
 * @param elements A list of any element-like DOM objects
 */
export const deactivateInteractiveElements = (elements: ElementList) => {
  for (const element of elements) {
    if (element instanceof HTMLElement) {
      element.tabIndex = -1
    }
  }
}

/**
 * Given a container, this finds all interactive elements and deactivates their tab focus.
 *
 * This is useful for preventing access to elements within a container that is itself interactive.
 *
 * @param container Container element to search within
 */
export const deactivateInteractiveChildren = (container: Elemental) => {
  deactivateInteractiveElements(new ElementList(getInteractiveChildren(container)))
}
