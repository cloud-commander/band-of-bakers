import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="space-y-4 mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          className={`flex items-center space-x-2 ${DESIGN_TOKENS.typography.body.sm.size} text-muted-foreground`}
        >
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center space-x-2">
              {index > 0 && <ChevronRight className="w-4 h-4" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`${DESIGN_TOKENS.typography.h3.size} ${DESIGN_TOKENS.typography.h3.weight} tracking-tight`}
          >
            {title}
          </h1>
          {description && (
            <p className={`text-muted-foreground mt-2 ${DESIGN_TOKENS.typography.body.base.size}`}>
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
