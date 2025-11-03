// "use client";

// import { ProductDetails } from "@/components/checkout/product-details";
// import { ProductDetailsSkeleton } from "@/components/checkout/product-details-skeleton";
// import type { CheckoutQueryParams } from "@/lib/types";
// import { usePaddle } from "@/hooks/use-paddle";
// import type { Environments } from "@paddle/paddle-js";

// type Props = {
//   checkoutQueryParams: CheckoutQueryParams;
//   environment: Environments;
//   clientToken: string;
//   redirectUrl: string;
// };

// export function Checkout(props: Props) {
//   const { checkoutData } = usePaddle({
//     checkoutQueryParams: props.checkoutQueryParams,
//     environment: props.environment,
//     clientToken: props.clientToken,
//     redirectUrl: props.redirectUrl,
//   });

//   return (
//     <div className="mx-auto grid min-h-screen bg-card p-0 px-2 lg:h-full lg:w-full lg:grid-cols-[1fr_1fr] lg:p-0">
//       <div className="flex w-full justify-center lg:order-2 lg:h-full lg:bg-background">
//         <div className="w-full max-w-[min(647px,100vw)] pt-6 lg:px-8 lg:pt-16">
//           {checkoutData ? (
//             <ProductDetails checkoutData={checkoutData} locale={props.checkoutQueryParams.locale} />
//           ) : (
//             <ProductDetailsSkeleton />
//           )}
//         </div>
//       </div>

//       <div className="mx-auto w-full max-w-[min(647px,100vw)] lg:order-1 lg:px-4 lg:pt-10">
//         {checkoutData && (
//           <h2 className="hidden px-3 py-6 font-semibold text-2xl leading-none lg:block">Payment details</h2>
//         )}
//         <div className="paddle-checkout-frame w-full" />
//       </div>
//     </div>
//   );
// }
