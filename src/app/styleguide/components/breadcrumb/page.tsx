import { Slash } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  A11yNotes,
  Anatomy,
  Demo,
  PropsTable,
  ShowcaseHeader,
  ShowcasePage,
  ShowcaseSection,
} from "@/components/styleguide/showcase";

export default function BreadcrumbPage_() {
  return (
    <ShowcasePage>
      <ShowcaseHeader
        title="Breadcrumb"
        description="Shows where the current page sits in the hierarchy and offers a way back up. The last item is the current page and is not a link."
        importPath={`import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"`}
      />

      <ShowcaseSection title="Default">
        <Demo
          code={`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Living Room</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">East Wing</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Living Room</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Custom separator">
        <Demo
          note="Pass any node as the separator's child"
          code={`<BreadcrumbSeparator><Slash /></BreadcrumbSeparator>`}
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">East Wing</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Living Room</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Collapsed">
        <Demo
          note="BreadcrumbEllipsis stands in for the middle of a deep trail"
          code={`<BreadcrumbItem>
  <BreadcrumbEllipsis />
</BreadcrumbItem>`}
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Audio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Channel 04</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="With a routing link">
        <Demo
          note="asChild hands the anchor off to next/link"
          code={`import Link from "next/link"

<BreadcrumbLink asChild>
  <Link href="/zones">Zones</Link>
</BreadcrumbLink>`}
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <a href="#">Zones</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Living Room</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Demo>
      </ShowcaseSection>

      <ShowcaseSection title="Anatomy">
        <Anatomy
          parts={[
            "Breadcrumb",
            "BreadcrumbList",
            "BreadcrumbItem",
            "BreadcrumbLink",
            "BreadcrumbPage",
            "BreadcrumbSeparator",
            "BreadcrumbEllipsis",
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Props">
        <PropsTable
          rows={[
            {
              name: "href",
              type: "string",
              description: "On BreadcrumbLink. The destination.",
            },
            {
              name: "asChild",
              type: "boolean",
              default: "false",
              description:
                "On BreadcrumbLink. Render your own anchor — next/link, for instance — instead of a plain a.",
            },
            {
              name: "children",
              type: "ReactNode",
              default: "ChevronRight",
              description:
                "On BreadcrumbSeparator. Replaces the default chevron.",
            },
          ]}
        />
      </ShowcaseSection>

      <ShowcaseSection title="Accessibility">
        <A11yNotes
          notes={[
            "Breadcrumb renders a nav landmark labelled “breadcrumb”, so it is reachable from a landmark list.",
            "BreadcrumbPage carries aria-current=\"page\" and is deliberately not a link — the current page should not navigate to itself.",
            "Separators are aria-hidden and presentational; they are never announced.",
            "BreadcrumbEllipsis hides its icon and exposes visually hidden text so the gap is understood.",
            "Keep the trail in DOM order — it is read as a list, and order is the whole meaning.",
          ]}
        />
      </ShowcaseSection>
    </ShowcasePage>
  );
}
