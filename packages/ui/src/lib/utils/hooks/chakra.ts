import { useEffect, useState } from "react";

export {
    useDisclosure,
    type UseDisclosureProps,
    useOutsideClick,
    useToast,
    type UseDisclosureReturn,
    useDimensions,
} from "@chakra-ui/react";

export type WindowBreakpointType = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"

export const WINDOW_BREAKPOINTS: WindowBreakpoint[] = [
    {
        type: "xs",
        constraint: 320
    },
    {
        type: "sm",
        constraint: 640
    },
    {
        type: "md",
        constraint: 768
    },
    {
        type: "lg",
        constraint: 1024
    },
    {
        type: "xl",
        constraint: 1366
    },
    {
        type: "2xl",
        constraint: 1440
    },
    {
        type: "3xl",
        constraint: 1600
    },
]

export type WindowBreakpoint = {
    type: WindowBreakpointType,
    constraint: number
};

export type IBreakpointValues<T = any> = {
    [key in WindowBreakpointType]?: T;
}

export const useElementVisibleInViewport = (ref: React.RefObject<HTMLElement>, root?: Element | Document) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                setIsVisible(entry.isIntersecting);
            }
            );
        }, { root }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            observer.disconnect();
        }
    }
        , [ref]);
    return { isVisible };
}

export const useBreakpoint = () => {
    const [breakpoint, setBreakpoint] = useState<WindowBreakpointType>();
    const _onResize = ({ w, h }: any) => {
        for (let bp of WINDOW_BREAKPOINTS) {
            if (bp.constraint <= w) {
                continue;
            }
            setBreakpoint(bp.type);
            break;
        }
    }
    const onResize = () => {
        _onResize({ w: window.innerWidth, h: window.innerHeight });
    }
    if (typeof window !== "undefined") {
        useEffect(() => {
            window.addEventListener("resize", onResize)
            onResize()
            return () => window.removeEventListener("resize", onResize)
        }, [])
    }

    return { breakpoint };
}

export const useBreakpointValue = <T = any>(values: IBreakpointValues<T>) => {
    const { breakpoint } = useBreakpoint();
    const _vals: IBreakpointValues<T> = {
        "xs": values.xs,
        "sm": values.sm ?? values.xs,
        "md": values.md ?? values.sm ?? values.xs,
        "lg": values.lg ?? values.md ?? values.sm ?? values.xs,
        "xl": values.xl ?? values.lg ?? values.md ?? values.sm ?? values.xs,
        "2xl": values["2xl"] ?? values.xl ?? values.lg ?? values.md ?? values.sm ?? values.xs,
        "3xl": values["3xl"] ?? values["2xl"] ?? values.xl ?? values.lg ?? values.md ?? values.sm ?? values.xs,
    }
    return breakpoint ? _vals[breakpoint] : undefined;
}