import ElementList from '../ElementList'

describe('ElementList', () => {
  let elementList: ElementList
  let element1: HTMLElement
  let element2: HTMLElement
  let element3: HTMLElement

  beforeEach(() => {
    element1 = document.createElement('div')
    element2 = document.createElement('span')
    element3 = document.createElement('button')
    elementList = new ElementList()
  })

  describe('constructor', () => {
    it('should create an empty ElementList when no elements provided', () => {
      expect(elementList.size).toBe(0)
      expect(elementList.elements).toEqual([])
    })

    it('should create an ElementList with provided elements', () => {
      const elements = [element1, element2]
      const list = new ElementList(elements)

      expect(list.size).toBe(2)
      expect(list.elements).toEqual([element1, element2])
      expect(list.has(element1)).toBe(true)
      expect(list.has(element2)).toBe(true)
    })

    it('should handle null elements parameter', () => {
      const list = new ElementList(null)

      expect(list.size).toBe(0)
      expect(list.elements).toEqual([])
    })
  })

  describe('get', () => {
    beforeEach(() => {
      elementList.add(element1)
      elementList.add(element2)
    })

    it('should return element at specified index', () => {
      expect(elementList.get(0)).toBe(element1)
      expect(elementList.get(1)).toBe(element2)
    })

    it('should return undefined for invalid index', () => {
      expect(elementList.get(5)).toBeUndefined()
      expect(elementList.get(-1)).toBeUndefined()
    })
  })

  describe('add', () => {
    it('should add new element to the list', () => {
      const result = elementList.add(element1)

      expect(elementList.size).toBe(1)
      expect(elementList.has(element1)).toBe(true)
      expect(elementList.elements).toContain(element1)
      expect(result).toBe(elementList) // Should return this for chaining
    })

    it('should not add duplicate elements', () => {
      elementList.add(element1)
      elementList.add(element1) // Adding same element again

      expect(elementList.size).toBe(1)
      expect(elementList.elements.length).toBe(1)
      expect(elementList.elements[0]).toBe(element1)
    })

    it('should maintain order of elements', () => {
      elementList.add(element1)
      elementList.add(element2)
      elementList.add(element3)

      expect(elementList.elements).toEqual([element1, element2, element3])
    })
  })

  describe('delete', () => {
    beforeEach(() => {
      elementList.add(element1)
      elementList.add(element2)
      elementList.add(element3)
    })

    it('should remove existing element from the list', () => {
      const result = elementList.delete(element2)

      expect(result).toBe(true)
      expect(elementList.size).toBe(2)
      expect(elementList.has(element2)).toBe(false)
      expect(elementList.elements).toEqual([element1, element3])
    })

    it('should return false when trying to delete non-existent element', () => {
      const nonExistentElement = document.createElement('p')
      const result = elementList.delete(nonExistentElement)

      expect(result).toBe(false)
      expect(elementList.size).toBe(3)
    })

    it('should handle deleting from empty list', () => {
      const emptyList = new ElementList()
      const result = emptyList.delete(element1)

      expect(result).toBe(false)
      expect(emptyList.size).toBe(0)
    })
  })

  describe('clear', () => {
    beforeEach(() => {
      elementList.add(element1)
      elementList.add(element2)
      elementList.add(element3)
    })

    it('should remove all elements from the list', () => {
      elementList.clear()

      expect(elementList.size).toBe(0)
      expect(elementList.elements).toEqual([])
      expect(elementList.has(element1)).toBe(false)
      expect(elementList.has(element2)).toBe(false)
      expect(elementList.has(element3)).toBe(false)
    })

    it('should work on already empty list', () => {
      const emptyList = new ElementList()
      emptyList.clear()

      expect(emptyList.size).toBe(0)
      expect(emptyList.elements).toEqual([])
    })
  })

  describe('asArray', () => {
    it('should return copy of elements array', () => {
      elementList.add(element1)
      elementList.add(element2)

      const array = elementList.asArray()

      expect(array).toEqual([element1, element2])
      expect(array).not.toBe(elementList.elements) // Should be a copy
    })

    it('should return empty array for empty list', () => {
      const array = elementList.asArray()

      expect(array).toEqual([])
    })
  })

  describe('Set compatibility', () => {
    it('should work with Set methods', () => {
      elementList.add(element1)
      elementList.add(element2)

      // Test iteration
      const elements = Array.from(elementList)
      expect(elements).toEqual([element1, element2])

      // Test forEach
      const forEachElements: HTMLElement[] = []
      elementList.forEach((element) => {
        forEachElements.push(element as HTMLElement)
      })
      expect(forEachElements).toEqual([element1, element2])
    })
  })
})
