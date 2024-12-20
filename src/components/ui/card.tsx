import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={className}
            {...props}
        />
    )
);
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={className}
            {...props}
        />
    )
);
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, CardProps>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={className}
            {...props}
        />
    )
);
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={className}
            {...props}
        />
    )
);
CardContent.displayName = "CardContent"

export { Card, CardContent, CardHeader, CardTitle };
