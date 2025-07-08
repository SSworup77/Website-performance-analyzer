import React, { type FC } from "react";

interface InputProps {
	onChange: (value: string) => void;
	id: string;
	value: string;
	label: string;
	placeholder?: string;
	onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	type?: string;
}
const Input: FC<InputProps> = ({
	id,
	label,
	value,
	placeholder,
	disabled,
	type = "text",
	onChange,
	onKeyPress,
}) => {
	return (
		<div>
			<label
				htmlFor={id}
				className="block text-sm font-semibold text-gray-600 mb-2"
			>
				{label}
			</label>
			<input
				type={type}
				value={value}
				placeholder={placeholder}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={onKeyPress}
				disabled={disabled}
				className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg outline-none focus:ring-2 focus:ring-amber-500"
			/>
		</div>
	);
};

export default Input;
