import ArrowKeyNavigator from '../ArrowKeyNavigator'
import ElementList from '../../domain/ElementList'
import RovingFocus from '../RovingFocus'

// Mock RovingFocus
jest.mock('../RovingFocus')

const MockRovingFocus = RovingFocus as jest.MockedClass<typeof RovingFocus>

describe('ArrowKeyNavigator', () => {
  let container: HTMLElement
  let elementList: ElementList
  let element1: HTMLElement
  let element2: HTMLElement
  let element3: HTMLElement
  let arrowKeyNavigator: ArrowKeyNavigator
  let mockRover: {
    activate: jest.Mock
    deactivate: jest.Mock
    focus: jest.Mock
    next: jest.Mock
    prev: jest.Mock
    first: jest.Mock
    last: jest.Mock
    index: number
  }

  beforeEach(() => {
    container = document.createElement('div')
    element1 = document.createElement('button')
    element2 = document.createElement('input')
    element3 = document.createElement('a')

    elementList = new ElementList([element1, element2, element3])

    // Setup mock for RovingFocus
    mockRover = {
      activate: jest.fn(),
      deactivate: jest.fn(),
      focus: jest.fn(),
      next: jest.fn(),
      prev: jest.fn(),
      first: jest.fn(),
      last: jest.fn(),
      index: 0,
    }

    MockRovingFocus.mockImplementation(() => mockRover as unknown as RovingFocus)

    arrowKeyNavigator = new ArrowKeyNavigator(container, elementList)

    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should create ArrowKeyNavigator with default options', () => {
      const navigator = new ArrowKeyNavigator(container, elementList)

      expect(navigator.container).toBe(container)
      expect(navigator.elements).toBe(elementList)
      expect(navigator.isActive).toBe(false)
      expect(navigator.options).toEqual({
        horizontal: false,
        vertical: false,
        loop: false,
      })
      expect(MockRovingFocus).toHaveBeenCalledWith(elementList)
    })

    it('should create ArrowKeyNavigator with custom options', () => {
      const options = {
        horizontal: true,
        vertical: true,
        homeEnd: true,
        loop: true,
        isActive: false,
      }

      const navigator = new ArrowKeyNavigator(container, elementList, options)

      // Note: isActive gets spread into options object but is not part of the core navigation options
      expect(navigator.options).toEqual({
        horizontal: true,
        vertical: true,
        homeEnd: true,
        loop: true,
        isActive: false,
      })
      expect(navigator.isActive).toBe(false)
    })

    it('should activate immediately when isActive option is true', () => {
      const navigator = new ArrowKeyNavigator(container, elementList, { isActive: true })

      expect(navigator.isActive).toBe(true)
      expect(navigator.rover.activate).toHaveBeenCalledTimes(1)
    })

    it('should merge options with defaults', () => {
      const navigator = new ArrowKeyNavigator(container, elementList, { horizontal: true })

      expect(navigator.options).toEqual({
        horizontal: true,
        vertical: false,
        loop: false,
      })
    })
  })

  describe('activate', () => {
    it('should set isActive to true', () => {
      arrowKeyNavigator.activate()

      expect(arrowKeyNavigator.isActive).toBe(true)
    })

    it('should activate the rover', () => {
      arrowKeyNavigator.activate()

      expect(mockRover.activate).toHaveBeenCalledTimes(1)
    })

    it('should add keydown event listener to container', () => {
      const addEventListenerSpy = jest.spyOn(container, 'addEventListener')

      arrowKeyNavigator.activate()

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))

      addEventListenerSpy.mockRestore()
    })

    it('should work when already active', () => {
      arrowKeyNavigator.isActive = true

      arrowKeyNavigator.activate()

      expect(arrowKeyNavigator.isActive).toBe(true)
      expect(mockRover.activate).toHaveBeenCalledTimes(1)
    })
  })

  describe('deactivate', () => {
    beforeEach(() => {
      arrowKeyNavigator.activate()
      jest.clearAllMocks()
    })

    it('should set isActive to false', () => {
      arrowKeyNavigator.deactivate()

      expect(arrowKeyNavigator.isActive).toBe(false)
    })

    it('should deactivate the rover', () => {
      arrowKeyNavigator.deactivate()

      expect(mockRover.deactivate).toHaveBeenCalledTimes(1)
    })

    it('should remove keydown event listener from container', () => {
      const removeEventListenerSpy = jest.spyOn(container, 'removeEventListener')

      arrowKeyNavigator.deactivate()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))

      removeEventListenerSpy.mockRestore()
    })

    it('should work when already inactive', () => {
      arrowKeyNavigator.isActive = false

      arrowKeyNavigator.deactivate()

      expect(arrowKeyNavigator.isActive).toBe(false)
      expect(mockRover.deactivate).toHaveBeenCalledTimes(1)
    })
  })

  describe('focus', () => {
    it('should call rover.focus with no index', () => {
      arrowKeyNavigator.focus()

      expect(mockRover.focus).toHaveBeenCalledWith(undefined)
    })

    it('should call rover.focus with specified index', () => {
      arrowKeyNavigator.focus(2)

      expect(mockRover.focus).toHaveBeenCalledWith(2)
    })

    it('should work with index 0', () => {
      arrowKeyNavigator.focus(0)

      expect(mockRover.focus).toHaveBeenCalledWith(0)
    })
  })

  describe('keyboard event handling', () => {
    beforeEach(() => {
      arrowKeyNavigator = new ArrowKeyNavigator(container, elementList, {
        horizontal: true,
        vertical: true,
        homeEnd: true,
        loop: true,
      })
      arrowKeyNavigator.activate()
      jest.clearAllMocks()
    })

    describe('when inactive', () => {
      beforeEach(() => {
        arrowKeyNavigator.isActive = false
      })

      it('should ignore all key events when inactive', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })

        container.dispatchEvent(event)

        expect(mockRover.next).not.toHaveBeenCalled()
      })
    })

    describe('ArrowRight', () => {
      it('should call next when horizontal is enabled', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
        const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

        container.dispatchEvent(event)

        expect(preventDefaultSpy).toHaveBeenCalled()
        expect(mockRover.next).toHaveBeenCalledTimes(1)
      })

      it('should not handle when horizontal is disabled', () => {
        arrowKeyNavigator.options.horizontal = false
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
        const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

        container.dispatchEvent(event)

        expect(preventDefaultSpy).not.toHaveBeenCalled()
        expect(mockRover.next).not.toHaveBeenCalled()
      })
    })

    describe('ArrowDown', () => {
      it('should call next when vertical is enabled', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
        const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

        container.dispatchEvent(event)

        expect(preventDefaultSpy).toHaveBeenCalled()
        expect(mockRover.next).toHaveBeenCalledTimes(1)
      })

      it('should not handle when vertical is disabled', () => {
        arrowKeyNavigator.options.vertical = false
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })

        container.dispatchEvent(event)

        expect(mockRover.next).not.toHaveBeenCalled()
      })
    })

    describe('ArrowLeft', () => {
      it('should call prev when horizontal is enabled', () => {
        // Set up rover index as non-zero so it doesn't trigger looping
        mockRover.index = 1
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
        const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

        container.dispatchEvent(event)

        expect(preventDefaultSpy).toHaveBeenCalled()
        expect(mockRover.prev).toHaveBeenCalledTimes(1)
      })

      it('should not handle when horizontal is disabled', () => {
        arrowKeyNavigator.options.horizontal = false
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })

        container.dispatchEvent(event)

        expect(mockRover.prev).not.toHaveBeenCalled()
      })
    })

    describe('ArrowUp', () => {
      it('should call prev when vertical is enabled', () => {
        // Set up rover index as non-zero so it doesn't trigger looping
        mockRover.index = 1
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
        const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

        container.dispatchEvent(event)

        expect(preventDefaultSpy).toHaveBeenCalled()
        expect(mockRover.prev).toHaveBeenCalledTimes(1)
      })

      it('should not handle when vertical is disabled', () => {
        arrowKeyNavigator.options.vertical = false
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })

        container.dispatchEvent(event)

        expect(mockRover.prev).not.toHaveBeenCalled()
      })
    })

    describe('Home', () => {
      it('should call rover.first when homeEnd is enabled', () => {
        const event = new KeyboardEvent('keydown', { key: 'Home' })
        const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

        container.dispatchEvent(event)

        expect(preventDefaultSpy).toHaveBeenCalled()
        expect(mockRover.first).toHaveBeenCalledTimes(1)
      })

      it('should not handle when homeEnd is disabled', () => {
        arrowKeyNavigator.options.homeEnd = false
        const event = new KeyboardEvent('keydown', { key: 'Home' })

        container.dispatchEvent(event)

        expect(mockRover.first).not.toHaveBeenCalled()
      })
    })

    describe('End', () => {
      it('should call rover.last when homeEnd is enabled', () => {
        const event = new KeyboardEvent('keydown', { key: 'End' })
        const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

        container.dispatchEvent(event)

        expect(preventDefaultSpy).toHaveBeenCalled()
        expect(mockRover.last).toHaveBeenCalledTimes(1)
      })

      it('should not handle when homeEnd is disabled', () => {
        arrowKeyNavigator.options.homeEnd = false
        const event = new KeyboardEvent('keydown', { key: 'End' })

        container.dispatchEvent(event)

        expect(mockRover.last).not.toHaveBeenCalled()
      })
    })

    describe('other keys', () => {
      it('should ignore unhandled keys', () => {
        const event = new KeyboardEvent('keydown', { key: 'Space' })
        const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

        container.dispatchEvent(event)

        expect(preventDefaultSpy).not.toHaveBeenCalled()
        expect(mockRover.next).not.toHaveBeenCalled()
        expect(mockRover.prev).not.toHaveBeenCalled()
        expect(mockRover.first).not.toHaveBeenCalled()
        expect(mockRover.last).not.toHaveBeenCalled()
      })
    })
  })

  describe('looping behavior', () => {
    beforeEach(() => {
      arrowKeyNavigator = new ArrowKeyNavigator(container, elementList, {
        horizontal: true,
        loop: true,
      })
      arrowKeyNavigator.activate()
      jest.clearAllMocks()
    })

    it('should loop to first when at last element and moving next', () => {
      // Mock being at last element
      Object.defineProperty(arrowKeyNavigator.rover, 'index', { value: 2 })
      Object.defineProperty(arrowKeyNavigator.elements, 'size', { value: 3 })

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      container.dispatchEvent(event)

      expect(mockRover.first).toHaveBeenCalledTimes(1)
      expect(mockRover.next).not.toHaveBeenCalled()
    })

    it('should not loop when not at last element', () => {
      // Mock being at middle element
      Object.defineProperty(arrowKeyNavigator.rover, 'index', { value: 1 })
      Object.defineProperty(arrowKeyNavigator.elements, 'size', { value: 3 })

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      container.dispatchEvent(event)

      expect(mockRover.next).toHaveBeenCalledTimes(1)
      expect(mockRover.first).not.toHaveBeenCalled()
    })

    it('should loop to last when at first element and moving prev', () => {
      // Mock being at first element
      Object.defineProperty(arrowKeyNavigator.rover, 'index', { value: 0 })

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
      container.dispatchEvent(event)

      expect(mockRover.last).toHaveBeenCalledTimes(1)
      expect(mockRover.prev).not.toHaveBeenCalled()
    })

    it('should not loop when not at first element', () => {
      // Mock being at middle element
      Object.defineProperty(arrowKeyNavigator.rover, 'index', { value: 1 })

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
      container.dispatchEvent(event)

      expect(mockRover.prev).toHaveBeenCalledTimes(1)
      expect(mockRover.last).not.toHaveBeenCalled()
    })
  })

  describe('non-looping behavior', () => {
    beforeEach(() => {
      arrowKeyNavigator = new ArrowKeyNavigator(container, elementList, {
        horizontal: true,
        loop: false,
      })
      arrowKeyNavigator.activate()
      jest.clearAllMocks()
    })

    it('should not loop when at last element and loop is disabled', () => {
      // Mock being at last element
      Object.defineProperty(arrowKeyNavigator.rover, 'index', { value: 2 })
      Object.defineProperty(arrowKeyNavigator.elements, 'size', { value: 3 })

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      container.dispatchEvent(event)

      expect(mockRover.next).toHaveBeenCalledTimes(1)
      expect(mockRover.first).not.toHaveBeenCalled()
    })

    it('should not loop when at first element and loop is disabled', () => {
      // Mock being at first element
      Object.defineProperty(arrowKeyNavigator.rover, 'index', { value: 0 })

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
      container.dispatchEvent(event)

      expect(mockRover.prev).toHaveBeenCalledTimes(1)
      expect(mockRover.last).not.toHaveBeenCalled()
    })
  })

  describe('integration scenarios', () => {
    it('should support complete lifecycle', () => {
      const navigator = new ArrowKeyNavigator(container, elementList, {
        horizontal: true,
        vertical: true,
        homeEnd: true,
        loop: true,
      })

      // Initially inactive
      expect(navigator.isActive).toBe(false)

      // Activate
      navigator.activate()
      expect(navigator.isActive).toBe(true)
      expect(navigator.rover.activate).toHaveBeenCalled()

      // Focus specific element
      navigator.focus(1)
      expect(navigator.rover.focus).toHaveBeenCalledWith(1)

      // Deactivate
      navigator.deactivate()
      expect(navigator.isActive).toBe(false)
      expect(navigator.rover.deactivate).toHaveBeenCalled()
    })

    it('should handle shared element list with rover', () => {
      // Clear the mock from beforeEach constructor call
      MockRovingFocus.mockClear()

      // Create a new ArrowKeyNavigator to verify the mock was called
      const newArrowKeyNavigator = new ArrowKeyNavigator(container, elementList)

      expect(newArrowKeyNavigator.elements).toBe(elementList)
      expect(MockRovingFocus).toHaveBeenCalledWith(elementList)

      // Modifications to element list should affect both
      const newElement = document.createElement('select')
      elementList.add(newElement)

      expect(newArrowKeyNavigator.elements.has(newElement)).toBe(true)
    })
  })
})
