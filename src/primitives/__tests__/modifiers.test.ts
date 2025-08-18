import {
  focusFirstFocusableChild,
  focusFirstInteractiveChild,
  deactivateInteractiveElements,
  deactivateInteractiveChildren,
} from '../modifiers'
import ElementList from '../../domain/ElementList'
import { getFirstFocusableChild, getFirstInteractiveChild, getInteractiveChildren } from '../selectors'

// Mock the selectors module
jest.mock('../selectors', () => ({
  getFirstFocusableChild: jest.fn(),
  getFirstInteractiveChild: jest.fn(),
  getInteractiveChildren: jest.fn(),
}))

const mockGetFirstFocusableChild = getFirstFocusableChild as jest.MockedFunction<typeof getFirstFocusableChild>
const mockGetFirstInteractiveChild = getFirstInteractiveChild as jest.MockedFunction<typeof getFirstInteractiveChild>
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
