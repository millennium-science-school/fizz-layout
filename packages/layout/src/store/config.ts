interface FizzStorageOptions {
  storageKey: string
  tabsStorageKey: string
}

type StorageType = Storage | undefined

const storageConfig: FizzStorageOptions = {
  storageKey: 'fizz-layout-preferences',
  tabsStorageKey: 'fizz-layout-tabs',
}

let storageConfigUsed = false

function setFizzStorageConfig(options: Partial<FizzStorageOptions>) {
  if (storageConfigUsed) {
    console.warn('[FizzLayout] setFizzStorageConfig should be called before using layout stores.')
  }
  if (options.storageKey)
    storageConfig.storageKey = options.storageKey
  if (options.tabsStorageKey)
    storageConfig.tabsStorageKey = options.tabsStorageKey
}

function markFizzStorageConfigUsed() {
  storageConfigUsed = true
}

function getBrowserStorage(type: 'localStorage' | 'sessionStorage'): StorageType {
  if (typeof globalThis === 'undefined')
    return undefined

  try {
    return globalThis[type] ?? undefined
  }
  catch {
    return undefined
  }
}

function getFizzLocalStorage(): StorageType {
  return getBrowserStorage('localStorage')
}

function getFizzSessionStorage(): StorageType {
  return getBrowserStorage('sessionStorage')
}

export {
  getFizzLocalStorage,
  getFizzSessionStorage,
  markFizzStorageConfigUsed,
  setFizzStorageConfig,
  storageConfig,
}
export type { FizzStorageOptions }
