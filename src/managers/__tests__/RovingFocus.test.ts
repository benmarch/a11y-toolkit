import RovingFocus from '../RovingFocus'
import ElementList from '../../domain/ElementList'

describe('RovingFocus', () => {
  let elementList: ElementList
  let element1: HTMLElement
  let element2: HTMLElement
  let element3: HTMLElement
  let rovingFocus: RovingFocus

  beforeEach(() => {
    element1 = document.createElement('button')
    element2 = document.createElement('input')
    element3 = document.createElement('a')

    // Mock focus methods
    element1.focus = jest.fn()
    element2.focus = jest.fn()
    element3.focus = jest.fn()

    // Set initial tabIndex values
    element1.tabIndex = 0
    element2.tabIndex = 0
    element3.tabIndex = 0

    elementList = new ElementList([element1, element2, element3])

    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should create RovingFocus with default options', () => {
      rovingFocus = new RovingFocus(elementList)

      expect(rovingFocus.elements).toBe(elementList)
      expect(rovingFocus.isActive).toBe(false)
      expect(rovingFocus.index).toBe(0)
    })

    it('should create RovingFocus with isActive option', () => {
      rovingFocus = new RovingFocus(elementList, { isActive: true })

      expect(rovingFocus.isActive).toBe(true)
      // Should have activated with default index 0
      expect(element1.tabIndex).toBe(0)
      expect(element2.tabIndex).toBe(-1)
      expect(element3.tabIndex).toBe(-1)
    })

    it('should handle empty element list', () => {
      const emptyList = new ElementList()
      rovingFocus = new RovingFocus(emptyList)

      expect(rovingFocus.elements).toBe(emptyList)
      expect(rovingFocus.index).toBe(0)
    })
  })

  describe('next', () => {
    beforeEach(() => {
      rovingFocus = new RovingFocus(elementList)
    })

    it('should move to next element when within bounds', () => {
      rovingFocus.index = 0

      rovingFocus.next()

      expect(rovingFocus.index).toBe(1)
      expect(rovingFocus.isActive).toBe(true)
      expect(element1.tabIndex).toBe(-1)
      expect(element2.tabIndex).toBe(0)
      expect(element3.tabIndex).toBe(-1)
    })

    it('should not move beyond last element', () => {
      rovingFocus.index = 2 // Last element

      rovingFocus.next()

      expect(rovingFocus.index).toBe(2) // Should stay at last element
    })

    it('should handle move from middle element', () => {
      rovingFocus.index = 1

      rovingFocus.next()

      expect(rovingFocus.index).toBe(2)
      expect(element1.tabIndex).toBe(-1)
      expect(element2.tabIndex).toBe(-1)
      expect(element3.tabIndex).toBe(0)
    })

    it('should handle empty element list', () => {
      const emptyList = new ElementList()
      const emptyRover = new RovingFocus(emptyList)

      expect(() => emptyRover.next()).not.toThrow()
      expect(emptyRover.index).toBe(0)
    })
  })

  describe('prev', () => {
    beforeEach(() => {
      rovingFocus = new RovingFocus(elementList)
    })

    it('should move to previous element when within bounds', () => {
      rovingFocus.index = 2

      rovingFocus.prev()

      expect(rovingFocus.index).toBe(1)
      expect(rovingFocus.isActive).toBe(true)
      expect(element1.tabIndex).toBe(-1)
      expect(element2.tabIndex).toBe(0)
      expect(element3.tabIndex).toBe(-1)
    })

    it('should not move before first element', () => {
      rovingFocus.index = 0 // First element

      rovingFocus.prev()

      expect(rovingFocus.index).toBe(0) // Should stay at first element
    })

    it('should handle move from middle element', () => {
      rovingFocus.index = 1

      rovingFocus.prev()

      expect(rovingFocus.index).toBe(0)
      expect(element1.tabIndex).toBe(0)
      expect(element2.tabIndex).toBe(-1)
      expect(element3.tabIndex).toBe(-1)
    })

    it('should handle empty element list', () => {
      const emptyList = new ElementList()
      const emptyRover = new RovingFocus(emptyList)

      expect(() => emptyRover.prev()).not.toThrow()
      expect(emptyRover.index).toBe(0)
    })
  })

  describe('first', () => {
    beforeEach(() => {
      rovingFocus = new RovingFocus(elementList)
    })

    it('should move to first element', () => {
      rovingFocus.index = 2

      rovingFocus.first()

      expect(rovingFocus.index).toBe(0)
      expect(element1.tabIndex).toBe(0)
      expect(element2.tabIndex).toBe(-1)
      expect(element3.tabIndex).toBe(-1)
    })

    it('should work when already at first element', () => {
      rovingFocus.index = 0

      rovingFocus.first()

      expect(rovingFocus.index).toBe(0)
      expect(element1.tabIndex).toBe(0)
      expect(element2.tabIndex).toBe(-1)
      expect(element3.tabIndex).toBe(-1)
    })

    it('should handle empty element list', () => {
      const emptyList = new ElementList()
      const emptyRover = new RovingFocus(emptyList)

      expect(() => emptyRover.first()).not.toThrow()
      expect(emptyRover.index).toBe(0)
    })
  })

  describe('last', () => {
    beforeEach(() => {
      rovingFocus = new RovingFocus(elementList)
    })

    it('should move to last element', () => {
      rovingFocus.index = 0

      rovingFocus.last()

      expect(rovingFocus.index).toBe(2)
      expect(element1.tabIndex).toBe(-1)
      expect(element2.tabIndex).toBe(-1)
      expect(element3.tabIndex).toBe(0)
    })

    it('should work when already at last element', () => {
      rovingFocus.index = 2

      rovingFocus.last()

      expect(rovingFocus.index).toBe(2)
      expect(element1.tabIndex).toBe(-1)
      expect(element2.tabIndex).toBe(-1)
      expect(element3.tabIndex).toBe(0)
    })

    it('should handle single element list', () => {
      const singleList = new ElementList([element1])
      const singleRover = new RovingFocus(singleList)

      singleRover.last()

      expect(singleRover.index).toBe(0)
      expect(element1.tabIndex).toBe(0)
    })

    it('should handle empty element list', () => {
      const emptyList = new ElementList()
      const emptyRover = new RovingFocus(emptyList)

      expect(() => emptyRover.last()).not.toThrow()
      // For empty list, index should remain 0 since focus(-1) is out of bounds
      expect(emptyRover.index).toBe(0)
    })
  })

  describe('focus', () => {
    beforeEach(() => {
      rovingFocus = new RovingFocus(elementList)
    })

    it('should focus element at specified index', () => {
      rovingFocus.focus(1)

      expect(rovingFocus.index).toBe(1)
      expect(element1.tabIndex).toBe(-1)
      expect(element2.tabIndex).toBe(0)
      expect(element3.tabIndex).toBe(-1)
      expect(element2.focus).toHaveBeenCalledTimes(1)
    })

    it('should focus element at index 0', () => {
      rovingFocus.focus(0)

      expect(rovingFocus.index).toBe(0)
      expect(element1.tabIndex).toBe(0)
      expect(element1.focus).toHaveBeenCalledTimes(1)
    })

    it('should ignore out of bounds indices', () => {
      const originalIndex = rovingFocus.index

      rovingFocus.focus(99)

      expect(rovingFocus.index).toBe(originalIndex)
      expect(element1.focus).not.toHaveBeenCalled()
      expect(element2.focus).not.toHaveBeenCalled()
      expect(element3.focus).not.toHaveBeenCalled()
    })

    it('should ignore negative indices', () => {
      const originalIndex = rovingFocus.index

      rovingFocus.focus(-1)

      expect(rovingFocus.index).toBe(originalIndex)
      expect(element1.focus).not.toHaveBeenCalled()
    })

    it('should focus current element when no index provided', () => {
      rovingFocus.index = 1

      rovingFocus.focus()

      expect(rovingFocus.index).toBe(1)
      expect(element2.tabIndex).toBe(0)
      expect(element2.focus).toHaveBeenCalledTimes(1)
    })
  })

  describe('activate', () => {
    beforeEach(() => {
      rovingFocus = new RovingFocus(elementList)
    })

    it('should set isActive to true', () => {
      rovingFocus.activate()

      expect(rovingFocus.isActive).toBe(true)
    })

    it('should set tabIndex for all elements without focusing', () => {
      rovingFocus.index = 1

      rovingFocus.activate()

      expect(element1.tabIndex).toBe(-1)
      expect(element2.tabIndex).toBe(0)
      expect(element3.tabIndex).toBe(-1)
      expect(element1.focus).not.toHaveBeenCalled()
      expect(element2.focus).not.toHaveBeenCalled()
      expect(element3.focus).not.toHaveBeenCalled()
    })

    it('should focus active element when shouldFocusActive is true', () => {
      rovingFocus.index = 2

      rovingFocus.activate(true)

      expect(element3.tabIndex).toBe(0)
      expect(element3.focus).toHaveBeenCalledTimes(1)
    })

    it('should skip non-focusable elements', () => {
      const eventTarget = new EventTarget()
      const mixedList = new ElementList([element1, eventTarget, element2])
      const mixedRover = new RovingFocus(mixedList)

      mixedRover.activate()

      expect(element1.tabIndex).toBe(0)
      expect(element2.tabIndex).toBe(-1)
      // EventTarget should be skipped (no tabIndex property)
    })

    it('should handle empty element list', () => {
      const emptyList = new ElementList()
      const emptyRover = new RovingFocus(emptyList)

      expect(() => emptyRover.activate()).not.toThrow()
      expect(emptyRover.isActive).toBe(true)
    })
  })

  describe('deactivate', () => {
    beforeEach(() => {
      rovingFocus = new RovingFocus(elementList, { isActive: true })
    })

    it('should set isActive to false', () => {
      rovingFocus.deactivate()

      expect(rovingFocus.isActive).toBe(false)
    })

    it('should reset index to 0', () => {
      rovingFocus.index = 2

      rovingFocus.deactivate()

      expect(rovingFocus.index).toBe(0)
    })

    it('should remove tabindex attributes from all elements', () => {
      // Elements should have tabindex attributes after activation
      expect(element1.hasAttribute('tabindex')).toBe(true)
      expect(element2.hasAttribute('tabindex')).toBe(true)
      expect(element3.hasAttribute('tabindex')).toBe(true)

      rovingFocus.deactivate()

      expect(element1.hasAttribute('tabindex')).toBe(false)
      expect(element2.hasAttribute('tabindex')).toBe(false)
      expect(element3.hasAttribute('tabindex')).toBe(false)
    })

    it('should skip non-focusable elements during deactivation', () => {
      const eventTarget = new EventTarget()
      const mixedList = new ElementList([element1, eventTarget, element2])
      const mixedRover = new RovingFocus(mixedList, { isActive: true })

      expect(() => mixedRover.deactivate()).not.toThrow()
      expect(element1.hasAttribute('tabindex')).toBe(false)
      expect(element2.hasAttribute('tabindex')).toBe(false)
    })

    it('should handle empty element list', () => {
      const emptyList = new ElementList()
      const emptyRover = new RovingFocus(emptyList, { isActive: true })

      expect(() => emptyRover.deactivate()).not.toThrow()
      expect(emptyRover.isActive).toBe(false)
    })
  })

  describe('integration scenarios', () => {
    beforeEach(() => {
      rovingFocus = new RovingFocus(elementList)
    })

    it('should support complete navigation workflow', () => {
      // Start at first element
      rovingFocus.focus(0)
      expect(rovingFocus.index).toBe(0)
      expect(element1.focus).toHaveBeenCalledTimes(1)

      // Move to next
      rovingFocus.next()
      expect(rovingFocus.index).toBe(1)
      expect(element2.tabIndex).toBe(0)

      // Move to last
      rovingFocus.last()
      expect(rovingFocus.index).toBe(2)
      expect(element3.tabIndex).toBe(0)

      // Move to first
      rovingFocus.first()
      expect(rovingFocus.index).toBe(0)
      expect(element1.tabIndex).toBe(0)

      // Deactivate
      rovingFocus.deactivate()
      expect(rovingFocus.isActive).toBe(false)
      expect(element1.hasAttribute('tabindex')).toBe(false)
    })

    it('should handle dynamic element list changes', () => {
      const newElement = document.createElement('select')
      newElement.focus = jest.fn()

      // Start with 3 elements
      rovingFocus.focus(1)
      expect(rovingFocus.index).toBe(1)

      // Add element to list
      elementList.add(newElement)

      // Should still work with new size
      rovingFocus.last()
      expect(rovingFocus.index).toBe(3) // Last index is now 3
    })
  })
})
