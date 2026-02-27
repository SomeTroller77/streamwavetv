export default async function ChannelPage({ params }) {
    const {id} = await params;
    return (
        <div className="p-10">
        <h1 className="text-3xl font-bold text-blue-700">
            Channel ID: {id}
        </h1>
        </div>
    );
}