import { cn } from "@/lib/utils";

/**
 * The "HUSKY" letterforms, cut from the brand lockup in `public/brand/logo` so
 * the site chrome can set them beside the mark as a horizontal lockup. Fills
 * with `currentColor`; size it by height and the width follows (8.7 : 1).
 *
 * Not `aria-hidden`: this is the brand name, and in every place it is used it
 * is the only text inside the home link, so it carries the link's name.
 */
export function HuskyWordmark({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="153.99 650.28 772.02 88.7"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Husky"
      focusable="false"
      className={cn(className)}
      {...props}
    >
      <polygon points="268.81 738.85 243.56 738.94 243.54 704.26 179.46 704.26 179.43 738.9 153.99 738.91 154.01 650.31 179.42 650.33 179.47 684.52 243.52 684.53 243.57 650.32 268.79 650.32 268.81 738.85" />
      <path d="M438.85,650.31v62.37c-1.56,18.09-15.31,26.44-32.78,26.45l-50.87.02c-17.18,0-31.09-8.59-32.14-26.44l-.04-62.34,25.39-.09.11,58.67c.01,5.44,4,10.09,9.9,10.1l44.52.02c6,0,10.34-4.43,10.7-10.12l-.04-58.61,25.26-.03Z" />
      <path d="M604.45,718.4c.01,11.6-12.39,20.52-24.61,20.53l-87.47.04-.07-19.64h80.49c1.81,0,4.4-.86,5.26-1.92,2.28-2.78,2.17-8.63.24-11.07-.84-1.06-3.54-2.06-5.29-2.06l-56.93-.04c-12.74,0-25.31-5.99-26.94-19.12-1.31-10.55-1.01-22.25,6.98-28.67,5.3-4.26,11.62-5.85,18.51-6.16l83.66.03-.08,19.36h-77.45c-4.54.02-6.74,3.22-6.85,7.5-.09,4,2.26,7.67,6.78,7.67h52.27c6.38-.01,12.45.59,18.22,2.9,7.54,3.02,13.25,9.6,13.26,17.78v12.88Z" />
      <polygon points="716.14 693.47 772.44 738.8 736.8 738.94 695.56 704.45 681.61 704.25 681.58 738.98 656.32 738.91 656.31 650.35 681.58 650.3 681.6 684.57 694.13 684.43 734.89 650.35 769.87 650.5 716.14 693.47" />
      <polygon points="926.01 650.52 874.63 707.5 874.5 738.88 849.61 738.93 849.51 707.54 798.16 650.53 828.9 650.28 862.19 688.57 895.37 650.3 926.01 650.52" />
    </svg>
  );
}
