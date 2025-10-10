import { isFocusable as tabbableIsFocusable, isTabbable } from 'tabbable'
import { Elemental } from '../domain/interfaces'

/**
 * Determines as best as possible whether a given element can hold focus. This is
 * different than any element with a `focus()` method as most elements will do nothing
 * interesting when `focus()` is called. This is to determine if `focus()` is worth calling.
 *
 * @param element An element to check whether it is focusable
 * @returns boolean
 */
export const isFocusable = (element: Elemental) => {
  if (!(element instanceof Element)) {
    return false
  }

  return tabbableIsFocusable(element)
}

/**
 * Determines whether a given element is interactive.
 *
 * @param element An element to check whether it is interactive
 * @returns boolean
 */
export const isInteractive = (element: Elemental) => {
  if (!(element instanceof Element)) {
    return false
  }

  return isTabbable(element)
}

export const isDescendentOf = (container: Element, target: Elemental) => {
  if (!(container instanceof Element) || !(target instanceof Element)) {
    return false
  }

  return container.contains(target)
}
