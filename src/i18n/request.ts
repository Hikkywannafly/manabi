import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
    // Provide fallback locale if undefined
    const currentLocale = locale || 'vi';

    return {
        locale: currentLocale,
        messages: (await import(`../../messages/${currentLocale}.json`)).default
    };
});