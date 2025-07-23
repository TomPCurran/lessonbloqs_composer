import { useClass } from "@/hooks/useClass";
import { apiErrorHandler } from "@/store/api/apiErrorHandler";

const ClassDetails = ({ classId }) => {
  const { classData, isLoading, error } = useClass(classId);

  if (isLoading) return <div>Loading class...</div>;

  if (error) {
    if (error.status === 404) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">
            This class could not be found. It may have been deleted or you don't
            have permission to view it.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      );
    }

    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{apiErrorHandler.getErrorMessage(error)}</p>
      </div>
    );
  }

  if (!classData) return <div>No class data available</div>;

  return (
    <div>
      <h1>{classData.name}</h1>
      {/* Rest of your class display logic */}
    </div>
  );
};

export default ClassDetails;
