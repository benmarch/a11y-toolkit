import FocusMemory from '../FocusMemory'

describe('FocusMemory', () => {
  let focusMemory: FocusMemory
  let element1: HTMLElement
  let element2: HTMLElement

  beforeEach(() => {
    focusMemory = new FocusMemory()
    element1 = document.createElement('button')
    element2 = document.createElement('input')

    // Mock document.activeElement
    Object.defineProperty(document, 'activeElement', {
      value: null,
      writable: true,
      configurable: true,
    })
  })

  describe('constructor', () => {
    it('should create a new FocusMemory instance', () => {
      expect(focusMemory).toBeInstanceOf(FocusMemory)
      expect(focusMemory.savedElement).toBeUndefined()
    })
  })

  describe('set', () => {
    it('should store the provided element', () => {
      focusMemory.set(element1)

      expect(focusMemory.savedElement).toBe(element1)
    })

    it('should store null when explicitly passed', () => {
      focusMemory.set(null)

      expect(focusMemory.savedElement).toBeNull()
    })

    it('should store the currently focused element when no argument provided', () => {
      // Mock document.activeElement
      Object.defineProperty(document, 'activeElement', {
        value: element2,
        writable: true,
        configurable: true,
      })

      focusMemory.set()

      expect(focusMemory.savedElement).toBe(element2)
    })

    it('should store null when no argument provided and no active element', () => {
      // Mock document.activeElement as null
      Object.defineProperty(document, 'activeElement', {
        value: null,
        writable: true,
        configurable: true,
      })

      focusMemory.set()

      expect(focusMemory.savedElement).toBeNull()
    })

    it('should overwrite previously stored element', () => {
      focusMemory.set(element1)
      expect(focusMemory.savedElement).toBe(element1)

      focusMemory.set(element2)
      expect(focusMemory.savedElement).toBe(element2)
    })

    it('should handle different element types', () => {
      const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')

      focusMemory.set(svgElement)

      expect(focusMemory.savedElement).toBe(svgElement)
    })

    it('should handle EventTarget objects', () => {
      const eventTarget = new EventTarget()

      focusMemory.set(eventTarget)

      expect(focusMemory.savedElement).toBe(eventTarget)
    })
  })

  describe('get', () => {
    it('should return the stored element', () => {
      focusMemory.set(element1)

      const result = focusMemory.get()

      expect(result).toBe(element1)
    })

    it('should return undefined when no element is stored', () => {
      const result = focusMemory.get()

      expect(result).toBeUndefined()
    })

    it('should return null when null was explicitly stored', () => {
      focusMemory.set(null)

      const result = focusMemory.get()

      expect(result).toBeNull()
    })

    it('should return the same element multiple times', () => {
      focusMemory.set(element1)

      expect(focusMemory.get()).toBe(element1)
      expect(focusMemory.get()).toBe(element1)
      expect(focusMemory.get()).toBe(element1)
    })
  })

  describe('clear', () => {
    it('should remove the stored element', () => {
      focusMemory.set(element1)
      expect(focusMemory.get()).toBe(element1)

      focusMemory.clear()

      expect(focusMemory.savedElement).toBeNull()
      expect(focusMemory.get()).toBeNull()
    })

    it('should handle clearing when no element is stored', () => {
      expect(() => focusMemory.clear()).not.toThrow()
      expect(focusMemory.savedElement).toBeNull()
    })

    it('should handle clearing after null was stored', () => {
      focusMemory.set(null)
      focusMemory.clear()

      expect(focusMemory.savedElement).toBeNull()
    })

    it('should allow storing new element after clearing', () => {
      focusMemory.set(element1)
      focusMemory.clear()
      focusMemory.set(element2)

      expect(focusMemory.get()).toBe(element2)
    })
  })

  describe('workflow scenarios', () => {
    it('should support typical save and restore workflow', () => {
      // Mock a focused element
      Object.defineProperty(document, 'activeElement', {
        value: element1,
        writable: true,
        configurable: true,
      })

      // Save current focus
      focusMemory.set()
      expect(focusMemory.get()).toBe(element1)

      // Later restore focus
      const savedElement = focusMemory.get()
      expect(savedElement).toBe(element1)

      // Clear the memory
      focusMemory.clear()
      expect(focusMemory.get()).toBeNull()
    })

    it('should support explicit element storage workflow', () => {
      // Explicitly store an element
      focusMemory.set(element2)

      // Verify it's stored
      expect(focusMemory.get()).toBe(element2)

      // Store a different element
      focusMemory.set(element1)
      expect(focusMemory.get()).toBe(element1)

      // Clear storage
      focusMemory.clear()
      expect(focusMemory.get()).toBeNull()
    })

    it('should handle multiple instances independently', () => {
      const memory1 = new FocusMemory()
      const memory2 = new FocusMemory()

      memory1.set(element1)
      memory2.set(element2)

      expect(memory1.get()).toBe(element1)
      expect(memory2.get()).toBe(element2)

      memory1.clear()

      expect(memory1.get()).toBeNull()
      expect(memory2.get()).toBe(element2) // Should not be affected
    })
  })
})
