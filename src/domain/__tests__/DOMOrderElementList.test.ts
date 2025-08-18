import DOMOrderElementList from '../DOMOrderElementList'
import ElementList from '../ElementList'
import * as selectors from '../../primitives/selectors'

// Mock the selectors module
jest.mock('../../primitives/selectors', () => ({
  getDOMOrder: jest.fn(),
}))

const mockGetDOMOrder = selectors.getDOMOrder as jest.MockedFunction<typeof selectors.getDOMOrder>

describe('DOMOrderElementList', () => {
  let container: HTMLElement
  let element1: HTMLElement
  let element2: HTMLElement
  let element3: HTMLElement
  let domOrderList: DOMOrderElementList

  beforeEach(() => {
    container = document.createElement('div')
    element1 = document.createElement('button')
    element2 = document.createElement('input')
    element3 = document.createElement('a')

    // Setup DOM structure
    container.appendChild(element1)
    container.appendChild(element2)
    container.appendChild(element3)

    mockGetDOMOrder.mockClear()
  })

  describe('constructor', () => {
    it('should create a DOMOrderElementList with container', () => {
      // Mock getDOMOrder to return empty list for constructor without elements
      mockGetDOMOrder.mockReturnValue(new ElementList())

      domOrderList = new DOMOrderElementList(container)

      expect(domOrderList.container).toBe(container)
      expect(domOrderList.size).toBe(0)
      expect(domOrderList.elements).toEqual([])
    })

    it('should create a DOMOrderElementList with container and initial elements', () => {
      // Mock getDOMOrder to return the elements in order when called by constructor
      const orderedElements = new ElementList([element1, element2])
      mockGetDOMOrder.mockReturnValue(orderedElements)

      const initialElements = [element1, element2]
      domOrderList = new DOMOrderElementList(container, initialElements)

      expect(domOrderList.container).toBe(container)
      expect(domOrderList.size).toBe(2)
      expect(domOrderList.has(element1)).toBe(true)
      expect(domOrderList.has(element2)).toBe(true)
    })

    it('should handle null elements parameter', () => {
      // Mock getDOMOrder to return empty list
      mockGetDOMOrder.mockReturnValue(new ElementList())

      domOrderList = new DOMOrderElementList(container, null)

      expect(domOrderList.container).toBe(container)
      expect(domOrderList.size).toBe(0)
      expect(domOrderList.elements).toEqual([])
    })
  })

  describe('add', () => {
    beforeEach(() => {
      domOrderList = new DOMOrderElementList(container)

      // Mock getDOMOrder to return elements in DOM order
      const mockOrderedList = new ElementList([element1, element2, element3])
      mockGetDOMOrder.mockReturnValue(mockOrderedList)
    })

    it('should add element and trigger update', () => {
      const result = domOrderList.add(element2)

      expect(result).toBe(domOrderList) // Should return this for chaining
      expect(mockGetDOMOrder).toHaveBeenCalledWith(container, expect.any(ElementList))
      expect(domOrderList.size).toBe(3) // After update, all elements are added
      expect(domOrderList.elements).toEqual([element1, element2, element3])
    })

    it('should maintain DOM order after adding elements', () => {
      domOrderList.add(element3) // Add out of order
      domOrderList.add(element1)

      expect(mockGetDOMOrder).toHaveBeenCalledTimes(2)
      expect(domOrderList.elements).toEqual([element1, element2, element3])
    })
  })

  describe('update', () => {
    beforeEach(() => {
      // Mock getDOMOrder to return empty list for initial construction
      mockGetDOMOrder.mockReturnValue(new ElementList())
      domOrderList = new DOMOrderElementList(container, [element3, element1, element2])
      mockGetDOMOrder.mockClear()
    })

    it('should reorder elements based on DOM order', () => {
      const orderedList = new ElementList([element1, element2, element3])
      mockGetDOMOrder.mockReturnValue(orderedList)

      domOrderList.update()

      expect(mockGetDOMOrder).toHaveBeenCalledWith(container, expect.any(ElementList))
      expect(domOrderList.elements).toEqual([element1, element2, element3])
    })

    it('should clear existing elements and add ordered ones', () => {
      const orderedList = new ElementList([element2, element1]) // Only some elements
      mockGetDOMOrder.mockReturnValue(orderedList)

      domOrderList.update()

      expect(domOrderList.size).toBe(2)
      expect(domOrderList.elements).toEqual([element2, element1])
      expect(domOrderList.has(element3)).toBe(false)
    })

    it('should handle empty result from getDOMOrder', () => {
      const emptyList = new ElementList()
      mockGetDOMOrder.mockReturnValue(emptyList)

      domOrderList.update()

      expect(domOrderList.size).toBe(0)
      expect(domOrderList.elements).toEqual([])
    })
  })

  describe('inheritance', () => {
    beforeEach(() => {
      // Mock getDOMOrder to return empty list for initial construction
      mockGetDOMOrder.mockReturnValue(new ElementList())
      domOrderList = new DOMOrderElementList(container)
      mockGetDOMOrder.mockClear()
    })

    it('should inherit all ElementList methods', () => {
      expect(domOrderList).toBeInstanceOf(ElementList)
      expect(typeof domOrderList.get).toBe('function')
      expect(typeof domOrderList.delete).toBe('function')
      expect(typeof domOrderList.clear).toBe('function')
      expect(typeof domOrderList.asArray).toBe('function')
    })

    it('should support delete operation', () => {
      // First add elements (this will trigger update)
      const mockOrderedList = new ElementList([element1, element2])
      mockGetDOMOrder.mockReturnValue(mockOrderedList)

      domOrderList.add(element1)
      domOrderList.add(element2)

      // Reset mock call count from add operations
      mockGetDOMOrder.mockClear()

      const result = domOrderList.delete(element1)

      expect(result).toBe(true)
      expect(domOrderList.has(element1)).toBe(false)
      // delete should not trigger update (only add does)
      expect(mockGetDOMOrder).not.toHaveBeenCalled()
    })

    it('should support clear operation', () => {
      // First add elements (this will trigger update)
      const mockOrderedList = new ElementList([element1, element2])
      mockGetDOMOrder.mockReturnValue(mockOrderedList)

      domOrderList.add(element1)
      domOrderList.add(element2)

      // Reset mock call count from add operations
      mockGetDOMOrder.mockClear()

      domOrderList.clear()

      expect(domOrderList.size).toBe(0)
      expect(domOrderList.elements).toEqual([])
      // clear should not trigger update (only add does)
      expect(mockGetDOMOrder).not.toHaveBeenCalled()
    })
  })
})
