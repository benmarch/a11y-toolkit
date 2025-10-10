import {
  getFocusableChildren,
  getInteractiveChildren,
  getFirstFocusableChild,
  getFirstInteractiveChild,
  getLastFocusableChild,
  getLastInteractiveChild,
  getNextInteractiveElement,
  getPreviousInteractiveElement,
  getDOMOrder,
} from '../selectors'
import { focusable, tabbable } from 'tabbable'
import ElementList from '../../domain/ElementList'

// Mock tabbable functions
jest.mock('tabbable', () => ({
  focusable: jest.fn(),
  tabbable: jest.fn(),
}))

const mockFocusable = focusable as jest.MockedFunction<typeof focusable>
const mockTabbable = tabbable as jest.MockedFunction<typeof tabbable>

describe('selectors', () => {
  let container: HTMLElement
  let element1: HTMLElement
  let element2: HTMLElement
  let element3: HTMLElement
  let nonElementContainer: EventTarget

  beforeEach(() => {
    container = document.createElement('div')
    element1 = document.createElement('button')
    element2 = document.createElement('input')
    element3 = document.createElement('a')
    nonElementContainer = new EventTarget()

    // Clear all mocks
    jest.clearAllMocks()
  })

  describe('getFocusableChildren', () => {
    it('should return focusable elements from tabbable library', () => {
      const focusableElements = [element1, element2, element3]
      mockFocusable.mockReturnValue(focusableElements)

      const result = getFocusableChildren(container)

      expect(mockFocusable).toHaveBeenCalledWith(container)
      expect(result).toBe(focusableElements)
    })

    it('should return empty array when no focusable elements found', () => {
      mockFocusable.mockReturnValue([])

      const result = getFocusableChildren(container)

      expect(mockFocusable).toHaveBeenCalledWith(container)
      expect(result).toEqual([])
    })

    it('should return null for non-Element containers', () => {
      const result = getFocusableChildren(nonElementContainer)

      expect(result).toBeNull()
      expect(mockFocusable).not.toHaveBeenCalled()
    })

    it('should work with different element types', () => {
      const svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      const focusableElements = [element1]
      mockFocusable.mockReturnValue(focusableElements)

      const result = getFocusableChildren(svgContainer)

      expect(mockFocusable).toHaveBeenCalledWith(svgContainer)
      expect(result).toBe(focusableElements)
    })
  })

  describe('getInteractiveChildren', () => {
    it('should return interactive elements from tabbable library', () => {
      const interactiveElements = [element1, element2]
      mockTabbable.mockReturnValue(interactiveElements)

      const result = getInteractiveChildren(container)

      expect(mockTabbable).toHaveBeenCalledWith(container)
      expect(result).toBe(interactiveElements)
    })

    it('should return empty array when no interactive elements found', () => {
      mockTabbable.mockReturnValue([])

      const result = getInteractiveChildren(container)

      expect(mockTabbable).toHaveBeenCalledWith(container)
      expect(result).toEqual([])
    })

    it('should return null for non-Element containers', () => {
      const result = getInteractiveChildren(nonElementContainer)

      expect(result).toBeNull()
      expect(mockTabbable).not.toHaveBeenCalled()
    })

    it('should work with different element types', () => {
      const divContainer = document.createElement('div')
      const interactiveElements = [element2, element3]
      mockTabbable.mockReturnValue(interactiveElements)

      const result = getInteractiveChildren(divContainer)

      expect(mockTabbable).toHaveBeenCalledWith(divContainer)
      expect(result).toBe(interactiveElements)
    })
  })

  describe('getFirstFocusableChild', () => {
    it('should return first focusable element when elements exist', () => {
      mockFocusable.mockReturnValue([element1, element2, element3])

      const result = getFirstFocusableChild(container)

      expect(result).toBe(element1)
      expect(mockFocusable).toHaveBeenCalledWith(container)
    })

    it('should return null when no focusable elements found', () => {
      mockFocusable.mockReturnValue([])

      const result = getFirstFocusableChild(container)

      expect(result).toBeNull()
      expect(mockFocusable).toHaveBeenCalledWith(container)
    })

    it('should return null for non-Element containers', () => {
      const result = getFirstFocusableChild(nonElementContainer)

      expect(result).toBeNull()
      expect(mockFocusable).not.toHaveBeenCalled()
    })

    it('should handle null return from getFocusableChildren', () => {
      // This happens when container doesn't have querySelectorAll
      const result = getFirstFocusableChild(nonElementContainer)

      expect(result).toBeNull()
    })
  })

  describe('getFirstInteractiveChild', () => {
    it('should return first interactive element when elements exist', () => {
      mockTabbable.mockReturnValue([element2, element1, element3])

      const result = getFirstInteractiveChild(container)

      expect(result).toBe(element2)
      expect(mockTabbable).toHaveBeenCalledWith(container)
    })

    it('should return null when no interactive elements found', () => {
      mockTabbable.mockReturnValue([])

      const result = getFirstInteractiveChild(container)

      expect(result).toBeNull()
      expect(mockTabbable).toHaveBeenCalledWith(container)
    })

    it('should return null for non-Element containers', () => {
      const result = getFirstInteractiveChild(nonElementContainer)

      expect(result).toBeNull()
      expect(mockTabbable).not.toHaveBeenCalled()
    })

    it('should handle null return from getInteractiveChildren', () => {
      const result = getFirstInteractiveChild(nonElementContainer)

      expect(result).toBeNull()
    })
  })

  describe('getLastFocusableChild', () => {
    it('should return last focusable element when elements exist', () => {
      mockFocusable.mockReturnValue([element1, element2, element3])

      const result = getLastFocusableChild(container)

      expect(result).toBe(element3)
      expect(mockFocusable).toHaveBeenCalledWith(container)
    })

    it('should return null when no focusable elements found', () => {
      mockFocusable.mockReturnValue([])

      const result = getLastFocusableChild(container)

      expect(result).toBeNull()
      expect(mockFocusable).toHaveBeenCalledWith(container)
    })

    it('should return null for non-Element containers', () => {
      const result = getLastFocusableChild(nonElementContainer)

      expect(result).toBeNull()
      expect(mockFocusable).not.toHaveBeenCalled()
    })

    it('should handle single element array', () => {
      mockFocusable.mockReturnValue([element1])

      const result = getLastFocusableChild(container)

      expect(result).toBe(element1)
    })

    it('should handle null return from getFocusableChildren', () => {
      const result = getLastFocusableChild(nonElementContainer)

      expect(result).toBeNull()
    })
  })

  describe('getLastInteractiveChild', () => {
    it('should return last interactive element when elements exist', () => {
      mockTabbable.mockReturnValue([element1, element2, element3])

      const result = getLastInteractiveChild(container)

      expect(result).toBe(element3)
      expect(mockTabbable).toHaveBeenCalledWith(container)
    })

    it('should return null when no interactive elements found', () => {
      mockTabbable.mockReturnValue([])

      const result = getLastInteractiveChild(container)

      expect(result).toBeNull()
      expect(mockTabbable).toHaveBeenCalledWith(container)
    })

    it('should return null for non-Element containers', () => {
      const result = getLastInteractiveChild(nonElementContainer)

      expect(result).toBeNull()
      expect(mockTabbable).not.toHaveBeenCalled()
    })

    it('should handle single element array', () => {
      mockTabbable.mockReturnValue([element2])

      const result = getLastInteractiveChild(container)

      expect(result).toBe(element2)
    })

    it('should handle null return from getInteractiveChildren', () => {
      const result = getLastInteractiveChild(nonElementContainer)

      expect(result).toBeNull()
    })
  })

  describe('getNextInteractiveElement', () => {
    it('should return next interactive element when found', () => {
      mockTabbable.mockReturnValue([element1, element2, element3])

      const result = getNextInteractiveElement(container, element1)

      expect(result).toBe(element2)
      expect(mockTabbable).toHaveBeenCalledWith(container)
    })

    it('should return next element from middle of array', () => {
      mockTabbable.mockReturnValue([element1, element2, element3])

      const result = getNextInteractiveElement(container, element2)

      expect(result).toBe(element3)
      expect(mockTabbable).toHaveBeenCalledWith(container)
    })

    it('should return null when current element is last', () => {
      mockTabbable.mockReturnValue([element1, element2, element3])

      const result = getNextInteractiveElement(container, element3)

      expect(result).toBeNull()
      expect(mockTabbable).toHaveBeenCalledWith(container)
    })

    it('should return null when current element is not found', () => {
      const outsideElement = document.createElement('span')
      mockTabbable.mockReturnValue([element1, element2])

      const result = getNextInteractiveElement(container, outsideElement)

      expect(result).toBeNull()
      expect(mockTabbable).toHaveBeenCalledWith(container)
    })

    it('should return null when no interactive elements found', () => {
      mockTabbable.mockReturnValue([])

      const result = getNextInteractiveElement(container, element1)

      expect(result).toBeNull()
      expect(mockTabbable).toHaveBeenCalledWith(container)
    })

    it('should return null for non-Element containers', () => {
      const result = getNextInteractiveElement(nonElementContainer, element1)

      expect(result).toBeNull()
      expect(mockTabbable).not.toHaveBeenCalled()
    })

    it('should handle single element array', () => {
      mockTabbable.mockReturnValue([element1])

      const result = getNextInteractiveElement(container, element1)

      expect(result).toBeNull()
    })
  })

  describe('getPreviousInteractiveElement', () => {
    it('should return previous interactive element when found', () => {
      mockTabbable.mockReturnValue([element1, element2, element3])

      const result = getPreviousInteractiveElement(container, element3)

      expect(result).toBe(element2)
      expect(mockTabbable).toHaveBeenCalledWith(container)
    })

    it('should return previous element from middle of array', () => {
      mockTabbable.mockReturnValue([element1, element2, element3])

      const result = getPreviousInteractiveElement(container, element2)

      expect(result).toBe(element1)
      expect(mockTabbable).toHaveBeenCalledWith(container)
    })

    it('should return null when current element is first', () => {
      mockTabbable.mockReturnValue([element1, element2, element3])

      const result = getPreviousInteractiveElement(container, element1)

      expect(result).toBeNull()
      expect(mockTabbable).toHaveBeenCalledWith(container)
    })

    it('should return null when current element is not found', () => {
      const outsideElement = document.createElement('span')
      mockTabbable.mockReturnValue([element1, element2])

      const result = getPreviousInteractiveElement(container, outsideElement)

      expect(result).toBeNull()
      expect(mockTabbable).toHaveBeenCalledWith(container)
    })

    it('should return null when no interactive elements found', () => {
      mockTabbable.mockReturnValue([])

      const result = getPreviousInteractiveElement(container, element1)

      expect(result).toBeNull()
      expect(mockTabbable).toHaveBeenCalledWith(container)
    })

    it('should return null for non-Element containers', () => {
      const result = getPreviousInteractiveElement(nonElementContainer, element1)

      expect(result).toBeNull()
      expect(mockTabbable).not.toHaveBeenCalled()
    })

    it('should handle single element array', () => {
      mockTabbable.mockReturnValue([element1])

      const result = getPreviousInteractiveElement(container, element1)

      expect(result).toBeNull()
    })
  })

  describe('getDOMOrder', () => {
    let parentContainer: HTMLElement
    let childA: HTMLElement
    let childB: HTMLElement
    let childC: HTMLElement

    beforeEach(() => {
      // Create a DOM structure for testing
      parentContainer = document.createElement('div')
      childA = document.createElement('div')
      childB = document.createElement('span')
      childC = document.createElement('button')

      childA.id = 'child-a'
      childB.id = 'child-b'
      childC.id = 'child-c'

      // Append in specific order
      parentContainer.appendChild(childA)
      parentContainer.appendChild(childB)
      parentContainer.appendChild(childC)

      // Add to document for TreeWalker to work
      document.body.appendChild(parentContainer)
    })

    afterEach(() => {
      document.body.removeChild(parentContainer)
    })

    it('should return elements in DOM order', () => {
      const elements = new ElementList([childC, childA, childB]) // Out of order

      const result = getDOMOrder(parentContainer, elements)

      expect(result).toBeInstanceOf(ElementList)
      expect(result.asArray()).toEqual([childA, childB, childC]) // Should be in DOM order
    })

    it('should only include elements that are in the original list', () => {
      const extraElement = document.createElement('p')
      parentContainer.appendChild(extraElement)

      const elements = new ElementList([childC, childA]) // Missing childB and extraElement

      const result = getDOMOrder(parentContainer, elements)

      expect(result.asArray()).toEqual([childA, childC]) // Only elements from original list
    })

    it('should handle empty element list', () => {
      const elements = new ElementList()

      const result = getDOMOrder(parentContainer, elements)

      expect(result).toBeInstanceOf(ElementList)
      expect(result.size).toBe(0)
    })

    it('should return original elements when container is null', () => {
      const elements = new ElementList([childA, childB])

      const result = getDOMOrder(null as unknown as Element, elements)

      expect(result).toBe(elements)
    })

    it('should return original elements when container is undefined', () => {
      const elements = new ElementList([childA, childB])

      const result = getDOMOrder(undefined as unknown as Element, elements)

      expect(result).toBe(elements)
    })

    it('should return original elements when container is not an Element', () => {
      const elements = new ElementList([childA, childB])
      const nonElement = new EventTarget()

      const result = getDOMOrder(nonElement, elements)

      expect(result).toBe(elements)
    })

    it('should handle nested elements correctly', () => {
      const nestedDiv = document.createElement('div')
      const nestedButton = document.createElement('button')

      nestedDiv.appendChild(nestedButton)
      parentContainer.insertBefore(nestedDiv, childB)

      const elements = new ElementList([childC, nestedButton, childA, nestedDiv])

      const result = getDOMOrder(parentContainer, elements)

      // DOM order should be: childA, nestedDiv, nestedButton, childB, childC
      // But we only include elements from the original list
      expect(result.asArray()).toEqual([childA, nestedDiv, nestedButton, childC])
    })

    it('should handle elements not in container', () => {
      const outsideElement = document.createElement('span')
      document.body.appendChild(outsideElement)

      const elements = new ElementList([childA, outsideElement, childB])

      const result = getDOMOrder(parentContainer, elements)

      // Only elements within the container should be included
      expect(result.asArray()).toEqual([childA, childB])

      document.body.removeChild(outsideElement)
    })
  })
})
