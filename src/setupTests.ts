/**
 * Test setup file for Jest
 * This file is run before each test file
 */

// Mock focus-trap module
jest.mock('focus-trap', () => ({
  createFocusTrap: jest.fn(() => ({
    activate: jest.fn(),
    deactivate: jest.fn(),
  })),
}))

// Mock tabbable module
jest.mock('tabbable', () => ({
  focusable: jest.fn(() => []),
  tabbable: jest.fn(() => []),
  isFocusable: jest.fn(() => false),
  isTabbable: jest.fn(() => false),
}))

// Setup DOM environment
beforeEach(() => {
  // Reset document.body
  document.body.innerHTML = ''

  // Reset document.activeElement
  if (document.activeElement && document.activeElement !== document.body) {
    ;(document.activeElement as HTMLElement).blur()
  }
})

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
})
