import { test as base } from './modelsAccount'

export { MODEL_PATH } from './modelsAccount'

/**
 * The models account with Cinematic Studio's staff rollout flag on, so the
 * studio renders instead of its unavailable fallback.
 */
export const test = base.extend<{ studioRollout: void }>({
  studioRollout: [
    // Depends on modelsAccount so this flag route registers after, and wins.
    async ({ context, modelsAccount: _account }, use) => {
      await context.route('**/t.comfy.org/**', (route) =>
        /\/(flags|decide)\//.test(route.request().url())
          ? route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                featureFlags: {
                  'workshop-auth': true,
                  'workshop-enabled': true,
                  'workshop-workflows-enabled': true
                },
                featureFlagPayloads: {}
              })
            })
          : route.fallback()
      )
      await use()
    },
    { auto: true }
  ]
})
