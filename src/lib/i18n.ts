import type { Resource } from "i18next";

export async function getResources(
  locale: string,
  namespaces: string[],
): Promise<Resource> {
  const resources: Resource = {};

  try {
    const messages = await import(`../../messages/${locale}.json`);
    const allMessages = messages.default;

    if (!resources[locale]) {
      resources[locale] = {};
    }

    for (const namespace of namespaces) {
      // Get the namespace-specific data from the messages object
      if (allMessages[namespace]) {
        resources[locale][namespace] = allMessages[namespace];
      } else {
        // Set empty object for missing namespaces instead of warning
        resources[locale][namespace] = {};
      }
    }
  } catch (error) {
    console.warn(`Failed to load messages for locale ${locale}:`, error);
  }

  return resources;
}
