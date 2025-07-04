import { cookies } from 'next/headers';

interface ApplicationsPageProps {
  params: {
    tenderId: number | string;
  };
}

interface Application {
  name: string;
  email: string;
  bid_amount: number;
  proposal: string;
  submitted_at: string;
}

interface ApplicationResponse {
  applications: Application[];
}



const ApplicationsPage = async ({ params }: ApplicationsPageProps) => {
    console.log(params.tenderId)
 const tenderId = params.tenderId;
   const cookieStore = await cookies();
  const token = await cookieStore.get('token')?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/application/${tenderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  const data: ApplicationResponse = await res.json();
  console.log(data)

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Applications for Tender #{tenderId}</h1>

      {data.applications?.length > 0 ? (
        <div className="space-y-6">
          {data.applications.map((app : Application, index : number) => (
            <div
              key={index}
              className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold">{app.name}</h2>
              <p className="text-sm text-zinc-500 mb-1">{app.email}</p>
              <p className="text-sm"><strong>Bid Amount:</strong> ₹{app.bid_amount}</p>
              <p className="text-sm"><strong>Proposal:</strong> {app.proposal}</p>
              <p className="text-xs text-zinc-400 mt-2">
                Submitted at: {new Date(app.submitted_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-zinc-500">No applications found for this tender.</p>
      )}
    </div>
  );
};

export default ApplicationsPage;
