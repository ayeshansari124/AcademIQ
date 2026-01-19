// import React from "react";

// interface ModalProps {
//   open: boolean;
//   onClose: () => void;
//   title?: string;
//   children: React.ReactNode;
// }

// const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="w-full max-w-md rounded-md bg-white p-4 shadow-lg">
//         {title && (
//           <div className="mb-3 flex items-center justify-between">
//             <h2 className="text-lg font-semibold">{title}</h2>
//             <button onClick={onClose} className="text-gray-500 hover:text-black">
//               ✕
//             </button>
//           </div>
//         )}

//         {children}
//       </div>
//     </div>
//   );
// };

// export default Modal;
