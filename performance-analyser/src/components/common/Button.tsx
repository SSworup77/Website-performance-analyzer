import React, { type FC, type ReactNode } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface ButtonProps {
	onClick: () => void;
	disabled?: boolean;
	loading?: boolean;
	children: ReactNode;
	variant?: "primary" | "secondary";
	className?: string;
}
const Button: FC<ButtonProps> = ({
	onClick,
	disabled = false,
	loading = false,
	children,
	variant = "primary",
	className = "",
}) => {
	const baseClasses =
		"px-6 py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed";
	const variantClasses = {
		primary:
			"bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 outline-none",
		secondary:
			"bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 outline-none",
	};
	return (
		<button
			onClick={onClick}
			disabled={disabled || loading}
			className={`${baseClasses} ${variantClasses[variant]} ${className}`}
		>
			{loading ? (
				<div>
					<LoadingSpinner size="md" color="white" className="mr-2" />
				</div>
			) : (
				children
			)}
		</button>
	);
};

export default Button;
