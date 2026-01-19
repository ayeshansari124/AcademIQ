// interface TableProps {
//   columns: string[];
//   data: (string | number | React.ReactNode)[][];
// }

// const Table: React.FC<TableProps> = ({ columns, data }) => {
//   return (
//     <div className="overflow-x-auto rounded-md border">
//       <table className="w-full border-collapse text-sm">
//         <thead className="bg-gray-100">
//           <tr>
//             {columns.map((col) => (
//               <th
//                 key={col}
//                 className="border px-3 py-2 text-left font-medium"
//               >
//                 {col}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((row, i) => (
//             <tr key={i} className="hover:bg-gray-50">
//               {row.map((cell, j) => (
//                 <td key={j} className="border px-3 py-2">
//                   {cell}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Table;
