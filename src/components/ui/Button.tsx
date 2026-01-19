// import React from "react";

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: "primary" | "secondary" | "danger";
//   loading?: boolean;
// }

// const Button: React.FC<ButtonProps> = ({
//   children,
//   variant = "primary",
//   loading = false,
//   disabled,
//   ...props
// }) => {
//   const base =
//     "px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";

//   const variants = {
//     primary: "bg-blue-600 text-white hover:bg-blue-700",
//     secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
//     danger: "bg-red-600 text-white hover:bg-red-700",
//   };

//   return (
//     <button
//       className={`${base} ${variants[variant]}`}
//       disabled={disabled || loading}
//       {...props}
//     >
//       {loading ? "Please wait..." : children}
//     </button>
//   );
// };

// export default Button;
