interface FizzStorageOptions {
  storageKey: string
  tabsStorageKey: string
}

const storageConfig: FizzStorageOptions = {
  storageKey: 'fizz-layout-preferences',
  tabsStorageKey: 'fizz-layout-tabs',
}

function setFizzStorageConfig(options: Partial<FizzStorageOptions>) {
  if (options.storageKey)
    storageConfig.storageKey = options.storageKey
  if (options.tabsStorageKey)
    storageConfig.tabsStorageKey = options.tabsStorageKey
}

export { setFizzStorageConfig, storageConfig }
export type { FizzStorageOptions }
