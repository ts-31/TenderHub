// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function CompanyPage() {
//   const router = useRouter();
//   const { id } = router.query;

//   const [company, setCompany] = useState<any>(null);
//   const [tenders, setTenders] = useState<any[]>([]);

//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//   useEffect(() => {
//     if (id) {
//       fetchCompanyAndTenders();
//     }
//   }, [id]);

//   const fetchCompanyAndTenders = async () => {
//     const res = await axios.get('http://localhost:5000/companies');
//     const target = res.data.find((c: any) => c.id === id);
//     setCompany(target);

//     const tendersRes = await axios.get('http://localhost:5000/tenders');
//     const companyTenders = tendersRes.data.filter((t: any) => t.companyId === id);
//     setTenders(companyTenders);
//   };

//   const handleApply = async (tenderId: string) => {
//     if (!token) return router.push('/login');

//     const proposal = prompt('Enter your proposal message:');
//     if (!proposal) return;

//     try {
//       await axios.post(
//         'http://localhost:5000/applications',
//         { tenderId, proposal },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       alert('Applied successfully!');
//     } catch (err) {
//       alert('Already applied or failed to apply');
//     }
//   };

//   if (!company) return <p className="p-4">Loading company...</p>;

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <div className="flex items-center gap-4 mb-6">
//         {company.logoUrl ? (
//           <img src={company.logoUrl} className="w-20 h-20 rounded-full object-cover" />
//         ) : (
//           <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-sm">No Logo</div>
//         )}
//         <div>
//           <h1 className="text-2xl font-bold">{company.name}</h1>
//           <p className="text-gray-600">{company.industry}</p>
//         </div>
//       </div>

//       <h2 className="text-xl font-semibold mb-4">Tenders by {company.name}</h2>
//       <div className="space-y-4">
//         {tenders.map((tender) => (
//           <div key={tender.id} className="border rounded p-4 shadow-sm">
//             <h3 className="text-lg font-semibold">{tender.title}</h3>
//             <p className="text-sm text-gray-500">{tender.description}</p>
//             <p className="text-sm">Budget: ₹{tender.budget}</p>
//             <p className="text-sm">Deadline: {tender.deadline?.slice(0, 10)}</p>
//             <button
//               onClick={() => handleApply(tender.id)}
//               className="mt-2 px-4 py-1 bg-green-600 text-white rounded"
//             >
//               Apply
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }






// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function CompanyPage() {
//   const router = useRouter();
//   const { id } = router.query;

//   const [company, setCompany] = useState<any>(null);
//   const [tenders, setTenders] = useState<any[]>([]);
//   const [myCompanyId, setMyCompanyId] = useState<string | null>(null);

//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//   useEffect(() => {
//     if (id) {
//       fetchCompany();
//       fetchTenders();
//       fetchMyCompany();
//     }
//   }, [id]);

//   const fetchCompany = async () => {
//     const res = await axios.get(`http://localhost:5000/companies/${id}`);
//     setCompany(res.data);
//   };

//   const fetchTenders = async () => {
//     const res = await axios.get(`http://localhost:5000/tenders?companyId=${id}`);
//     setTenders(res.data);
//   };

//   const fetchMyCompany = async () => {
//     if (!token) return;
//     try {
//       const res = await axios.get('http://localhost:5000/companies/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMyCompanyId(res.data.id);
//     } catch (err) {
//       console.error('Failed to fetch logged-in company');
//     }
//   };

//   const applyToTender = async (tenderId: string) => {
//     const proposal = prompt('Enter your proposal:');
//     if (!proposal || !token) return;

//     try {
//       await axios.post(
//         'http://localhost:5000/applications',
//         { tenderId, proposal },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert('Application submitted!');
//     } catch (err: any) {
//       const msg = err?.response?.data?.message || 'Application failed';
//       alert(msg);
//     }
//   };

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       {company && (
//         <>
//           <div className="flex items-center gap-4 mb-6">
//             {company.logoUrl ? (
//               <img src={company.logoUrl} className="w-16 h-16 rounded-full object-cover" />
//             ) : (
//               <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-sm">
//                 No Logo
//               </div>
//             )}
//             <div>
//               <h2 className="text-2xl font-semibold">{company.name}</h2>
//               <p className="text-sm text-gray-500">{company.industry}</p>
//             </div>
//           </div>

//           <h3 className="text-xl font-bold mb-4">Tenders by {company.name}</h3>
//           <div className="space-y-4">
//             {tenders.map((tender) => (
//               <div key={tender.id} className="border p-4 rounded shadow-sm">
//                 <h4 className="text-lg font-semibold">{tender.title}</h4>
//                 <p className="text-gray-600">{tender.description}</p>
//                 <p className="text-sm text-gray-500">Budget: ₹{tender.budget}</p>
//                 <p className="text-sm text-gray-500">Deadline: {tender.deadline.slice(0, 10)}</p>
//                 <button
//                   onClick={() => applyToTender(tender.id)}
//                   disabled={myCompanyId === company.id}
//                   className={`mt-3 px-4 py-2 rounded text-white ${
//                     myCompanyId === company.id
//                       ? 'bg-gray-400 cursor-not-allowed'
//                       : 'bg-green-600'
//                   }`}
//                 >
//                   {myCompanyId === company.id ? 'Own Tender' : 'Apply'}
//                 </button>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }








import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CompanyPage() {
  const router = useRouter();
  const { id } = router.query;

  const [company, setCompany] = useState<any>(null);
  const [tenders, setTenders] = useState<any[]>([]);
  const [myCompanyId, setMyCompanyId] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (id) {
      fetchCompanyAndTenders();
      fetchMyCompany();
    }
  }, [id]);

  const fetchCompanyAndTenders = async () => {
    const res = await axios.get('http://localhost:5000/companies');
    const target = res.data.find((c: any) => c.id === id);
    setCompany(target);

    const tendersRes = await axios.get('http://localhost:5000/tenders');
    const companyTenders = tendersRes.data.filter((t: any) => t.companyId === id);
    setTenders(companyTenders);
  };

  const fetchMyCompany = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/companies/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyCompanyId(res.data.id);
    } catch (err) {
      console.error('Failed to fetch logged-in company:', err);
    }
  };

  const handleApply = async (tenderId: string) => {
    if (!token) return router.push('/login');

    const proposal = prompt('Enter your proposal message:');
    if (!proposal) return;

    try {
      await axios.post(
        'http://localhost:5000/applications',
        { tenderId, proposal },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Applied successfully!');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Already applied or failed to apply';
      alert(msg);
    }
  };

  if (!company) return <p className="p-4">Loading company...</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        {company.logoUrl ? (
          <img src={company.logoUrl} className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-sm">
            No Logo
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-gray-600">{company.industry}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Tenders by {company.name}</h2>
      <div className="space-y-4">
        {tenders.map((tender) => {
          const isOwnTender = company.id === myCompanyId;

          return (
            <div key={tender.id} className="border rounded p-4 shadow-sm">
              <h3 className="text-lg font-semibold">{tender.title}</h3>
              <p className="text-sm text-gray-500">{tender.description}</p>
              <p className="text-sm">Budget: ₹{tender.budget}</p>
              <p className="text-sm">Deadline: {tender.deadline?.slice(0, 10)}</p>

              {!isOwnTender ? (
                <button
                  onClick={() => handleApply(tender.id)}
                  className="mt-2 px-4 py-1 bg-green-600 text-white rounded"
                >
                  Apply
                </button>
              ) : (
                <p className="mt-2 text-sm text-gray-500 italic">You posted this tender</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
