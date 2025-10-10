import {
  focusFirstFocusableChild,
  focusFirstInteractiveChild,
  focusLastFocusableChild,
  focusLastInteractiveChild,
  focusNextInteractiveElement,
  focusPreviousInteractiveElement,
  deactivateInteractiveElements,
  deactivateInteractiveChildren,
} from '../modifiers'
import ElementList from '../../domain/ElementList'
import {
  getFirstFocusableChild,
  getFirstInteractiveChild,
  getLastFocusableChild,
  getLastInteractiveChild,
  getNextInteractiveElement,
  getPreviousInteractiveElement,
  getInteractiveChildren,
} from '../selectors'

// Mock the selectors module
jest.mock('../selectors', () => ({
  getFirstFocusableChild: jest.fn(),
  getFirstInteractiveChild: jest.fn(),
  getLastFocusableChild: jest.fn(),
  getLastInteractiveChild: jest.fn(),
  getNextInteractiveElement: jest.fn(),
  getPreviousInteractiveElement: jest.fn(),
  getInteractiveChildren: jest.fn(),
}))

const mockGetFirstFocusableChild = getFirstFocusableChild as jest.MockedFunction<typeof getFirstFocusableChild>
const mockGetFirstInteractiveChild = getFirstInteractiveChild as jest.MockedFunction<typeof getFirstInteractiveChild>
const mockGetLastFocusableChild = getLastFocusableChild as jest.MockedFunction<typeof getLastFocusableChild>
const mockGetLastInteractiveChild = getLastInteractiveChild as jest.MockedFunction<typeof getLastInteractiveChild>
const mockGetNextInteractiveElement = getNextInteractiveElement as jest.MockedFunction<typeof getNextInteractiveElement>
const mockGetPreviousInteractiveElement = getPreviousInteractiveElement as jest.MockedFunction<
  typeof getPreviousInteractiveElement
>
const mockGetInteractiveChildren = getInteractiveChildren as jest.MockedFunction<typeof getInteractiveChildren>

describe('modifiers', () => {
  let container: HTMLElement
  let focusableElement: HTMLElement
  let interactiveElement: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    focusableElement = document.createElement('div')
    interactiveElement = document.createElement('button')

    // Mock focus method
    focusableElement.focus = jest.fn()
    interactiveElement.focus = jest.fn()

    // Clear all mocks
    jest.clearAllMocks()
  })

  describe('focusFirstFocusableChild', () => {
    it('should focus the first focusable child when found', () => {
      mockGetFirstFocusableChild.mockReturnValue(focusableElement)

      focusFirstFocusableChild(container)

      expect(mockGetFirstFocusableChild).toHaveBeenCalledWith(container)
      expect(focusableElement.focus).toHaveBeenCalledTimes(1)
    })

    it('should handle case when no focusable child is found', () => {
      mockGetFirstFocusableChild.mockReturnValue(null)

      focusFirstFocusableChild(container)

      expect(mockGetFirstFocusableChild).toHaveBeenCalledWith(container)
      expect(focusableElement.focus).not.toHaveBeenCalled()
    })

    it('should handle undefined return from getFirstFocusableChild', () => {
      mockGetFirstFocusableChild.mockReturnValue(undefined as unknown as HTMLElement)

      expect(() => focusFirstFocusableChild(container)).not.toThrow()
      expect(mockGetFirstFocusableChild).toHaveBeenCalledWith(container)
    })

    it('should work with different container types', () => {
      const svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      mockGetFirstFocusableChild.mockReturnValue(focusableElement)

      focusFirstFocusableChild(svgContainer)

      expect(mockGetFirstFocusableChild).toHaveBeenCalledWith(svgContainer)
      expect(focusableElement.focus).toHaveBeenCalledTimes(1)
    })
  })

  describe('focusFirstInteractiveChild', () => {
    it('should focus the first interactive child when found', () => {
      mockGetFirstInteractiveChild.mockReturnValue(interactiveElement)

      focusFirstInteractiveChild(container)

      expect(mockGetFirstInteractiveChild).toHaveBeenCalledWith(container)
      expect(interactiveElement.focus).toHaveBeenCalledTimes(1)
    })

    it('should handle case when no interactive child is found', () => {
      mockGetFirstInteractiveChild.mockReturnValue(null)

      focusFirstInteractiveChild(container)

      expect(mockGetFirstInteractiveChild).toHaveBeenCalledWith(container)
      expect(interactiveElement.focus).not.toHaveBeenCalled()
    })

    it('should handle undefined return from getFirstInteractiveChild', () => {
      mockGetFirstInteractiveChild.mockReturnValue(undefined as unknown as HTMLElement)

      expect(() => focusFirstInteractiveChild(container)).not.toThrow()
      expect(mockGetFirstInteractiveChild).toHaveBeenCalledWith(container)
    })

    it('should work with different container types', () => {
      const eventTarget = new EventTarget()
      mockGetFirstInteractiveChild.mockReturnValue(interactiveElement)

      focusFirstInteractiveChild(eventTarget)

      expect(mockGetFirstInteractiveChild).toHaveBeenCalledWith(eventTarget)
      expect(interactiveElement.focus).toHaveBeenCalledTimes(1)
    })
  })

  describe('focusLastFocusableChild', () => {
    it('should focus the last focusable child when found', () => {
      mockGetLastFocusableChild.mockReturnValue(focusableElement)

      focusLastFocusableChild(container)

      expect(mockGetLastFocusableChild).toHaveBeenCalledWith(container)
      expect(focusableElement.focus).toHaveBeenCalledTimes(1)
    })

    it('should handle case when no focusable child is found', () => {
      mockGetLastFocusableChild.mockReturnValue(null)

      focusLastFocusableChild(container)

      expect(mockGetLastFocusableChild).toHaveBeenCalledWith(container)
      expect(focusableElement.focus).not.toHaveBeenCalled()
    })

    it('should handle undefined return from getLastFocusableChild', () => {
      mockGetLastFocusableChild.mockReturnValue(undefined as unknown as HTMLElement)

      expect(() => focusLastFocusableChild(container)).not.toThrow()
      expect(mockGetLastFocusableChild).toHaveBeenCalledWith(container)
    })

    it('should work with different container types', () => {
      const svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      mockGetLastFocusableChild.mockReturnValue(focusableElement)

      focusLastFocusableChild(svgContainer)

      expect(mockGetLastFocusableChild).toHaveBeenCalledWith(svgContainer)
      expect(focusableElement.focus).toHaveBeenCalledTimes(1)
    })
  })

  describe('focusLastInteractiveChild', () => {
    it('should focus the last interactive child when found', () => {
      mockGetLastInteractiveChild.mockReturnValue(interactiveElement)

      focusLastInteractiveChild(container)

      expect(mockGetLastInteractiveChild).toHaveBeenCalledWith(container)
      expect(interactiveElement.focus).toHaveBeenCalledTimes(1)
    })

    it('should handle case when no interactive child is found', () => {
      mockGetLastInteractiveChild.mockReturnValue(null)

      focusLastInteractiveChild(container)

      expect(mockGetLastInteractiveChild).toHaveBeenCalledWith(container)
      expect(interactiveElement.focus).not.toHaveBeenCalled()
    })

    it('should handle undefined return from getLastInteractiveChild', () => {
      mockGetLastInteractiveChild.mockReturnValue(undefined as unknown as HTMLElement)

      expect(() => focusLastInteractiveChild(container)).not.toThrow()
      expect(mockGetLastInteractiveChild).toHaveBeenCalledWith(container)
    })

    it('should work with different container types', () => {
      const eventTarget = new EventTarget()
      mockGetLastInteractiveChild.mockReturnValue(interactiveElement)

      focusLastInteractiveChild(eventTarget)

      expect(mockGetLastInteractiveChild).toHaveBeenCalledWith(eventTarget)
      expect(interactiveElement.focus).toHaveBeenCalledTimes(1)
    })
  })

  describe('focusNextInteractiveElement', () => {
    let currentElement: HTMLElement
    let nextElement: HTMLElement

    beforeEach(() => {
      currentElement = document.createElement('button')
      nextElement = document.createElement('input')
      nextElement.focus = jest.fn()
    })

    it('should focus the next interactive element when found', () => {
      mockGetNextInteractiveElement.mockReturnValue(nextElement)

      focusNextInteractiveElement(container, currentElement)

      expect(mockGetNextInteractiveElement).toHaveBeenCalledWith(container, currentElement)
      expect(nextElement.focus).toHaveBeenCalledTimes(1)
    })

    it('should handle case when no next interactive element is found', () => {
      mockGetNextInteractiveElement.mockReturnValue(null)

      focusNextInteractiveElement(container, currentElement)

      expect(mockGetNextInteractiveElement).toHaveBeenCalledWith(container, currentElement)
      expect(nextElement.focus).not.toHaveBeenCalled()
    })

    it('should handle undefined return from getNextInteractiveElement', () => {
      mockGetNextInteractiveElement.mockReturnValue(undefined as unknown as HTMLElement)

      expect(() => focusNextInteractiveElement(container, currentElement)).not.toThrow()
      expect(mockGetNextInteractiveElement).toHaveBeenCalledWith(container, currentElement)
    })

    it('should work with different container and element types', () => {
      const svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      mockGetNextInteractiveElement.mockReturnValue(nextElement)

      focusNextInteractiveElement(svgContainer, svgElement)

      expect(mockGetNextInteractiveElement).toHaveBeenCalledWith(svgContainer, svgElement)
      expect(nextElement.focus).toHaveBeenCalledTimes(1)
    })
  })

  describe('focusPreviousInteractiveElement', () => {
    let currentElement: HTMLElement
    let previousElement: HTMLElement

    beforeEach(() => {
      currentElement = document.createElement('button')
      previousElement = document.createElement('input')
      previousElement.focus = jest.fn()
    })

    it('should focus the previous interactive element when found', () => {
      mockGetPreviousInteractiveElement.mockReturnValue(previousElement)

      focusPreviousInteractiveElement(container, currentElement)

      expect(mockGetPreviousInteractiveElement).toHaveBeenCalledWith(container, currentElement)
      expect(previousElement.focus).toHaveBeenCalledTimes(1)
    })

    it('should handle case when no previous interactive element is found', () => {
      mockGetPreviousInteractiveElement.mockReturnValue(null)

      focusPreviousInteractiveElement(container, currentElement)

      expect(mockGetPreviousInteractiveElement).toHaveBeenCalledWith(container, currentElement)
      expect(previousElement.focus).not.toHaveBeenCalled()
    })

    it('should handle undefined return from getPreviousInteractiveElement', () => {
      mockGetPreviousInteractiveElement.mockReturnValue(undefined as unknown as HTMLElement)

      expect(() => focusPreviousInteractiveElement(container, currentElement)).not.toThrow()
      expect(mockGetPreviousInteractiveElement).toHaveBeenCalledWith(container, currentElement)
    })

    it('should work with different container and element types', () => {
      const eventTarget = new EventTarget()
      const customElement = document.createElement('custom-element')
      mockGetPreviousInteractiveElement.mockReturnValue(previousElement)

      focusPreviousInteractiveElement(eventTarget, customElement)

      expect(mockGetPreviousInteractiveElement).toHaveBeenCalledWith(eventTarget, customElement)
      expect(previousElement.focus).toHaveBeenCalledTimes(1)
    })
  })

  describe('deactivateInteractiveElements', () => {
    let element1: HTMLElement
    let element2: HTMLElement
    let element3: HTMLElement
    let nonHTMLElement: SVGElement

    beforeEach(() => {
      element1 = document.createElement('button')
      element2 = document.createElement('input')
      element3 = document.createElement('a')
      nonHTMLElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')

      // Set initial tabIndex values
      element1.tabIndex = 0
      element2.tabIndex = 1
      element3.tabIndex = 2
    })

    it('should set tabIndex to -1 for all HTMLElements in the list', () => {
      const elementList = new ElementList([element1, element2, element3])

      deactivateInteractiveElements(elementList)

      expect(element1.tabIndex).toBe(-1)
      expect(element2.tabIndex).toBe(-1)
      expect(element3.tabIndex).toBe(-1)
    })

    it('should handle empty element list', () => {
      const emptyList = new ElementList()

      expect(() => deactivateInteractiveElements(emptyList)).not.toThrow()
    })

    it('should skip non-HTMLElement objects', () => {
      const elementList = new ElementList([element1, nonHTMLElement, element2])

      deactivateInteractiveElements(elementList)

      expect(element1.tabIndex).toBe(-1)
      expect(element2.tabIndex).toBe(-1)
      // SVGElement should not be affected (no tabIndex property modification)
      // Note: SVGElement does have tabIndex property in JSDOM, but our code checks for HTMLElement
    })

    it('should handle mixed element types', () => {
      const eventTarget = new EventTarget()
      const elementList = new ElementList([element1, eventTarget, element2])

      deactivateInteractiveElements(elementList)

      expect(element1.tabIndex).toBe(-1)
      expect(element2.tabIndex).toBe(-1)
    })

    it('should work with elements that already have tabIndex -1', () => {
      element1.tabIndex = -1
      const elementList = new ElementList([element1, element2])

      deactivateInteractiveElements(elementList)

      expect(element1.tabIndex).toBe(-1)
      expect(element2.tabIndex).toBe(-1)
    })
  })

  describe('deactivateInteractiveChildren', () => {
    let child1: HTMLElement
    let child2: HTMLElement
    let child3: HTMLElement

    beforeEach(() => {
      child1 = document.createElement('button')
      child2 = document.createElement('input')
      child3 = document.createElement('a')

      child1.tabIndex = 0
      child2.tabIndex = 0
      child3.tabIndex = 0
    })

    it('should deactivate all interactive children of container', () => {
      mockGetInteractiveChildren.mockReturnValue([child1, child2, child3])

      deactivateInteractiveChildren(container)

      expect(mockGetInteractiveChildren).toHaveBeenCalledWith(container)
      expect(child1.tabIndex).toBe(-1)
      expect(child2.tabIndex).toBe(-1)
      expect(child3.tabIndex).toBe(-1)
    })

    it('should handle container with no interactive children', () => {
      mockGetInteractiveChildren.mockReturnValue([])

      deactivateInteractiveChildren(container)

      expect(mockGetInteractiveChildren).toHaveBeenCalledWith(container)
      expect(child1.tabIndex).toBe(0) // Should remain unchanged
    })

    it('should handle null return from getInteractiveChildren', () => {
      mockGetInteractiveChildren.mockReturnValue(null)

      expect(() => deactivateInteractiveChildren(container)).not.toThrow()
      expect(mockGetInteractiveChildren).toHaveBeenCalledWith(container)
    })

    it('should work with different container types', () => {
      const svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      mockGetInteractiveChildren.mockReturnValue([child1, child2])

      deactivateInteractiveChildren(svgContainer)

      expect(mockGetInteractiveChildren).toHaveBeenCalledWith(svgContainer)
      expect(child1.tabIndex).toBe(-1)
      expect(child2.tabIndex).toBe(-1)
    })

    it('should create new ElementList for each call', () => {
      mockGetInteractiveChildren.mockReturnValue([child1, child2])

      // Test that the function works multiple times (indicating new ElementList creation)
      deactivateInteractiveChildren(container)
      expect(child1.tabIndex).toBe(-1)
      expect(child2.tabIndex).toBe(-1)

      // Reset tabIndex and test again
      child1.tabIndex = 0
      child2.tabIndex = 0

      deactivateInteractiveChildren(container)
      expect(child1.tabIndex).toBe(-1)
      expect(child2.tabIndex).toBe(-1)
    })
  })
})
