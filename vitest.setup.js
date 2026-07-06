import React from 'react'
import { vi } from 'vitest'

// Replaces the former Jest automock src/__mocks__/react-i18next.js:
// Vitest does not auto-apply __mocks__ for packages, vi.mock in a setup file covers all suites
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal()
  const useMock = [(k) => k, {}]
  useMock.t = (k) => k
  useMock.i18n = {}
  return {
    ...actual,
    Trans: ({ children }) => children,
    useTranslation: () => useMock,
    Translation: ({ children }) => children((k) => k, { i18n: {} }),
    withTranslation: () => (Component) => function WithTranslation(props) {
      return React.createElement(Component, { t: (k) => k, ...props })
    },
  }
})
