import { useRouter } from "next/router";
import Link from "next/link";
import classNames from "classnames";
import { PropsWithChildren } from "react";

interface Props {
  href: string;
  exact?: boolean;
  className?: string;
  activeClassName?: string;
}

function NavLink({
  href,
  exact,
  className,
  activeClassName = "",
  children,
  ...props
}: PropsWithChildren<Props>) {
  const { pathname } = useRouter();

  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      {...props}
      className={classNames(className, {
        active,
        [activeClassName]: activeClassName && active,
      })}
    >
      {children}
    </Link>
  );
}

export default NavLink;
