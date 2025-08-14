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