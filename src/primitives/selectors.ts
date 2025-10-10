import { focusable, tabbable } from 'tabbable'
import ElementList from '../domain/ElementList'
import { Elemental, FocusableElement } from '../domain/interfaces'

/**
 * Searches for all focusable elements inside a given container element.
 * Will return an array of HTMLElement unless the container is not a valid Element.
 *
 * @param container Container element to search within
 * @returns All focusable elements inside the container
 */
export const getFocusableChildren = (container: Elemental): FocusableElement[] | null => {
  if (!('querySelectorAll' in container)) {
    return null
  }

  return focusable(container)
}

/**
 * Searches for all interactive elements inside a given container element.
 * Will return an array of HTMLElement unless the container is not a valid Element.
 *
 * @param container Container element to search within
 * @returns All interactive elements inside the container
 */
export const getInteractiveChildren = (container: Elemental): FocusableElement[] | null => {
  if (!('querySelectorAll' in container)) {
    return null
  }

  return tabbable(container)
}

/**
 * Searches within a given container and returns the first focusable element.
 *
 * @param container Container element to search within
 * @returns The first focusable element within the container or null
 */
export const getFirstFocusableChild = (container: Elemental): FocusableElement | null => {
  return getFocusableChildren(container)?.[0] ?? null
}

/**
 * Searches within a given container and returns the first interactive element.
 *
 * @param container Container element to search within
 * @returns The first interactive element within the container or null
 */
export const getFirstInteractiveChild = (container: Elemental): FocusableElement | null => {
  return getInteractiveChildren(container)?.[0] ?? null
}

/**
 * Searches within a given container and returns the last focusable element.
 *
 * @param container Container element to search within
 * @returns The last focusable element within the container or null
 */
export const getLastFocusableChild = (container: Elemental): FocusableElement | null => {
  const elements = getFocusableChildren(container) ?? []

  return elements[elements.length - 1] || null
}

/**
 * Searches within a given container and returns the last interactive element.
 *
 * @param container Container element to search within
 * @returns The last interactive element within the container or null
 */
export const getLastInteractiveChild = (container: Elemental): FocusableElement | null => {
  const elements = getInteractiveChildren(container) ?? []

  return elements[elements.length - 1] || null
}

/**
 * Searches within a given container and returns the next interactive element.
 *
 * @param container Container element to search within
 * @param currentElement The current element, will return the one after
 * @returns The next interactive element after the current element within the container or null
 */
export const getNextInteractiveElement = (
  container: Elemental,
  currentElement: FocusableElement,
): FocusableElement | null => {
  const elements = getInteractiveChildren(container)

  if (!elements) {
    return null
  }

  const index = elements.indexOf(currentElement)

  if (index === -1 || index === elements.length - 1) {
    return null
  }

  return elements[index + 1]
}

/**
 * Searches within a given container and returns the previous interactive element.
 *
 * @param container Container element to search within
 * @param currentElement The current element, will return the one before
 * @returns The previous interactive element before the current element within the container or null
 */
export const getPreviousInteractiveElement = (
  container: Elemental,
  currentElement: FocusableElement,
): FocusableElement | null => {
  const elements = getInteractiveChildren(container)

  if (!elements) {
    return null
  }

  const index = elements.indexOf(currentElement)

  if (index === -1 || index === 0) {
    return null
  }

  return elements[index - 1]
}

export const getDOMOrder = (container: Elemental, elements: ElementList) => {
  if (!container || !(container instanceof Element)) {
    return elements
  }

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT)
  const newElements = new ElementList()

  while (walker.nextNode()) {
    const node = walker.currentNode as Elemental
    if (elements.has(node)) {
      newElements.add(node)
    }
  }

  return newElements
}
